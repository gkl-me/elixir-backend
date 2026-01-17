import { inject, injectable } from "tsyringe";
import { IOtpService } from "./interfaces/IOtpService";
import { Token } from "../../di/token";
import { IEmailService } from "../../providers/interfaces/IEmailService";
import { ISendOtpDto, IVerifyOtpDto, IVerifyOtpResponseDto } from "../../interfaces/dtos/AuthDTO";
import { IUserRepository } from "../../repositories/user/interfaces/IUserRepository";
import { CustomError } from "../../errors/CustomError";
import { AUTH_MESSAGES } from "../../constants/messages";
import { STATUS_CODES } from "../../constants/statusCodes";
import { ITokenManager } from "../../providers/interfaces/ITokenManager";
import { ICacheRepository } from "../../repositories/cache/ICacheRepository";
import { REDIS_STORE } from "../../constants/redis/redisStore";
import { RESET_PASSWORD_OTP_TEMPLATE } from "../../templates/otpEmailTemplate";



@injectable()
export class OtpService implements IOtpService{
    constructor(
        @inject(Token.EmailService) private readonly _emailService:IEmailService,
        @inject(Token.UserRepository) private readonly _userRepository:IUserRepository,
        @inject(Token.TokenManager) private readonly _tokenManager:ITokenManager,
        @inject(Token.CacheRepository) private readonly _cacheRepository:ICacheRepository<string>

    ){}

    async sendOtp(data: ISendOtpDto): Promise<void> {
        try {
            
            const {email} = data

            const user = await this._userRepository.findByEmail(email)

            if(!user) throw new CustomError(AUTH_MESSAGES.NOT_FOUND,STATUS_CODES.NOT_FOUND)
            
            const otp = this._tokenManager.generateRandomOtp()
            const hashOtp = this._tokenManager.hashToken(otp)

            //save in redis to validate
            await this._cacheRepository.set(REDIS_STORE.OTP+email,hashOtp,5*60)

            await this._emailService.sendEmail(email,"Reset Password OTP",RESET_PASSWORD_OTP_TEMPLATE(otp))

        } catch (error) {
            throw error
        }
    }

    async verfiyOtp(data: IVerifyOtpDto): Promise<IVerifyOtpResponseDto> {
        try {

            const {otp,email} = data

            const storedHashOtp = await this._cacheRepository.get(REDIS_STORE.OTP+email)
            if(!storedHashOtp)  throw new CustomError(AUTH_MESSAGES.OTP_ERROR,STATUS_CODES.BAD_REQUEST)

            const hashOtp = this._tokenManager.hashToken(otp)

            if(storedHashOtp !== hashOtp){
                throw new CustomError(AUTH_MESSAGES.INVALID_OTP, STATUS_CODES.BAD_REQUEST);
            }
            
            await this._cacheRepository.delete(REDIS_STORE.OTP+email)

            //resetToken generation
            const resetPasswordToken = this._tokenManager.generateRandomToken()
            const hashResetPasswordToken = this._tokenManager.hashToken(resetPasswordToken)

            //save reset token in redis
            await this._cacheRepository.set(REDIS_STORE.RESET_TOKEN+email,hashResetPasswordToken,15*60)

            return {
                resetPasswordToken
            }

        } catch (error) {
            throw error
        }
    }
}