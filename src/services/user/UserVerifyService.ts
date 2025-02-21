import { ERROR_MESSAGES } from "../../constants/errorMessages";
import { STATUS_CODES } from "../../constants/statusCodes";
import { CustomError } from "../../errors/CustomError";
import { IUserRepository } from "../../repositories/user/interfaces/IUserRepository";
import { IEmailService } from "../../utils/interfaces/IEmailService";
import { ITokenManager } from "../../utils/interfaces/ITokenManager";
import { IUserVerifyService } from "./interfaces/IUserVerifyService";

export class UserVerifyService implements IUserVerifyService {
    constructor(
        public emailService:IEmailService,
        public userRepository:IUserRepository,
        public tokenManager:ITokenManager,
    ){}

    async sendVerificationEmail(email: string, userId: string): Promise<void> {
        try {
            
            const verificationToken = this.tokenManager.generateAccessToken(userId,'user')
            const verificationUrl = `${process.env.APP_URL}/users/verify?token=${verificationToken}`
            
            const res = await this.emailService.sendEmail(email, "Verify your email", `Please click the link below to verify your email: ${verificationUrl}`)  

        } catch (error) {
            console.log(error,'send service')
            throw new CustomError(ERROR_MESSAGES.INTERNAL_SERVER_ERROR,STATUS_CODES.INTERNAL_SERVER_ERROR)
        }
    }

    async verifyUser(token: string): Promise<void> {

        try {
            const {id} = await this.tokenManager.verifyToken(token,'access')

            const user = await this.userRepository.findById(id)
            if(!user){
                throw new CustomError('User not found', STATUS_CODES.NOT_FOUND)
            }

            user.isVerified = true
            user.save()

        } catch (error) {
            console.log(error,'vefify service')
             throw new CustomError(ERROR_MESSAGES.INTERNAL_SERVER_ERROR,STATUS_CODES.INTERNAL_SERVER_ERROR)
        }


    }
}