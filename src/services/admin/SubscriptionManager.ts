import { ZodError } from "zod";
import { STATUS_CODES } from "../../constants/statusCodes";
import { CustomError } from "../../errors/CustomError";
import { ISubscriptionPlan } from "../../models/SubscriptionPlan";
import { ISubscriptionRepository } from "../../repositories/admin/interfaces/ISubscriptionRepository";
import { ISubscriptionManager } from "./interfaces/ISubscriptionManager";
import {createSubscriptionSchema, updateSubscriptionSchema} from '../../validator/admin/SubscriptionSchema'
 
export class SubscriptionManager implements ISubscriptionManager{
    constructor(
        private subscriptionRepository:ISubscriptionRepository
    ){}

    async createSubscription(data:ISubscriptionPlan): Promise<ISubscriptionPlan> {
        try {

            //validation comes here using zod 
            const validate = createSubscriptionSchema.safeParse(data)

            if(!validate.success){
                if(validate.error instanceof ZodError){
                    throw new CustomError(validate.error.errors[0].message, STATUS_CODES.BAD_REQUEST)
                }
            }

            const sub = await this.subscriptionRepository.create(data)
            if(!sub){
                throw new CustomError('Unable to create subscription',STATUS_CODES.INTERNAL_SERVER_ERROR)
            }
            return sub
        } catch (error) {
            if(error instanceof CustomError) {
                throw new CustomError(error.message, error.statusCode)
            }
            throw new CustomError('Unable to create subscription', STATUS_CODES.INTERNAL_SERVER_ERROR)
        }
    }

    async updateSubscription(id: string, data: Partial<ISubscriptionPlan>): Promise<ISubscriptionPlan> {
        try {
            
            // validation using zod to verfiy 
            const validate = updateSubscriptionSchema.safeParse(data)
            if(!validate.success){
                if(validate.error instanceof ZodError){
                    throw new CustomError(validate.error.errors[0].message, STATUS_CODES.BAD_REQUEST)
                }
            }

            const updatedSub = await this.subscriptionRepository.update(id, data)
            if(!updatedSub){
                throw new CustomError('Subscription not found', STATUS_CODES.NOT_FOUND)
            }

            
            return updatedSub;

        } catch (error) {
            if(error instanceof CustomError){
                throw new CustomError(error.message, error.statusCode)
            }
            throw new CustomError('Unable to update subscription', STATUS_CODES.INTERNAL_SERVER_ERROR)
        }
    }

    async deleteSubscription(id: string): Promise<boolean> {
        try {

            const deleteSub = await this.subscriptionRepository.delete(id)

            if(!deleteSub){
                throw new CustomError('Subscription not found', STATUS_CODES.NOT_FOUND)
            }
            return true;

        } catch (error) {
            if(error instanceof CustomError){
                throw new CustomError(error.message,error.statusCode)
            }

            throw new CustomError("Unable to delete subscription",STATUS_CODES.INTERNAL_SERVER_ERROR)
        }
    }

    async getAllSubscriptions(): Promise<ISubscriptionPlan[]> {
        try {

            const allSubs = await this.subscriptionRepository.getAll()
            if(!allSubs){
                throw new CustomError('No subscriptions found', STATUS_CODES.NOT_FOUND)
            }
            return allSubs;
            
        } catch (error) {
            if(error instanceof CustomError){
                throw new CustomError(error.message, error.statusCode)
            }
            throw new CustomError('Unable to get all subscriptions', STATUS_CODES.INTERNAL_SERVER_ERROR)
        }
    }
}