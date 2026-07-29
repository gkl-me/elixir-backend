import { inject, injectable } from "tsyringe";
import { ISubscriptionController } from "./interface/ISubscriptionController"
import { Token } from "../../di/token";
import { ISubscriptionService } from "../../services/subscription/interface/ISubscriptionService";
import { Request, Response, NextFunction } from "express";
import { extractStringQueryParams } from "../../helper/queryParamUtils";
import { CONSTANT_MESSAGES } from "../../constants/messages";
import { STATUS_CODES } from "../../constants/statusCodes";
import { successResponse } from "../../helper/responseHanlder";
import { extractStringParams } from "../../helper/stringParamUtils";


@injectable()
export class SubscriptionController implements ISubscriptionController {
    constructor(
        @inject(Token.SubscriptionService) private _subscriptionService: ISubscriptionService
    ) { }

    async handleListAllSubcription(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {


            const params = extractStringQueryParams(req.query, ["search", "status", "page", "limit", "plan"])

            const processed = {
                search: params?.search || "",
                status: params?.status || "",
                page: parseInt(params?.page || "1"),
                limit: parseInt(params?.limit || "10"),
                plan: params?.plan || ""
            }

            const data = await this._subscriptionService.listAllSubscription(processed)

            successResponse(res, CONSTANT_MESSAGES.SUCCESS, STATUS_CODES.OK, data)

        } catch (error) {
            next(error)
        }
    }


    async handleCancelSubscription(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {

            const { subscriptionId } = extractStringParams(req.params, ["subscriptionId"])
            const { cancelMode } = req.body

            await this._subscriptionService.cancelSubscription({
                subscriptionId,
                cancelMode
            })

            successResponse(res, CONSTANT_MESSAGES.SUCCESS, STATUS_CODES.OK, {})

        } catch (error) {
            next(error)
        }
    }

    async handleReactivateSubscription(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {

            const { subscriptionId } = extractStringParams(req.params, ["subscriptionId"])

            await this._subscriptionService.reactivateSubscription({
                subscriptionId
            })

            successResponse(res, CONSTANT_MESSAGES.SUCCESS, STATUS_CODES.OK, {})

        } catch (error) {
            next(error)
        }
    }

}
