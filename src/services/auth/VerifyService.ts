import { inject, injectable } from "tsyringe";
import { IVerifyService } from "./interfaces/IVerifyService";
import {
  ISendVerificationEmailDto,
  IVerifyEmailDto,
} from "../../interfaces/dtos/AuthDTO";
import { Token } from "../../di/token";
import { IEmailService } from "../../providers/interfaces/IEmailService";
import { IUserRepository } from "../../repositories/user/interfaces/IUserRepository";
import { CustomError } from "../../errors/CustomError";
import { AUTH_MESSAGES } from "../../constants/messages";
import { STATUS_CODES } from "../../constants/statusCodes";
import { ITokenManager } from "../../providers/interfaces/ITokenManager";
import { ICacheRepository } from "../../repositories/cache/ICacheRepository";
import { REDIS_STORE } from "../../constants/redis/redisStore";
import { ENV } from "../../constants/env";
import { VERIFY_EMAIL_TEMPLATE } from "../../templates/verifyEmailTemplate";
import { IAuthSession } from "../../interfaces/types/session.types";

@injectable()
export class VerifyService implements IVerifyService {
  constructor(
    @inject(Token.EmailService) private readonly _emailService: IEmailService,
    @inject(Token.UserRepository)
    private readonly _userRepository: IUserRepository,
    @inject(Token.TokenManager) private readonly _tokenManager: ITokenManager,
    @inject(Token.CacheRepository)
    private readonly _cacheRepository: ICacheRepository<string | IAuthSession>
  ) {}

  async sendVerificationEmail(data: ISendVerificationEmailDto): Promise<void> {
    try {
      const { email } = data;

      const userId = this._userRepository.findByEmail(email);
      if (!userId)
        throw new CustomError(AUTH_MESSAGES.NOT_FOUND, STATUS_CODES.NOT_FOUND);

      //create random token
      const verificationToken = this._tokenManager.generateRandomToken();
      const hashToken = this._tokenManager.hashToken(verificationToken);

      //saver hash token in redis
      await this._cacheRepository.set(
        REDIS_STORE.EMAIL_VERIFY + hashToken,
        email,
        15 * 60
      );

      //verification url
      const verificationUrl = `${ENV.CLIENT_URL}/verify/token/${verificationToken}?email=${encodeURIComponent(email)}`;

      //call email service to sent mail
      await this._emailService.sendEmail(
        email,
        "Verify your email",
        VERIFY_EMAIL_TEMPLATE(verificationUrl)
      );
    } catch (error) {
      throw error;
    }
  }

  async verifyEmail(data: IVerifyEmailDto): Promise<void> {
    try {
      const { token } = data;
      if (!token)
        throw new CustomError(
          AUTH_MESSAGES.TOKEN_ERROR,
          STATUS_CODES.BAD_REQUEST
        );

      //hash token
      const hashToken = this._tokenManager.hashToken(token);

      //get email from cache
      const email = await this._cacheRepository.get(
        REDIS_STORE.EMAIL_VERIFY + hashToken
      );

      if (!email || typeof email !== "string") {
        throw new CustomError(
          AUTH_MESSAGES.INVALID_TOKEN,
          STATUS_CODES.BAD_REQUEST
        );
      }

      const user = await this._userRepository.findByEmail(email);
      if (!user) {
        throw new CustomError(AUTH_MESSAGES.NOT_FOUND, STATUS_CODES.NOT_FOUND);
      }

      await this._cacheRepository.delete(REDIS_STORE.EMAIL_VERIFY + hashToken);

      user.isVerified = true;
      await user.save();
    } catch (error) {
      throw error;
    }
  }
}
