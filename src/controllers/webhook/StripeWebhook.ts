import { inject, injectable } from "tsyringe";
import { IStripeWebhookController } from "./IStripeWebhookController";
import { Token } from "../../di/token";
import { IStripeWebhookService } from "../../services/webhook/interface/IStripeWebhookService";
import { Request, Response, NextFunction } from "express";
import { IStripeService } from "../../providers/interfaces/IStripeService";
import { successResponse } from "../../helper/responseHanlder";
import { STATUS_CODES } from "../../constants/statusCodes";



@injectable()
export class StripeWebhookController implements IStripeWebhookController{
    constructor(
        @inject(Token.StripeWebhookService) private _stripeWebhook:IStripeWebhookService,
        @inject(Token.StripeService) private _stripeService:IStripeService
    ){}

    async handle(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            
            const sig = String(req.headers['stripe-signature'])
            const event = await this._stripeService.constructEvent(req.body,sig)

            this._stripeWebhook.handleEvent(event)
            successResponse(res,"Stripe Webhook recieved",STATUS_CODES.OK,{})
        } catch (error) {
            console.log(error)
            next(error)
        }
    }
}