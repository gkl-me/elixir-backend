import { STATUS_CODES } from "../../constants/statusCodes";
import { CustomError } from "../../errors/CustomError";
import { IUserRepository } from "../../repositories/user/interfaces/IUserRepository";
import { IPasswordHasher } from "../../providers/interfaces/IPasswordHasher";
import { ITokenManager } from "../../providers/interfaces/ITokenManager";
import { IAuthService} from "./interfaces/IAuthService";
import { LoginSchema, RegisterSchema}  from '../../validator/AuthSchema'
import { IAuthResponseDto, IForgotPasswordDto, IGithubAuthDto, IGoogleAuthDto, ILoginDto, ILogoutDto, IRefreshTokenDto, IRefreshTokenResponseDto, IRegisterDto } from "../../interfaces/dtos/AuthDTO";
import { authDtoMapper } from "../../interfaces/mapper/authDtoMapper";
import { AUTH_MESSAGES, CONSTANT_MESSAGES, USER_MESSAGES, } from "../../constants/messages";
import { inject, injectable } from "tsyringe";
import { Token } from "../../di/token";
import { IEmailService } from "../../providers/interfaces/IEmailService";
import { ENV } from "../../constants/env";
import { ICacheRepository } from "../../repositories/cache/ICacheRepository";
import { REDIS_STORE } from "../../constants/redis/redisStore";
import { AUTH_ERROR_CODE } from "../../constants/errorCode";
import { IUserService } from "../user/interface/IUserService";
import { sendVerificationEmailJob } from "../../queues/email/email.producer";
import { IAuthSession } from "../../interfaces/types/session.types";
import { ILoginMetaDto } from "../../interfaces/dtos/MetaDto";
import { OAuth2Client } from "google-auth-library";
import { userDtoMapper } from "../../interfaces/mapper/userDtoMapper";
import { GithubAuthService } from "../../providers/GithubAuthService";
import { IGithubAuthService } from "../../providers/interfaces/IGithubAuthService";

@injectable()
export class AuthService implements IAuthService {

    private _oAuthClient:OAuth2Client

    constructor(
        @inject(Token.UserRepository) private _userRepository:IUserRepository,
        @inject(Token.PasswordHasher) private _passwordHasher:IPasswordHasher,
        @inject(Token.TokenManager) private _tokenManager:ITokenManager,
        @inject(Token.EmailService) private _emailService:IEmailService,
        @inject(Token.CacheRepository) private _cacheRepository:ICacheRepository<string|IAuthSession>,
        @inject(Token.UserService) private _userService:IUserService,
        @inject(Token.GithubAuthService) private readonly _githubAuthService:IGithubAuthService
    ){
        this._oAuthClient = new OAuth2Client(ENV.GOOGLE_CLIENT_ID)
    }

    async register(user:IRegisterDto):Promise<void>{
        const {name,email,password} = user

        try {

            //validate user data using zod
            const validate = RegisterSchema.safeParse(user)
            if(!validate.success){
                const errorMessages = validate.error.errors[0].message
                throw new CustomError(errorMessages, STATUS_CODES.BAD_REQUEST)
            }


            const hashedPassword = await this._passwordHasher.hashPassword(password)

            //check if user already exists
            const existingUser = await this._userRepository.findByEmail(email)
            if(existingUser?.isVerified) throw new CustomError(AUTH_MESSAGES.ALREADY_EXITS, STATUS_CODES.CONFLICT)
            
            let userToVerify;

            if(existingUser && !existingUser.isVerified){
                existingUser.name = name,
                existingUser.email = email,
                existingUser.password = hashedPassword
                userToVerify = await existingUser.save()
            }else{
                userToVerify= await this._userRepository.create({name,email,password:hashedPassword})
            }


            //call queue to sent mail 
            await sendVerificationEmailJob(email)

        } catch (error) {
            throw error
        }
    }

    /**
     * 
     * @param {ILoginDto} user 
     * @param {ILoginMetaDto} meta 
     * @returns {Promise<IAuthResponseDto>}
     */
    async login(user:ILoginDto,meta:ILoginMetaDto): Promise<IAuthResponseDto>{
        try {

        const {email,password} = user

        //validate user data using zod
        const validate = LoginSchema.safeParse(user)
        if(!validate.success){
            const errorMessages = validate.error.errors[0].message
            throw new CustomError(errorMessages, STATUS_CODES.BAD_REQUEST)
        }

        const userFound = await this._userRepository.findByEmail(email)
        
        //check if a user exist with this email
        if(!userFound) throw new CustomError(AUTH_MESSAGES.NOT_FOUND, STATUS_CODES.NOT_FOUND)

        //check if the user is verified
        if(!userFound?.isVerified){
            throw new CustomError(AUTH_MESSAGES.VERIFY_ERROR,STATUS_CODES.BAD_REQUEST,AUTH_ERROR_CODE.NOT_VERIFIED)
        }


        //check if the user account is blocked
        // need to send error code here
        if(userFound?.isBlocked){
            throw new CustomError(AUTH_MESSAGES.BLOCKED, STATUS_CODES.FORBIDDEN,AUTH_ERROR_CODE.BLOCKED)
        }

        if(!userFound.password && userFound?.googleId){
            throw new CustomError(AUTH_MESSAGES.GITHUB_AUTH,STATUS_CODES.BAD_REQUEST)
        }

        if(!userFound.password && userFound?.githubId){
            throw new CustomError(AUTH_MESSAGES.GOOGLE_AUTH,STATUS_CODES.BAD_REQUEST)
        }

        if(!userFound.password){
            throw new CustomError(CONSTANT_MESSAGES.BAD_REQUEST,STATUS_CODES.BAD_REQUEST)
        }

        //check if the password is correct
        const isMatch = await this._passwordHasher.comparePasswords(password, userFound?.password)
        
        if(!isMatch) throw new CustomError(CONSTANT_MESSAGES.INVALID_CREDENTIALS,STATUS_CODES.BAD_REQUEST)

        //session and token manangement

        const sessionId = this._tokenManager.generateSessionId()
        const tokenVersion = 1

        const accessToken = await this._tokenManager.generateAccessToken(String(userFound._id),userFound.role,sessionId)
        const refreshToken = await this._tokenManager.generateRefreshToken(String(userFound._id),userFound.role,sessionId,tokenVersion)

        const refreshTokenHash = await this._tokenManager.hashToken(refreshToken)

        //session handling,

        const now = Date.now()

        //expires at time
        const expiresAt = now + ENV.REFRESH_TOKEN_TTL*1000


        const session:IAuthSession = {
            userId:String(userFound._id),
            refreshTokenHash,
            tokenVersion,
            ip:meta.ip,
            userAgent:meta.userAgent,
            createdAt:now,
            expiresAt
        }

        await this._cacheRepository.set(REDIS_STORE.SESSION+sessionId,session,ENV.REFRESH_TOKEN_TTL)

        //add user sessions into redis user session list
        await this._cacheRepository.addSet(REDIS_STORE.USER_SESSION+String(userFound._id),sessionId)


        const resDto = authDtoMapper.toAuthResponse(userFound,accessToken,refreshToken)

        return {
            ...resDto
        }
                    
        } catch (error) {
            if(error instanceof CustomError){
                throw error
            }
            throw new CustomError(CONSTANT_MESSAGES.INTERNAL_SERVER_ERROR,STATUS_CODES.INTERNAL_SERVER_ERROR)
        }
    }


    //need to update google auth
    async googleAuth(data: IGoogleAuthDto,meta:ILoginMetaDto): Promise<IAuthResponseDto> {
        try {
            
            const {idToken} = data

            if(!idToken){
                throw new CustomError(AUTH_MESSAGES.GOOGLE_TOKEN_ERROR,STATUS_CODES.BAD_REQUEST)
            }

            const ticket = await this._oAuthClient.verifyIdToken({
                idToken,
                audience:ENV.GOOGLE_CLIENT_ID
            })

            const payload = await ticket.getPayload()

            if(!payload?.email){
                throw new CustomError(AUTH_MESSAGES.INVALID_GOOGLE_ACC,STATUS_CODES.BAD_REQUEST)
            }


            const userFound = await this._userRepository.findByEmail(payload?.email)

            //check if the user is blocked or not 
            if(userFound?.isBlocked){
                throw new CustomError(AUTH_MESSAGES.BLOCKED,STATUS_CODES.FORBIDDEN,AUTH_ERROR_CODE.BLOCKED)
            }
            
            let user=userFound;
            if(userFound && !userFound.googleId){
                user = await this._userRepository.update(String(userFound._id),{
                    isVerified:true,
                    googleId:payload.sub,
                    avatarUrl:payload?.picture
                })
            }
            if(!userFound){
                user = await this._userRepository.create({
                    name:payload?.name,
                    email:payload?.email,
                    googleId:payload?.sub,
                    avatarUrl:payload?.picture,
                    isVerified:true
                })
            }

            if(!user){
                throw new CustomError(CONSTANT_MESSAGES.BAD_REQUEST,STATUS_CODES.BAD_REQUEST)
            }


            //session and token manangement

            const sessionId = this._tokenManager.generateSessionId()
            const tokenVersion = 1

            const accessToken = await this._tokenManager.generateAccessToken(String(user._id),user.role,sessionId)
            const refreshToken = await this._tokenManager.generateRefreshToken(String(user._id),user.role,sessionId,tokenVersion)

            const refreshTokenHash = await this._tokenManager.hashToken(refreshToken)

            //session handling,

            const now = Date.now()

            //expires at time
            const expiresAt = now + ENV.REFRESH_TOKEN_TTL*1000


            const session:IAuthSession = {
                userId:String(user._id),
                refreshTokenHash,
                tokenVersion,
                ip:meta.ip,
                userAgent:meta.userAgent,
                createdAt:now,
                expiresAt
            }

            await this._cacheRepository.set(REDIS_STORE.SESSION+sessionId,session,ENV.REFRESH_TOKEN_TTL)

            //add user sessions into redis user session list
            await this._cacheRepository.addSet(REDIS_STORE.USER_SESSION+String(user._id),sessionId)

            

            if(user) return authDtoMapper.toAuthResponse(user,accessToken,refreshToken)

            throw new CustomError(CONSTANT_MESSAGES.INTERNAL_SERVER_ERROR, STATUS_CODES.INTERNAL_SERVER_ERROR);

        } catch (error) {
            if(error instanceof CustomError) throw error
            throw new CustomError(CONSTANT_MESSAGES.INTERNAL_SERVER_ERROR,STATUS_CODES.INTERNAL_SERVER_ERROR)
        }
    }

    async githubAuth(data: IGithubAuthDto, meta: ILoginMetaDto): Promise<IAuthResponseDto> {
        try {


            const {githubId,name,email,image,githubUsername,access_token} = data

            const gitubEmails = await this._githubAuthService.verifyGithubUser(access_token)

            const emailVerified = gitubEmails.find((e) => e.primary && e.verified && e.email==email)
            
            if(!emailVerified){
                throw new CustomError(CONSTANT_MESSAGES.BAD_REQUEST,STATUS_CODES.BAD_REQUEST)
            }


            const userFound = await this._userRepository.findByEmail(email)

            //check if the user is blocked or not 
            if(userFound?.isBlocked){
                throw new CustomError(AUTH_MESSAGES.BLOCKED,STATUS_CODES.FORBIDDEN,AUTH_ERROR_CODE.BLOCKED)
            }
            

            let user=userFound;

            if(userFound && !userFound.githubId){
                user = await this._userRepository.update(String(userFound._id),{
                    isVerified:true,
                    avatarUrl:image,
                    githubId,
                    githubUsername
                })
            }
            if(!userFound){
                user = await this._userRepository.create({
                    name,
                    email,
                    isVerified:true,
                    avatarUrl:image,
                    githubId,
                    githubUsername
                })
            }

             if(!user){
                throw new CustomError(CONSTANT_MESSAGES.BAD_REQUEST,STATUS_CODES.BAD_REQUEST)
            }

            //session and token manangement
            const sessionId = this._tokenManager.generateSessionId()
            const tokenVersion = 1

            const accessToken = await this._tokenManager.generateAccessToken(String(user._id),user.role,sessionId)
            const refreshToken = await this._tokenManager.generateRefreshToken(String(user._id),user.role,sessionId,tokenVersion)

            const refreshTokenHash = await this._tokenManager.hashToken(refreshToken)

            //session handling,
            const now = Date.now()

            //expires at time
            const expiresAt = now + ENV.REFRESH_TOKEN_TTL*1000


            const session:IAuthSession = {
                userId:String(user._id),
                refreshTokenHash,
                tokenVersion,
                ip:meta.ip,
                userAgent:meta.userAgent,
                createdAt:now,
                expiresAt
            }

            await this._cacheRepository.set(REDIS_STORE.SESSION+sessionId,session,ENV.REFRESH_TOKEN_TTL)

            //add user sessions into redis user session list
            await this._cacheRepository.addSet(REDIS_STORE.USER_SESSION+String(user._id),sessionId)   

            const resDto = authDtoMapper.toAuthResponse(user,accessToken,refreshToken)

            return {
                ...resDto
            }

        } catch (error) {
            throw error
        }
    }

    async refreshToken(data: IRefreshTokenDto): Promise<IRefreshTokenResponseDto> {
        try {

            const {refreshToken} = data
            if(!refreshToken) throw new CustomError(CONSTANT_MESSAGES.UNAUTHORIZED,STATUS_CODES.UNAUTHORIZED)
            
            //verify token payload
            const payload = await this._tokenManager.verifyToken(refreshToken,'refresh')
            if(!payload) throw new CustomError(CONSTANT_MESSAGES.UNAUTHORIZED,STATUS_CODES.UNAUTHORIZED)

            //check if user is blocked or not
            const user = await this._userRepository.findById(payload.userId)
            if(user?.isBlocked) throw new CustomError(CONSTANT_MESSAGES.FORBIDDEN,STATUS_CODES.FORBIDDEN,AUTH_ERROR_CODE.BLOCKED)


            //session check 
            const session = await this._cacheRepository.get(REDIS_STORE.SESSION+payload.sessionId)

            if(!session || typeof session == 'string') throw new CustomError(CONSTANT_MESSAGES.UNAUTHORIZED,STATUS_CODES.UNAUTHORIZED)

            const tokenHash = await this._tokenManager.hashToken(refreshToken)

            //check if token reuse
            if(tokenHash !== session.refreshTokenHash ||  payload.tokenVersion !== session.tokenVersion ){
                await this._cacheRepository.delete(REDIS_STORE.SESSION+payload.sessionId)
                throw new CustomError(CONSTANT_MESSAGES.UNAUTHORIZED,STATUS_CODES.UNAUTHORIZED)
            }

            //update token version
            const newVersion = session.tokenVersion + 1

            //create new token and rotate token
            const newAccessToken = this._tokenManager.generateAccessToken(payload.userId,payload.role,payload.sessionId)

            const newRefreshToken = this._tokenManager.generateRefreshToken(payload.userId,payload.role,payload.sessionId,newVersion)

            session.tokenVersion = newVersion
            session.refreshTokenHash = this._tokenManager.hashToken(newRefreshToken)

            //update the redis with new hash and version and new ttl
            const ttl = Math.floor((session.expiresAt -  Date.now())/1000 )
            await this._cacheRepository.set(REDIS_STORE.SESSION+payload.sessionId,session,ttl)

            return {
                newAccessToken,
                newRefreshToken
            }
            
        } catch (error) {
            if(error instanceof CustomError){
                throw error
            }
            throw new CustomError(CONSTANT_MESSAGES.INTERNAL_SERVER_ERROR,STATUS_CODES.INTERNAL_SERVER_ERROR)
        }
    }

    async logout(data: ILogoutDto): Promise<void> {
        try {

            const {refreshToken} = data

             if(!refreshToken) return;

             //find session and delete session
             const payload = this._tokenManager.verifyToken(refreshToken,'refresh')

             const sessionKey = REDIS_STORE.SESSION + payload.sessionId

             await this._cacheRepository.delete(sessionKey)

             //delete from user set in redis
             await this._cacheRepository.remSet(
                REDIS_STORE.USER_SESSION+payload.userId,
                payload.sessionId
             )
            
        } catch (error) {
            if(error instanceof CustomError){
                throw error
            }
            throw new CustomError(CONSTANT_MESSAGES.INTERNAL_SERVER_ERROR,STATUS_CODES.INTERNAL_SERVER_ERROR)
        }
    }
}