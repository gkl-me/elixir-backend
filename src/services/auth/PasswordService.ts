import { inject, injectable } from "tsyringe";
import { IPasswordService } from "./interfaces/IPasswordService";
import { IForgotPasswordDto, IResetPasswordDto } from "../../interfaces/dtos/AuthDTO";
import { Token } from "../../di/token";
import { CustomError } from "../../errors/CustomError";
import { AUTH_MESSAGES } from "../../constants/messages";
import { STATUS_CODES } from "../../constants/statusCodes";
import { IOtpService } from "./interfaces/IOtpService";
import { ICacheRepository } from "../../repositories/cache/ICacheRepository";
import { REDIS_STORE } from "../../constants/redis/redisStore";
import { ITokenManager } from "../../providers/interfaces/ITokenManager";
import { IUserService } from "../user/interface/IUserService";



@injectable()
export class PasswordService implements IPasswordService{
    constructor(
        @inject(Token.OtpService) private readonly _optService:IOtpService,
        @inject(Token.CacheRepository) private readonly _cacheRepository:ICacheRepository<string>,
        @inject(Token.TokenManager) private readonly _tokenManager:ITokenManager,
        @inject(Token.UserService) private readonly _userService:IUserService
    ){}

    async forgotPassword(data: IForgotPasswordDto): Promise<void> {
        try {

             const {email} = data

             await this._optService.sendOtp({email})
            
        } catch (error) {
            throw error
        }
    }

    async resetPassword(data: IResetPasswordDto): Promise<void> {
        try {
            
            const {email,newPassword,resetPasswordToken} = data

            const storedHash = await this._cacheRepository.get(REDIS_STORE.RESET_TOKEN+email)
            if(!storedHash) throw new CustomError(AUTH_MESSAGES.RESET_TOKEN_EXPIRED,STATUS_CODES.BAD_REQUEST)

            const hashToken = this._tokenManager.hashToken(resetPasswordToken)

            if(storedHash !== hashToken){
                throw new CustomError(AUTH_MESSAGES.INVALID_RESET_TOKEN,STATUS_CODES.BAD_REQUEST)
            }

            await this._userService.updatePassword({email,newPassword})

            await this._cacheRepository.delete(REDIS_STORE.RESET_TOKEN+email)

        } catch (error) {
            throw error
        }
    }
}