import { STATUS_CODES } from "../../constants/statusCodes";
import { CustomError } from "../../errors/CustomError";
import { LoginDTO, RegisterDTO, UserLoginResponseDTO, UserRegisterResponseDTO,} from "../../interfaces/dtos/UserDTO";
import { IUserRepository } from "../../repositories/user/interfaces/IUserRepository";
import { IPasswordHasher } from "../../utils/interfaces/IPasswordHasher";
import { ITokenManager } from "../../utils/interfaces/ITokenManager";
import { IUserAuthService } from "./interfaces/IUserAuthService";
import { UserLoginSchema,UserRegisterSchema}  from '../../validator/user/UserAuthSchema'
import { IUserVerifyService } from "./interfaces/IUserVerifyService";

export class UserAuthService implements IUserAuthService {

    constructor(
        private userRepository:IUserRepository,
        private PasswordHasher:IPasswordHasher,
        private tokenManager:ITokenManager,
        private userVerifyService:IUserVerifyService,
    ){}

    async registerUser(user:RegisterDTO):Promise<UserRegisterResponseDTO>{
        const {name,email,password} = user

        try {

            //validate user data using zod

            const validate = UserRegisterSchema.safeParse(user)

            if(!validate.success){
                if(validate.error){
                    throw new CustomError(validate.error.errors[0].message, STATUS_CODES.BAD_REQUEST)
                }
            }

            const hashedPassword = await this.PasswordHasher.hashPassword(password)
            const newUser = await this.userRepository.create({name,email,password:hashedPassword})

            await this.userVerifyService.sendVerificationEmail(newUser.email, newUser.id)

            return {user:newUser}

        } catch (error) {
            console.log(error,'register service')
            if(error instanceof Error) throw new Error(error.message)
            throw new Error('Unexpected Error')
        }
    }

    async loginUser(user:LoginDTO): Promise<UserLoginResponseDTO>{
        const {email,password} = user

        //validate user data using zod

        const validate = UserLoginSchema.safeParse(user)
        if(!validate.success){
            if(validate.error){
                throw new CustomError(validate.error.errors[0].message, STATUS_CODES.BAD_REQUEST)
            }
        }

        const userFound = await this.userRepository.findByEmail(email)

        if(!userFound.isVerified){
            throw new CustomError('User not verified', STATUS_CODES.UNAUTHORIZED)
        }

        if(!userFound) throw new Error('User not found')

        const isMatch = await this.PasswordHasher.comparePasswords(password, userFound.password)
        if(!isMatch) throw new Error('Invalid credentials')
        
        const accessToken = this.tokenManager.generateAccessToken(userFound.id,'user')
        const refreshToken = this.tokenManager.generateRefreshToken(userFound.id,'user')

        return {
            accessToken,
            refreshToken,
            user:userFound
        }


    }
}