import { injectable } from "tsyringe";
import { BaseRepository } from "../base/BaseRepository";
import { ISubscription, Subscription } from "../../models/Subscription";
import { ISubscriptionRepository } from "./interface/ISubscriptionRepository";


@injectable()
export class SubscriptionRepository extends BaseRepository<ISubscription> implements ISubscriptionRepository{
    constructor(){
        super(Subscription)
    }
    
}