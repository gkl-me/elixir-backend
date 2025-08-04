import { inject, injectable } from "tsyringe";
import { ISubscriptionController } from "./interface/ISubscriptionController";
import { Token } from "../../di/token";
import { ISubscriptionService } from "../../services/subscription/interface/ISubscriptionService";
import { Request, Response, NextFunction } from "express";
import { successResponse } from "../../helper/responseHanlder";
import { STATUS_CODES } from "../../constants/statusCodes";


@injectable()
export class SubscriptionController implements ISubscriptionController{
    constructor(
        @inject(Token.SubscriptionService) private _subscriptionService:ISubscriptionService
    ){}

    async create(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {

            const {planId,userId} = req.body
            
            const subscription = await this._subscriptionService.createCheckout({planId,userId})

            successResponse(res,"Subscription created",STATUS_CODES.CREATED,subscription)

        } catch (error) {
            next(error)
        }
    }
}