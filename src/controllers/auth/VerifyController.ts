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




@injectable()
export class VerifyController implements IVerifyController{
    constructor(
        @inject(Token.VerifyService) private readonly _verifyService:IVerifyService,
        @inject(Token.TokenManager) private readonly _tokenManager:ITokenManager
    ){}

    async handleVerifyEmail(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {

            console.log(req.cookies)
            
            const verifyEmailToken = req.params.token

            const user = await this._verifyService.verifyEmail({token:verifyEmailToken})

            const accessToken = this._tokenManager.generateAccessToken(user.id,user.role)
            const refreshToken = this._tokenManager.generateRefreshToken(user.id,user.role)

            return successResponse(res,USER_MESSAGES.VERIFY_SUCCESS,STATUS_CODES.ACCEPTED,{
                accessToken,
                refreshToken
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