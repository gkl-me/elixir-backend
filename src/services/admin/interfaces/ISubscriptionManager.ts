import { ISubscriptionPlan } from "../../../models/SubscriptionPlan";

export interface ISubscriptionManager{
    createSubscription(data:ISubscriptionPlan):Promise<ISubscriptionPlan>;
    updateSubscription(id:string, data:Partial<ISubscriptionPlan>):Promise<ISubscriptionPlan>;
    deleteSubscription(id:string):Promise<boolean>;
    getAllSubscriptions():Promise<ISubscriptionPlan[]>;
}