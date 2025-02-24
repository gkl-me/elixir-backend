import { FilterQuery } from "mongoose";
import { STATUS_CODES } from "../../constants/statusCodes";
import { CustomError } from "../../errors/CustomError";
import { ISubscriptionPlan, SubscriptionPlan } from "../../models/SubscriptionPlan";
import { BaseRepository } from "../base/BaseRepository";
import { ISubscriptionRepository } from "./interfaces/ISubscriptionRepository";

export class SubscriptionRepository extends BaseRepository<ISubscriptionPlan> implements ISubscriptionRepository{
    constructor(){
        super(SubscriptionPlan)
    }

    async findByTypeAndCycle(type:string,cycle:string): Promise<ISubscriptionPlan | null> {
        try {
            
            const subscription = await this.model.findOne({type,cycle,isDeleted:false})
            return subscription;

        } catch (error) {
            throw new CustomError('Failed to find subscription',STATUS_CODES.INTERNAL_SERVER_ERROR)
        }
    }
}