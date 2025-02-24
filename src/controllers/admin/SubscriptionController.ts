import { Request, Response } from "express";
import { STATUS_CODES } from "../../constants/statusCodes";
import { errorResponse, successResponse } from "../../helper/responseHanlder";
import { ISubscriptionManager } from "../../services/admin/interfaces/ISubscriptionManager";
import { CustomError } from "../../errors/CustomError";
import { ERROR_MESSAGES } from "../../constants/errorMessages";
import { ISubscriptionController } from "./interface/ISubscriptionController";

export class SubscriptionController implements ISubscriptionController{
    constructor(
        private subscriptionManager: ISubscriptionManager
    ){}

    async getAllSubscriptions(req: Request, res: Response){
        try {
            const allSubs = await this.subscriptionManager.getAllSubscriptions()
            successResponse(res,"all the subscription", STATUS_CODES.OK,allSubs)
        } catch (error) {
            if(error instanceof CustomError){
                errorResponse(res, error.message, error.statusCode)
            } 
        }
    }

    async createSubscription(req:Request,res:Response){
        try {

            const newSubscription = await this.subscriptionManager.createSubscription(req.body)
            successResponse(res,"New subscription created", STATUS_CODES.CREATED, newSubscription)
            
        } catch (error) {
            if(error instanceof CustomError){
                errorResponse(res, error.message, error.statusCode)
            }
        }
    }

    async updateSubscription(req:Request,res:Response){
        try {

            const {id} = req.params;
            
            const updatedSubscription = await this.subscriptionManager.updateSubscription(id, req.body)
            if(!updatedSubscription){
                throw new CustomError('Subscription not found', STATUS_CODES.NOT_FOUND)
            }

            successResponse(res,"Subscription updated", STATUS_CODES.OK, updatedSubscription)

        } catch (error) {
            if(error instanceof CustomError){
                errorResponse(res, error.message, error.statusCode)
            }
        }
    }

    async deleteSubscription(req:Request,res:Response){
        try {

            const {id} = req.params;

            const isDeleted = await this.subscriptionManager.deleteSubscription(id)
            
            if(isDeleted){
                successResponse(res,"Subscription deleted", STATUS_CODES.OK,"")
            } else {
                errorResponse(res, ERROR_MESSAGES.NOT_FOUND, STATUS_CODES.NOT_FOUND)
            }

        } catch (error) {
            if(error instanceof CustomError){
                errorResponse(res, error.message, error.statusCode)
            }
        }
    }
}
