import { inject, injectable } from "tsyringe";
import { IOtpService } from "./interfaces/IOtpService";
import { Token } from "../../di/token";
import { IEmailService } from "../../providers/interfaces/IEmailService";
import { ISendOtpDto, IVerifyOtpDto, IVerifyOtpResponseDto } from "../../interfaces/dtos/AuthDTO";
import { CustomError } from "../../errors/CustomError";
import { AUTH_MESSAGES } from "../../constants/messages";
import { STATUS_CODES } from "../../constants/statusCodes";
import { ITokenManager } from "../../providers/interfaces/ITokenManager";
import { ICacheRepository } from "../../repositories/cache/ICacheRepository";
import { REDIS_STORE } from "../../constants/redis/redisStore";
import { RESET_PASSWORD_OTP_TEMPLATE } from "../../templates/otpEmailTemplate";
import { IOtpType } from "../../interfaces/types/otp.types";
import { ENV } from "../../constants/env";



@injectable()
export class OtpService implements IOtpService{
    constructor(
        @inject(Token.EmailService) private readonly _emailService:IEmailService,
        @inject(Token.TokenManager) private readonly _tokenManager:ITokenManager,
        @inject(Token.CacheRepository) private readonly _cacheRepository:ICacheRepository<string|IOtpType>

    ){}

    async sendOtp(data: ISendOtpDto): Promise<void> {
        try {
            
            const {email} = data
            
            const key = REDIS_STORE.OTP+email
            const existing = await this._cacheRepository.get(key) as IOtpType

            const now = Date.now()

            //check if the otp cooldown or retires exceeded
            if(existing && typeof existing!=='string'){
                
                //cooldown 
                if(now < existing.expiresAt){
                    throw new CustomError(AUTH_MESSAGES.OTP_COOLDOWN_ERROR,STATUS_CODES.TOO_MANY_REQUEST)
                }

                if(existing.retries >= 5){
                    throw new CustomError(AUTH_MESSAGES.OTP_ATTEMPT_ERROR,STATUS_CODES.TOO_MANY_REQUEST)
                }

            }

            const otp = this._tokenManager.generateRandomOtp()
            const hashOtp = this._tokenManager.hashToken(otp)

            const payload:IOtpType  = {
                hash:hashOtp,
                retries:existing?.retries ? existing?.retries+1:1,
                attempts:existing?.attempts ?? 0,
                expiresAt:now + ENV.OTP_TTL*1000
            }

            //save in redis to validate for an hour
            await this._cacheRepository.set(key,payload,60*60)

            await this._emailService.sendEmail(email,"Reset Password OTP",RESET_PASSWORD_OTP_TEMPLATE(otp))

        } catch (error) {
            throw error
        }
    }

    async verfiyOtp(data: IVerifyOtpDto): Promise<IVerifyOtpResponseDto> {
        try {

            const {otp,email} = data

            const key = REDIS_STORE.OTP+email
            const payload = await this._cacheRepository.get(key) as IOtpType

            if(!payload)  throw new CustomError(AUTH_MESSAGES.OTP_ERROR,STATUS_CODES.BAD_REQUEST)

            const now = Date.now()

            //check if otp expired or not 
            if(now > payload.expiresAt){
                throw new CustomError(AUTH_MESSAGES.OTP_ERROR,STATUS_CODES.BAD_REQUEST)
            }

            //hash otp 
            const hashOtp = this._tokenManager.hashToken(otp)

            if(payload.hash !== hashOtp){


                //check attempt and delete the otp
                if(payload.attempts > 3){
                    this._cacheRepository.delete(key)
                    throw new CustomError(AUTH_MESSAGES.OTP_ATTEMPT_ERROR,STATUS_CODES.BAD_REQUEST)
                }

                payload.attempts+=1
                await this._cacheRepository.set(key,payload,60*60)

                throw new CustomError(AUTH_MESSAGES.INVALID_OTP, STATUS_CODES.BAD_REQUEST);

            }
            
            //on success delete the otp
            await this._cacheRepository.delete(key)

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