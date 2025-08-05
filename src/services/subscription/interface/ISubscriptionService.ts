import { ICreateCheckoutResponseDto, ICreateCheckoutDto, ICreateSubscriptionDto, ICreateSubscriptionResponseDto, IfindUserSubscriptionDto, IfindUserSubscriptionResponseDto, } from "../../../interfaces/dtos/SubscriptionDto";


export interface ISubscriptionService{
    createCheckout(data:ICreateCheckoutDto):Promise<ICreateCheckoutResponseDto>
    createSubscription(data:ICreateSubscriptionDto):Promise<ICreateSubscriptionResponseDto>
    findUserSubscription(data:IfindUserSubscriptionDto):Promise<IfindUserSubscriptionResponseDto|null>
}