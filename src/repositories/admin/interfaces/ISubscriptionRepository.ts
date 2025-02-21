import { ISubscriptionPlan } from "../../../models/SubscriptionPlan";

export interface ISubscriptionRepository{
    create(data:ISubscriptionPlan):Promise<ISubscriptionPlan>
    update(id:string,data:Partial<ISubscriptionPlan>):Promise<ISubscriptionPlan>
    delete(id:string):Promise<boolean>
    getAll():Promise<ISubscriptionPlan[]>
}