import { STATUS_CODES } from "../../constants/statusCodes";
import { CustomError } from "../../errors/CustomError";
import { IUserRepository } from "../../repositories/user/interfaces/IUserRepository";
import { IPasswordHasher } from "../../utils/interfaces/IPasswordHasher";
import { ITokenManager } from "../../utils/interfaces/ITokenManager";
import { IAuthService} from "./interfaces/IAuthService";
import { UserLoginSchema,UserRegisterSchema}  from '../../validator/user/UserAuthSchema'
import { IAuthResponseDTO, ILoginDTO, IRegisterDTO, IVerifyDTO, IVerifyEmailDTO, } from "../../interfaces/dtos/AuthDTO";
import { authDtoMapper } from "../../interfaces/mapper/authDtoMapper";
import { AUTH_MESSAGES, CONSTANT_MESSAGES, } from "../../constants/messages";
import { inject, injectable } from "tsyringe";
import { Token } from "../../di/token";
import { IEmailService } from "../../utils/interfaces/IEmailService";
import { ENV } from "../../constants/env";
import { VERIFY_EMAIL_TEMPLATE } from "../../constants/template";

@injectable()
export class UserAuthService implements IAuthService {

    constructor(
        @inject(Token.UserRepository) private _userRepository:IUserRepository,
        @inject(Token.PasswordHasher) private _passwordHasher:IPasswordHasher,
        @inject(Token.TokenManager) private _tokenManager:ITokenManager,
        @inject(Token.EmailService) private _emailService:IEmailService,
    ){}

    async registerUser(user:IRegisterDTO):Promise<void>{
        const {name,email,password} = user

        try {

            //validate user data using zod
            const validate = UserRegisterSchema.safeParse(user)
            if(!validate.success){
                const errorMessages = validate.error.errors[0].message
                throw new CustomError(errorMessages, STATUS_CODES.BAD_REQUEST)
            }


            const hashedPassword = await this._passwordHasher.hashPassword(password)

            //check if user already exists
            const existingUser = await this._userRepository.findByEmail(email)
            if(existingUser) throw new CustomError(AUTH_MESSAGES.ALREADY_EXITS, STATUS_CODES.CONFLICT)

            const newUser = await this._userRepository.create({name,email,password:hashedPassword})

            await this.sendVerificationEmail(
                {
                    email:newUser.email, 
                    userId:newUser.id
                })


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
        const validate = UserLoginSchema.safeParse(user)
        if(!validate.success){
            const errorMessages = validate.error.errors[0].message
            throw new CustomError(errorMessages, STATUS_CODES.BAD_REQUEST)
        }

        const userFound = await this._userRepository.findByEmail(email)
        
        //check if a user exist with this email
        if(!userFound) throw new CustomError(AUTH_MESSAGES.NOT_FOUND, STATUS_CODES.NOT_FOUND)

        //check if the user is verified
        if(!userFound?.isVerified){
            throw new CustomError(AUTH_MESSAGES.VERIFY_ERROR, STATUS_CODES.UNAUTHORIZED)
        }


        //check if the user account is blocked
        if(userFound?.isBlocked){
            throw new CustomError(AUTH_MESSAGES.BLOCKED, STATUS_CODES.FORBIDDEN)
        }

        //check if the password is correct
        const isMatch = await this._passwordHasher.comparePasswords(password, userFound.password)
        
        if(!isMatch) throw new CustomError(CONSTANT_MESSAGES.INVALID_CREDENTIALS,STATUS_CODES.UNAUTHORIZED)

        //role of user
        const role = userFound.userType
        
        const accessToken = this._tokenManager.generateAccessToken(userFound._id as string,role)
        const refreshToken = this._tokenManager.generateRefreshToken(userFound._id as string,role)

        const resDto = authDtoMapper.toAuthResponse(userFound)

        return {
            accessToken,
            refreshToken,
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
            const verificationUrl = `${ENV.CLIENT_URL}/verify?token=${verificationToken}`
            
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
                throw new CustomError(AUTH_MESSAGES.TOKEN_ERROR,STATUS_CODES.UNAUTHORIZED)
            }

            const {id} = await this._tokenManager.verifyToken(token,'access')

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

}