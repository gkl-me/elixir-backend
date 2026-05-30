import { injectable } from "tsyringe";
import { ITokenManager } from "./interfaces/ITokenManager";
import jwt from "jsonwebtoken";
import { CustomError } from "../errors/CustomError";
import { STATUS_CODES } from "../constants/statusCodes";
import logger from "../middlewares/logger";
import { CONSTANT_MESSAGES } from "../constants/messages";
import crypto from "crypto";
import { ENV } from "../constants/env";
import {
  IAccessTokenPayload,
  IRefreshTokenPayload,
} from "../interfaces/types/jwt.types";

@injectable()
export class TokenManager implements ITokenManager {
  private accessSecret;
  private refreshSecret;

  constructor() {
    const access_secret = process.env.ACCESS_TOKEN_SECRET;
    const refresh_secret = process.env.REFRESH_TOKEN_SECRET;
    if (!access_secret) {
      logger.error("Access token secret env is empty");
      throw new CustomError(
        CONSTANT_MESSAGES.INTERNAL_SERVER_ERROR,
        STATUS_CODES.INTERNAL_SERVER_ERROR
      );
    }
    if (!refresh_secret) {
      logger.error("Refresh token secret env is empty");
      throw new CustomError(
        CONSTANT_MESSAGES.INTERNAL_SERVER_ERROR,
        STATUS_CODES.INTERNAL_SERVER_ERROR
      );
    }

    this.accessSecret = access_secret;
    this.refreshSecret = refresh_secret;
  }

  generateAccessToken(userId: string, role: string, sessionId: string): string {
    const accessRoken = jwt.sign(
      {
        userId,
        role,
        sessionId,
      },
      process.env.ACCESS_TOKEN_SECRET!,
      { expiresIn: ENV.ACCESS_TOKEN_TTL * 1000 }
    );
    return accessRoken;
  }

  generateRefreshToken(
    userId: string,
    role: string,
    sessionId: string,
    tokenVersion: number
  ): string {
    const refreshToken = jwt.sign(
      {
        userId,
        role,
        sessionId,
        tokenVersion,
      },
      process.env.REFRESH_TOKEN_SECRET!,
      { expiresIn: ENV.REFRESH_TOKEN_TTL * 1000 }
    );
    return refreshToken;
  }

  verifyToken(
    token: string,
    type: "access" | "refresh"
  ): IAccessTokenPayload | IRefreshTokenPayload {
    try {
      const secret = type === "access" ? this.accessSecret : this.refreshSecret;
      const decoded = jwt.verify(token, secret);
      return decoded as IAccessTokenPayload | IRefreshTokenPayload;
    } catch (error) {
      logger.error(error);
      throw new CustomError(
        CONSTANT_MESSAGES.UNAUTHORIZED,
        STATUS_CODES.UNAUTHORIZED
      );
    }
  }

  decodeToken(token: string): IAccessTokenPayload | IRefreshTokenPayload {
    try {
      const decoded = jwt.decode(token);
      return decoded as IAccessTokenPayload | IRefreshTokenPayload;
    } catch (error) {
      logger.error(error);
      throw new CustomError(
        CONSTANT_MESSAGES.INTERNAL_SERVER_ERROR,
        STATUS_CODES.INTERNAL_SERVER_ERROR
      );
    }
  }

  generateRandomToken(): string {
    return crypto.randomBytes(16).toString("hex");
  }

  hashToken(token: string): string {
    return crypto.createHash("sha256").update(token).digest("hex");
  }

  generateRandomOtp(): string {
    return crypto.randomInt(1000, 9999).toString();
  }

  generateSessionId(): string {
    return crypto.randomUUID();
  }
}
