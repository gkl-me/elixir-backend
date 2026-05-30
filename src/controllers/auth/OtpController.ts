import { inject, injectable } from "tsyringe";
import { IOtpController } from "./interface/IOtpController";
import { Request, Response, NextFunction } from "express";
import { Token } from "../../di/token";
import { IOtpService } from "../../services/auth/interfaces/IOtpService";
import { successResponse } from "../../helper/responseHanlder";
import { AUTH_MESSAGES } from "../../constants/messages";
import { STATUS_CODES } from "../../constants/statusCodes";
import { IPasswordService } from "../../services/auth/interfaces/IPasswordService";

@injectable()
export class OtpController implements IOtpController {
  constructor(
    @inject(Token.OtpService) private readonly _otpService: IOtpService,
    @inject(Token.PasswordService)
    private readonly _passwordService: IPasswordService,
  ) {}

  async handleVerifyOtp(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { otp, email } = req.body;

      const { resetPasswordToken } = await this._otpService.verfiyOtp({
        email: email.trim(),
        otp,
      });

      return successResponse(
        res,
        AUTH_MESSAGES.OTP_VERIFIED,
        STATUS_CODES.ACCEPTED,
        {
          resetPasswordToken,
        },
      );
    } catch (error) {
      next(error);
    }
  }

  async handleResendOtp(
    req: Request,
    res: Response,
    next: NextFunction,
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
}
