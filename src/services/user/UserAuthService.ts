import { STATUS_CODES } from "../../constants/statusCodes";
import { CustomError } from "../../errors/CustomError";
import { IUserRepository } from "../../repositories/user/interfaces/IUserRepository";
import { IPasswordHasher } from "../../utils/interfaces/IPasswordHasher";
import { ITokenManager } from "../../utils/interfaces/ITokenManager";
import { IUserAuthService } from "./interfaces/IUserAuthService";
import { UserLoginSchema,UserRegisterSchema}  from '../../validator/user/UserAuthSchema'
import { IUserVerifyService } from "./interfaces/IUserVerifyService";
import { IUserAuthResponseDTO, IUserLoginDTO, IUserRegisterDTO } from "../../interfaces/dtos/user/AuthDTO";
import { IUserResponseDTO } from "../../interfaces/dtos/user/UserDTO";
import { userDtoMapper } from "../../interfaces/mapper/userDtoMapper";
import { ERROR_MESSAGES } from "../../constants/errorMessages";
import { inject, injectable } from "tsyringe";
import { Token } from "../../di/token";

@injectable()
export class UserAuthService implements IUserAuthService {

    constructor(
        @inject(Token.UserRepository) private userRepository:IUserRepository,
        @inject(Token.PasswordHasher) private passwordHasher:IPasswordHasher,
        @inject(Token.TokenManager) private tokenManager:ITokenManager,
        @inject(Token.UserVerifyService) private userVerifyService:IUserVerifyService,
    ){}

    async registerUser(user:IUserRegisterDTO):Promise<IUserResponseDTO>{
        const {name,email,password} = user

        try {

            //validate user data using zod
            const validate = UserRegisterSchema.safeParse(user)
            if(!validate.success){
                const errorMessages = validate.error.errors[0].message
                throw new CustomError(errorMessages, STATUS_CODES.BAD_REQUEST)
            }


            const hashedPassword = await this.passwordHasher.hashPassword(password)

            //check if user already exists
            const existingUser = await this.userRepository.findByEmail(email)
            if(existingUser) throw new CustomError('Email already exists', STATUS_CODES.CONFLICT)

            const newUser = await this.userRepository.create({name,email,password:hashedPassword})

            await this.userVerifyService.sendVerificationEmail(newUser.email, newUser.id)

            return userDtoMapper(newUser)

        } catch (error) {
            if(error instanceof CustomError){
                throw error
            }
            throw new CustomError(ERROR_MESSAGES.INTERNAL_SERVER_ERROR,STATUS_CODES.INTERNAL_SERVER_ERROR)
        }
    }

    async loginUser(user:IUserLoginDTO): Promise<IUserAuthResponseDTO>{
        try {

        const {email,password} = user

        //validate user data using zod
        const validate = UserLoginSchema.safeParse(user)
        if(!validate.success){
            const errorMessages = validate.error.errors[0].message
            throw new CustomError(errorMessages, STATUS_CODES.BAD_REQUEST)
        }

        const userFound = await this.userRepository.findByEmail(email)
        
        //check if a user exist with this email
        if(!userFound) throw new CustomError('User not found, Signup', STATUS_CODES.NOT_FOUND)

        //check if the user is verified
        if(!userFound?.isVerified){
            throw new CustomError('User not verified', STATUS_CODES.UNAUTHORIZED)
        }


        //check if the user account is blocked
        if(userFound?.isBlocked){
            throw new CustomError('User account is blocked', STATUS_CODES.FORBIDDEN)
        }

        //check if the password is correct
        const isMatch = await this.passwordHasher.comparePasswords(password, userFound.password)
        
        if(!isMatch) throw new CustomError('Invalid Credentials',STATUS_CODES.UNAUTHORIZED)
        
        const accessToken = this.tokenManager.generateAccessToken(userFound._id as string,'user')
        const refreshToken = this.tokenManager.generateRefreshToken(userFound._id as string,'user')

        return {
            accessToken,
            refreshToken,
            user:userDtoMapper(userFound)
        }
                    
        } catch (error) {
            if(error instanceof CustomError){
                throw error
            }
            throw new CustomError(ERROR_MESSAGES.INTERNAL_SERVER_ERROR,STATUS_CODES.INTERNAL_SERVER_ERROR)
        }
    }
}