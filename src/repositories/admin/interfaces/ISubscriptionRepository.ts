import { ISubscriptionPlan } from "../../../models/SubscriptionPlan";
import { IBaseRepository } from "../../base/IBaseRepository";

export interface ISubscriptionRepository extends IBaseRepository<ISubscriptionPlan> {
    findByTypeAndCycle(type:string,cycle:string):Promise<ISubscriptionPlan|null>;
}