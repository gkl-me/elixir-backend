import { inject, injectable } from "tsyringe";
import { IPasswordController } from "./interface/IPasswordController";
import { Request, Response, NextFunction } from "express";
import { Token } from "../../di/token";
import { IPasswordService } from "../../services/auth/interfaces/IPasswordService";
import { successResponse } from "../../helper/responseHanlder";
import { AUTH_MESSAGES, USER_MESSAGES } from "../../constants/messages";
import { STATUS_CODES } from "../../constants/statusCodes";
import { sendOtpEmailJob } from "../../queues/email/email.producer";



@injectable()
export class PasswordController implements IPasswordController{
    constructor(
        @inject(Token.PasswordService) private readonly _passwordService:IPasswordService,
    ){}

    async handleForgotPassword(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            
            const {email} = req.body

            // call job from queue
            await sendOtpEmailJob(email)


            return successResponse(res,AUTH_MESSAGES.OTP_SENT,STATUS_CODES.OK,{})


        } catch (error) {
            next(error)
        }
    }

    async handleResetPasswrod(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            
            const {email,newPassword} = req.body
            const resetPasswordToken = req.params.token

            await this._passwordService.resetPassword({
                email,
                newPassword,
                resetPasswordToken
            })


            return successResponse(res,USER_MESSAGES.UPDATE_PASSWORD_SUCCESS,STATUS_CODES.ACCEPTED,{})

        } catch (error) {
            next(error)
        }
    }
}