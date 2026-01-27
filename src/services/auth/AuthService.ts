import { STATUS_CODES } from "../../constants/statusCodes";
import { CustomError } from "../../errors/CustomError";
import { IUserRepository } from "../../repositories/user/interfaces/IUserRepository";
import { IPasswordHasher } from "../../providers/interfaces/IPasswordHasher";
import { ITokenManager } from "../../providers/interfaces/ITokenManager";
import { IAuthService} from "./interfaces/IAuthService";
import { LoginSchema, RegisterSchema}  from '../../validator/AuthSchema'
import { IAuthResponseDto, IForgotPasswordDto, IGoogleAuthDto, ILoginDto, ILogoutDto, IRefreshTokenDto, IRefreshTokenResponseDto, IRegisterDto } from "../../interfaces/dtos/AuthDTO";
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

@injectable()
export class AuthService implements IAuthService {

    constructor(
        @inject(Token.UserRepository) private _userRepository:IUserRepository,
        @inject(Token.PasswordHasher) private _passwordHasher:IPasswordHasher,
        @inject(Token.TokenManager) private _tokenManager:ITokenManager,
        @inject(Token.EmailService) private _emailService:IEmailService,
        @inject(Token.CacheRepository) private _cacheRepository:ICacheRepository<string|IAuthSession>,
        @inject(Token.UserService) private _userService:IUserService
    ){}

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
            throw new CustomError(AUTH_MESSAGES.VERIFY_ERROR,  STATUS_CODES.FORBIDDEN,AUTH_ERROR_CODE.NOT_VERIFIED)
        }


        //check if the user account is blocked
        // need to send error code here
        if(userFound?.isBlocked){
            throw new CustomError(AUTH_MESSAGES.BLOCKED, STATUS_CODES.FORBIDDEN)
        }

        if(!userFound.password && userFound?.googleId){
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

        const now = new Date();

        //expires at time
        const expiresAt = new Date(
        now.getTime() + (ENV.REFRESH_TOKEN_TTL * 1000 ) // 30 days in ms
        );


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

        //add user sessions into redis
        await this._cacheRepository.set(REDIS_STORE.USER_SESSION+String(userFound._id),sessionId)


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
    async googleAuth(data: IGoogleAuthDto): Promise<IAuthResponseDto> {
        try {
            
            const {name,email,googleId,image} = data

            const userFound = await this._userRepository.findByEmail(email)
            let user;
            if(!userFound){
                user = await this._userRepository.create({
                    name,
                    email,
                    googleId,
                    avatarUrl:image,
                    isVerified:true
                })
            }

            if(userFound) return authDtoMapper.toAuthResponse(userFound,"access","refresh")
            if(user) return authDtoMapper.toAuthResponse(user,"access","refresh")

            throw new CustomError(CONSTANT_MESSAGES.INTERNAL_SERVER_ERROR, STATUS_CODES.INTERNAL_SERVER_ERROR);

        } catch (error) {
            if(error instanceof CustomError) throw error
            throw new CustomError(CONSTANT_MESSAGES.INTERNAL_SERVER_ERROR,STATUS_CODES.INTERNAL_SERVER_ERROR)
        }
    }

    async refreshToken(data: IRefreshTokenDto): Promise<IRefreshTokenResponseDto> {
        try {

            const {refreshToken} = data
            if(!refreshToken) throw new CustomError(CONSTANT_MESSAGES.UNAUTHORIZED,STATUS_CODES.UNAUTHORIZED)

            //check blacklisted
            const isBlackListed = await this._cacheRepository.exists(REDIS_STORE.BLACKLIST+refreshToken)
            if(isBlackListed){
                throw new CustomError(CONSTANT_MESSAGES.UNAUTHORIZED,STATUS_CODES.UNAUTHORIZED)
            }
            
            //verify token payload
            const payload = await this._tokenManager.verifyToken(refreshToken,'refresh')
            if(!payload) throw new CustomError(CONSTANT_MESSAGES.UNAUTHORIZED,STATUS_CODES.UNAUTHORIZED)


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
            const ttl = Math.floor((session.expiresAt.getTime() - session.createdAt.getTime())/1000 )
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