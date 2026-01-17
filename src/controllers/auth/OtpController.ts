import { inject, injectable } from "tsyringe";
import { IOtpController } from "./interface/IOtpController";
import { Request, Response, NextFunction } from "express";
import { Token } from "../../di/token";
import { IOtpService } from "../../services/auth/interfaces/IOtpService";
import { successResponse } from "../../helper/responseHanlder";
import { AUTH_MESSAGES, USER_MESSAGES } from "../../constants/messages";
import { STATUS_CODES } from "../../constants/statusCodes";
import { sendOtpEmailJob } from "../../queues/email/email.producer";




@injectable()
export class OtpController  implements IOtpController{
    constructor(
        @inject(Token.OtpService) private readonly _otpService:IOtpService
    ){}

    async handleVerifyOtp(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {

            const {otp,email} = req.body

            const {resetPasswordToken} = await this._otpService.verfiyOtp({email,otp})

            return successResponse(res,AUTH_MESSAGES.OTP_VERIFIED,STATUS_CODES.ACCEPTED,{
                resetPasswordToken
            })

        } catch (error) {
            next(error)
        }
    }

    async handleResendOtp(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            
            const {email} = req.body


            //call job from queue
            await sendOtpEmailJob(email)

            return successResponse(res,AUTH_MESSAGES.OTP_SENT,STATUS_CODES.OK,{})

        } catch (error) {
            next(error)
        }
    }
}