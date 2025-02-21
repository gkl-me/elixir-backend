import { STATUS_CODES } from "../../constants/statusCodes";
import { CustomError } from "../../errors/CustomError";
import { ISubscriptionPlan, SubscriptionPlan } from "../../models/SubscriptionPlan";
import { ISubscriptionRepository } from "./interfaces/ISubscriptionRepository";

export class SubscriptionRepository implements ISubscriptionRepository {

    async create(data:ISubscriptionPlan): Promise<ISubscriptionPlan> {
        try {

            const {type,cycle} = data;

            const subExists = await SubscriptionPlan.findOne({type,cycle,isDeleted:false});

            if(subExists){
                throw new CustomError('Subscription with same type and cycle already exists', STATUS_CODES.CONFLICT)
            }

            const newSubscription = await SubscriptionPlan.create(data);

            if(!newSubscription){
                throw new CustomError('Unable to add new subscription', STATUS_CODES.INTERNAL_SERVER_ERROR)
            }
            return newSubscription

        } catch (error) {
            if(error instanceof Error){
                throw new CustomError(error.message,STATUS_CODES.INTERNAL_SERVER_ERROR)
            }
            throw new CustomError('Unable to create new subscription', STATUS_CODES.INTERNAL_SERVER_ERROR)
        }
    }

    async update(id: string, data: Partial<ISubscriptionPlan>): Promise<ISubscriptionPlan> {
        try {


            const{ type,cycle} = data;

            //check if the sub type and cycle exists in the db 
            const subTypesExists = await SubscriptionPlan.findOne({
                _id:{$ne:id},
                type,
                cycle,
                isDeleted:false
            })

            if(subTypesExists){
                throw new CustomError('Subscription with same type and cycle already exists', STATUS_CODES.CONFLICT)
            }

            const updatedSubscription = await SubscriptionPlan.findOneAndUpdate(
                {_id:id,isDeleted:false},
                data,
                {new:true}
            )

            if(!updatedSubscription){
                throw new CustomError('Subscription not found', STATUS_CODES.NOT_FOUND)
            }

            return updatedSubscription;
            
        } catch (error) {
            if(error instanceof Error){
                throw new CustomError(error.message, STATUS_CODES.INTERNAL_SERVER_ERROR)
            }
            throw new CustomError('Unable to update subscription', STATUS_CODES.INTERNAL_SERVER_ERROR)
        }
    }

    async delete(id: string): Promise<boolean> {
        try {
            
            const deletedSubscription = await SubscriptionPlan.findByIdAndUpdate(id, {isDeleted: true});

            if(!deletedSubscription){
                throw new CustomError('Subscription not found', STATUS_CODES.NOT_FOUND)
            }

            return true

        } catch (error) {
            if(error instanceof Error){
                throw new CustomError('Unable to delete subscription', STATUS_CODES.INTERNAL_SERVER_ERROR)
            }
            throw new CustomError('Unable to delete subscription', STATUS_CODES.INTERNAL_SERVER_ERROR)
        }
    }

    async getAll(): Promise<ISubscriptionPlan[]> {
        try {

            const allSubscriptions = await SubscriptionPlan.find({isDeleted:false});

            if(!allSubscriptions){
                throw new CustomError('No subscriptions found', STATUS_CODES.NOT_FOUND)
            }

            return allSubscriptions;
            
        } catch (error) {
            if(error instanceof Error){
                throw new CustomError(error.message, STATUS_CODES.INTERNAL_SERVER_ERROR)
            }
            throw new CustomError('Unable to get all subscriptions', STATUS_CODES.INTERNAL_SERVER_ERROR)
        }
    }
}