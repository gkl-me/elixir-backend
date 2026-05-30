import { inject, injectable } from "tsyringe";
import { IPasswordService } from "./interfaces/IPasswordService";
import {
  IForgotPasswordDto,
  IForgotPasswordResponseDto,
  IResetPasswordDto,
} from "../../interfaces/dtos/AuthDTO";
import { Token } from "../../di/token";
import { CustomError } from "../../errors/CustomError";
import { AUTH_MESSAGES } from "../../constants/messages";
import { STATUS_CODES } from "../../constants/statusCodes";
import { ICacheRepository } from "../../repositories/cache/ICacheRepository";
import { REDIS_STORE } from "../../constants/redis/redisStore";
import { ITokenManager } from "../../providers/interfaces/ITokenManager";
import { IUserService } from "../user/interface/IUserService";
import { IUserRepository } from "../../repositories/user/interfaces/IUserRepository";
import { ENV } from "../../constants/env";
import { sendOtpEmailJob } from "../../queues/email/email.producer";
import logger from "../../middlewares/logger";

@injectable()
export class PasswordService implements IPasswordService {
  constructor(
    @inject(Token.CacheRepository)
    private readonly _cacheRepository: ICacheRepository<string>,
    @inject(Token.TokenManager) private readonly _tokenManager: ITokenManager,
    @inject(Token.UserService) private readonly _userService: IUserService,
    @inject(Token.UserRepository)
    private readonly _userRepository: IUserRepository
  ) {}

  async forgotPassword(
    data: IForgotPasswordDto
  ): Promise<IForgotPasswordResponseDto> {
    try {
      const { email } = data;

      const user = await this._userRepository.findByEmail(email);

      if (!user)
        throw new CustomError(AUTH_MESSAGES.NOT_FOUND, STATUS_CODES.NOT_FOUND);

      const now = new Date();
      const expiresAt = new Date(now.getTime() + ENV.OTP_TTL * 1000);

      //call queue for proccessing
      await sendOtpEmailJob(email);

      return {
        userEmail: email,
        expiresAt,
      };
    } catch (error) {
      logger.error(error);
      throw error;
    }
  }

  async resetPassword(data: IResetPasswordDto): Promise<void> {
    try {
      const { email, newPassword, resetPasswordToken } = data;

      const key = REDIS_STORE.RESET_TOKEN + email;

      if (!resetPasswordToken)
        throw new CustomError(
          AUTH_MESSAGES.RESET_TOKEN_EXPIRED,
          STATUS_CODES.BAD_REQUEST
        );

      const storedHash = await this._cacheRepository.get(key);

      if (!storedHash)
        throw new CustomError(
          AUTH_MESSAGES.RESET_TOKEN_EXPIRED,
          STATUS_CODES.BAD_REQUEST
        );

      const hashToken = this._tokenManager.hashToken(resetPasswordToken);

      if (storedHash !== hashToken) {
        throw new CustomError(
          AUTH_MESSAGES.INVALID_RESET_TOKEN,
          STATUS_CODES.BAD_REQUEST
        );
      }

      //on success  update the db
      await this._userService.updatePassword({ email, newPassword });
      await this._cacheRepository.delete(REDIS_STORE.RESET_TOKEN + email);
    } catch (error) {
      throw error;
    }
  }
}
