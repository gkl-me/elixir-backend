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


            const {type,cycle} = data;

            //validation comes here using zod 
            const validate = createSubscriptionSchema.safeParse(data)

            if(!validate.success){
                if(validate.error instanceof ZodError){
                    throw new CustomError(validate.error.errors[0].message, STATUS_CODES.BAD_REQUEST)
                }
            }

            //sub the type and cycle already exists
            const subscriptionExists = await this.subscriptionRepository.findByTypeAndCycle(type,cycle)

            if(subscriptionExists){
                throw new CustomError('Subscription already exists', STATUS_CODES.CONFLICT)
            }

            const createdSubscription = await this.subscriptionRepository.create(data)

            return createdSubscription;
            

        } catch (error) {
            if(error instanceof CustomError) {
                throw new CustomError(error.message, error.statusCode)
            }
            throw new CustomError('Unable to create subscription', STATUS_CODES.INTERNAL_SERVER_ERROR)
        }
    }

    async updateSubscription(id: string, data: Partial<ISubscriptionPlan>): Promise<ISubscriptionPlan|null> {
        try {
            

            const {type,cycle} = data;

            // validation using zod to verfiy 
            const validate = updateSubscriptionSchema.safeParse(data)
            if(!validate.success){
                if(validate.error instanceof ZodError){
                    throw new CustomError(validate.error.errors[0].message, STATUS_CODES.BAD_REQUEST)
                }
            }

            //sub the type and cycle already exists with different id
            const subscriptionExists = await this.subscriptionRepository.findOne({
                isDeleted:false,
                _id: {
                    $ne: id
                },
                type,
                cycle,

            })

            if(subscriptionExists){
                throw new CustomError('Subscription already exists', STATUS_CODES.CONFLICT)
            }

            const updatedSub = await this.subscriptionRepository.update(id, data)

            return updatedSub;

        } catch (error) {
            if(error instanceof CustomError){
                throw new CustomError(error.message, error.statusCode)
            }
            throw new CustomError('Unable to update subscription', STATUS_CODES.INTERNAL_SERVER_ERROR)
        }
    }

    async deleteSubscription(id: string): Promise<ISubscriptionPlan|null> {
        try {

            const deleteSub = await this.subscriptionRepository.delete(id,{isDeleted: true})

            return deleteSub

        } catch (error) {
            if(error instanceof CustomError){
                throw new CustomError(error.message,error.statusCode)
            }

            throw new CustomError("Unable to delete subscription",STATUS_CODES.INTERNAL_SERVER_ERROR)
        }
    }

    async getAllSubscriptions(): Promise<ISubscriptionPlan[]|null> {
        try {

            const allSubs = await this.subscriptionRepository.findAll({})

            return allSubs;
            
        } catch (error) {
            if(error instanceof CustomError){
                throw new CustomError(error.message, error.statusCode)
            }
            throw new CustomError('Unable to get all subscriptions', STATUS_CODES.INTERNAL_SERVER_ERROR)
        }
    }
}