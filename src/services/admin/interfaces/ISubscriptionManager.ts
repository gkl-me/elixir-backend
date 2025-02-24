import { ISubscriptionPlan } from "../../../models/SubscriptionPlan";

export interface ISubscriptionManager{
    createSubscription(data:ISubscriptionPlan):Promise<ISubscriptionPlan>;
    updateSubscription(id:string, data:Partial<ISubscriptionPlan>):Promise<ISubscriptionPlan|null>;
    deleteSubscription(id:string):Promise<ISubscriptionPlan|null>;
    getAllSubscriptions():Promise<ISubscriptionPlan[]|null>;
}