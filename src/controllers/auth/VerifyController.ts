import { inject, injectable } from "tsyringe";
import { IVerifyController } from "./interface/IVerifyController";
import { Token } from "../../di/token";
import { IVerifyService } from "../../services/auth/interfaces/IVerifyService";
import { Request, Response, NextFunction } from "express";
import { successResponse } from "../../helper/responseHanlder";
import { USER_MESSAGES } from "../../constants/messages";
import { STATUS_CODES } from "../../constants/statusCodes";
import { sendVerificationEmailJob } from "../../queues/email/email.producer";
import { ITokenManager } from "../../providers/interfaces/ITokenManager";
import { setCookie } from "../../helper/cookiesHelper";




@injectable()
export class VerifyController implements IVerifyController{
    constructor(
        @inject(Token.VerifyService) private readonly _verifyService:IVerifyService,
        @inject(Token.TokenManager) private readonly _tokenManager:ITokenManager
    ){}

    async handleVerifyEmail(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {

            const verifyEmailToken = req.params.token
            const userAgent = req.headers["user-agent"]
            const ip = req.ip

            const {accessToken,refreshToken,...user} = await this._verifyService.verifyEmail({token:verifyEmailToken},{ip,userAgent})

            setCookie(res,'refreshToken',refreshToken)

            return successResponse(res,USER_MESSAGES.VERIFY_SUCCESS,STATUS_CODES.ACCEPTED,{
                accessToken,
                refreshToken,
                user
            })

        } catch (error) {
            next(error)
        }
    }

    async handleResendVerifyEmail(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            
            const {email} = req.body

            //call queue, the send verificaiton email job queue
            await sendVerificationEmailJob(email)

            return successResponse(res,USER_MESSAGES.RESEND_VERIFY,STATUS_CODES.ACCEPTED,{})

        } catch (error) {
            next(error)
        }
    }
}