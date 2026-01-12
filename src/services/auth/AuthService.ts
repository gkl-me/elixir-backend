import { STATUS_CODES } from "../../constants/statusCodes";
import { CustomError } from "../../errors/CustomError";
import { IUserRepository } from "../../repositories/user/interfaces/IUserRepository";
import { IPasswordHasher } from "../../utils/interfaces/IPasswordHasher";
import { ITokenManager } from "../../utils/interfaces/ITokenManager";
import { IAuthService} from "./interfaces/IAuthService";
import { LoginSchema, RegisterSchema}  from '../../validator/AuthSchema'
import { IAuthResponseDTO, IGoogleAuthDto, ILoginDTO, ILogoutDto, IRefreshTokenDto, IRefreshTokenResponseDto, IRegisterDTO, IVerifyDTO, IVerifyEmailDTO, } from "../../interfaces/dtos/AuthDTO";
import { authDtoMapper } from "../../interfaces/mapper/authDtoMapper";
import { AUTH_MESSAGES, CONSTANT_MESSAGES, } from "../../constants/messages";
import { inject, injectable } from "tsyringe";
import { Token } from "../../di/token";
import { IEmailService } from "../../utils/interfaces/IEmailService";
import { ENV } from "../../constants/env";
import { VERIFY_EMAIL_TEMPLATE } from "../../templates/template";
import { sentVerificationEmailJob } from "../../jobs/emailJobs";
import { ICacheRepository } from "../../repositories/cache/ICacheRepository";

@injectable()
export class AuthService implements IAuthService {

    constructor(
        @inject(Token.UserRepository) private _userRepository:IUserRepository,
        @inject(Token.PasswordHasher) private _passwordHasher:IPasswordHasher,
        @inject(Token.TokenManager) private _tokenManager:ITokenManager,
        @inject(Token.EmailService) private _emailService:IEmailService,
        @inject(Token.CacheRepository) private _cacheRepository:ICacheRepository<string>
    ){}

    async registerUser(user:IRegisterDTO):Promise<void>{
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


            // await this.sendVerificationEmail(
            //     {
            //         email:userToVerify.email, 
            //         userId:String(userToVerify._id)
            //     })

            await sentVerificationEmailJob(userToVerify.email,String(userToVerify._id))

        } catch (error) {
            if(error instanceof CustomError){
                throw error
            }
            throw new CustomError(CONSTANT_MESSAGES.INTERNAL_SERVER_ERROR,STATUS_CODES.INTERNAL_SERVER_ERROR)
        }
    }

    async loginUser(user:ILoginDTO): Promise<IAuthResponseDTO>{
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
            await this.sendVerificationEmail({email:userFound?.email,userId:userFound?._id as string})
            throw new CustomError(AUTH_MESSAGES.VERIFY_ERROR,  STATUS_CODES.FORBIDDEN)

        }


        //check if the user account is blocked
        if(userFound?.isBlocked){
            throw new CustomError(AUTH_MESSAGES.BLOCKED, STATUS_CODES.FORBIDDEN)
        }

        if(userFound?.googleId || !userFound.password){
            throw new CustomError(AUTH_MESSAGES.GOOGLE_AUTH,STATUS_CODES.BAD_REQUEST)
        }

        //check if the password is correct
        const isMatch = await this._passwordHasher.comparePasswords(password, userFound.password)
        
        if(!isMatch) throw new CustomError(CONSTANT_MESSAGES.INVALID_CREDENTIALS,STATUS_CODES.BAD_REQUEST)

        const resDto = authDtoMapper.toAuthResponse(userFound)

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

    async sendVerificationEmail(data:IVerifyEmailDTO): Promise<void> {
        try {

            const {email,userId} = data

            const verificationToken = this._tokenManager.generateAccessToken(userId,'user')
            const verificationUrl = `${ENV.CLIENT_URL}/verify/${verificationToken}`
            
            await this._emailService.sendEmail(email,"Verify your email",VERIFY_EMAIL_TEMPLATE(verificationUrl))  

        } catch (error) {
            if(error instanceof CustomError){
                throw error
            }
            throw new CustomError(CONSTANT_MESSAGES.INTERNAL_SERVER_ERROR,STATUS_CODES.INTERNAL_SERVER_ERROR)
        }
    }

    async verifyUser(data:IVerifyDTO): Promise<void> {

        try {

            const {token} = data

            if(!token){
                throw new CustomError(AUTH_MESSAGES.TOKEN_ERROR,STATUS_CODES.BAD_REQUEST)
            }

            const {id} = this._tokenManager.decodeToken(token)

            const user = await this._userRepository.findById(id)
            if(!user){
                throw new CustomError(AUTH_MESSAGES.NOT_FOUND, STATUS_CODES.NOT_FOUND)
            }

            user.isVerified = true
            user.save()

        } catch (error) {
            if(error instanceof CustomError){
                throw error
            }
            throw new CustomError(CONSTANT_MESSAGES.INTERNAL_SERVER_ERROR,STATUS_CODES.INTERNAL_SERVER_ERROR)
        }


    }

    async googleAuth(data: IGoogleAuthDto): Promise<IAuthResponseDTO> {
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

            if(userFound) return authDtoMapper.toAuthResponse(userFound)
            if(user) return authDtoMapper.toAuthResponse(user)

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
            const isBlackListed = await this._cacheRepository.exists(`bl:${refreshToken}`)
            if(isBlackListed){
                throw new CustomError(CONSTANT_MESSAGES.UNAUTHORIZED,STATUS_CODES.UNAUTHORIZED)
            }
            
            const verifyToken = await this._tokenManager.verifyToken(refreshToken,'refresh')
            if(!verifyToken) throw new CustomError(CONSTANT_MESSAGES.UNAUTHORIZED,STATUS_CODES.UNAUTHORIZED)

            const accessToken = this._tokenManager.generateAccessToken(verifyToken.id,verifyToken.role)

            return {
                accessToken
            }
            
        } catch (error) {
            if(error instanceof CustomError){
                throw error
            }
            throw new CustomError(CONSTANT_MESSAGES.INTERNAL_SERVER_ERROR,STATUS_CODES.INTERNAL_SERVER_ERROR)
        }
    }

    async logoutUser(data: ILogoutDto): Promise<void> {
        try {

            const {accessToken,refreshToken} = data

            await this._cacheRepository.set(`bl:${accessToken}`,"1",ENV.ACCESS_TOKEN_TTL)
            await this._cacheRepository.set(`bl:${refreshToken}`,"1",ENV.REFRESH_TOKEN_TTL)

            
        } catch (error) {
            if(error instanceof CustomError){
                throw error
            }
            throw new CustomError(CONSTANT_MESSAGES.INTERNAL_SERVER_ERROR,STATUS_CODES.INTERNAL_SERVER_ERROR)
        }
    }
}