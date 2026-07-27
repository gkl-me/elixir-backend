// import { inject, injectable } from "tsyringe";
// import { ISubscriptionController } from "./interface/ISubscriptionController";
// import { Token } from "../../di/token";
// import { ISubscriptionService } from "../../services/subscription/interface/ISubscriptionService";
// import { Request, Response, NextFunction } from "express";
// import { successResponse } from "../../helper/responseHanlder";
// import { STATUS_CODES } from "../../constants/statusCodes";
// import { CustomError } from "../../errors/CustomError";
// import { CONSTANT_MESSAGES } from "../../constants/messages";

// @injectable()
// export class SubscriptionController implements ISubscriptionController{
//     constructor(
//         @inject(Token.SubscriptionService) private _subscriptionService:ISubscriptionService
//     ){}

//     async create(req: Request, res: Response, next: NextFunction): Promise<void> {
//         try {

//             const data = req.body

//             const subscription = await this._subscriptionService.createSubscription({
//                 planId,
//                 userId
//             })

//             successResponse(res,"Subscription created",STATUS_CODES.CREATED,subscription)

//         } catch (error) {
//             next(error)
//         }
//     }

//     async find(req: Request, res: Response, next: NextFunction): Promise<void> {
//         try {

//             const {id} = req.params

//             if(!id){
//                 throw new CustomError(CONSTANT_MESSAGES.BAD_REQUEST,STATUS_CODES.BAD_REQUEST)
//             }

//             const subscription = await this._subscriptionService.findUserSubscription({userId:id})

//             successResponse(res,"User subscription fetched",STATUS_CODES.OK,subscription)

//         } catch (error) {
//             next(error)
//         }
//     }
// }
