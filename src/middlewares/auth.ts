import { NextFunction, Request, Response } from "express";
import { container } from "tsyringe";
import { ITokenManager } from "../providers/interfaces/ITokenManager";
import { Token } from "../di/token";
import { CustomError } from "../errors/CustomError";
import { AUTH_MESSAGES, CONSTANT_MESSAGES } from "../constants/messages";
import { STATUS_CODES } from "../constants/statusCodes";
import { IUserRepository } from "../repositories/user/interfaces/IUserRepository";
import { ICacheRepository } from "../repositories/cache/interface/ICacheRepository";
import { REDIS_STORE } from "../constants/redis/redisStore";
import { AUTH_ERROR_CODE } from "../constants/errorCode";

export const auth = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const tokenManager = container.resolve<ITokenManager>(Token.TokenManager);
    const userRepository = container.resolve<IUserRepository>(
      Token.UserRepository
    );
    const cacheRepository = container.resolve<ICacheRepository<string>>(
      Token.CacheRepository
    );

    const authHeader = req.headers.authorization;

    if (!authHeader?.startsWith("Bearer "))
      throw new CustomError(
        CONSTANT_MESSAGES.UNAUTHORIZED,
        STATUS_CODES.UNAUTHORIZED
      );

    const accessToken = authHeader.split(" ")[1];

    if (!accessToken) {
      throw new CustomError(
        CONSTANT_MESSAGES.UNAUTHORIZED,
        STATUS_CODES.UNAUTHORIZED
      );
    }

    const payload = tokenManager.verifyToken(accessToken, "access");

    const sessionKey = REDIS_STORE.SESSION + payload.sessionId;

    const session = await cacheRepository.get(sessionKey);

    if (!session)
      throw new CustomError(
        AUTH_MESSAGES.SESSION_EXPIRED,
        STATUS_CODES.UNAUTHORIZED
      );

    //check if the user is blocked or not
    const userFound = await userRepository.findById(payload.userId);

    if (userFound?.isBlocked) {
      throw new CustomError(
        AUTH_MESSAGES.BLOCKED,
        STATUS_CODES.FORBIDDEN,
        AUTH_ERROR_CODE.BLOCKED
      );
    }

    req.user = { userId: payload.userId, role: payload.role };
    return next();
  } catch (error) {
    if (error instanceof CustomError) {
      return next(error);
    }
    return next(
      new CustomError(CONSTANT_MESSAGES.UNAUTHORIZED, STATUS_CODES.UNAUTHORIZED)
    );
  }
};
