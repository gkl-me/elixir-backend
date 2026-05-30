import { inject, injectable } from "tsyringe";
import { IPasswordController } from "./interface/IPasswordController";
import { Request, Response, NextFunction } from "express";
import { Token } from "../../di/token";
import { IPasswordService } from "../../services/auth/interfaces/IPasswordService";
import { successResponse } from "../../helper/responseHanlder";
import { AUTH_MESSAGES, USER_MESSAGES } from "../../constants/messages";
import { STATUS_CODES } from "../../constants/statusCodes";

@injectable()
export class PasswordController implements IPasswordController {
  constructor(
    @inject(Token.PasswordService)
    private readonly _passwordService: IPasswordService
  ) {}

  async handleForgotPassword(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { email } = req.body;

      //call forgot password server
      const { userEmail, expiresAt } =
        await this._passwordService.forgotPassword({ email: email.trim() });

      return successResponse(res, AUTH_MESSAGES.OTP_SENT, STATUS_CODES.OK, {
        email: userEmail,
        expiresAt,
      });
    } catch (error) {
      next(error);
    }
  }

  async handleResetPasswrod(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { email, newPassword, resetPasswordToken } = req.body;

      //call validator for password

      await this._passwordService.resetPassword({
        email: email.trim(),
        newPassword,
        resetPasswordToken,
      });

      return successResponse(
        res,
        USER_MESSAGES.UPDATE_PASSWORD_SUCCESS,
        STATUS_CODES.ACCEPTED,
        {}
      );
    } catch (error) {
      next(error);
    }
  }
}
