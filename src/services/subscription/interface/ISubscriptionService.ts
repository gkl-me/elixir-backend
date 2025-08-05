import { ICreateCheckoutResponseDto, ICreateCheckoutDto, ICreateSubscriptionDto, ICreateSubscriptionResponseDto, IfindUserSubscriptionDto, IfindUserSubscriptionResponseDto, ICheckoutCompleteDto, IHandlePaymentSuccessDto, IHandlePaymentFailureDto, } from "../../../interfaces/dtos/SubscriptionDto";


export interface ISubscriptionService{
    createCheckout(data:ICreateCheckoutDto):Promise<ICreateCheckoutResponseDto>
    createSubscription(data:ICreateSubscriptionDto):Promise<ICreateSubscriptionResponseDto>
    findUserSubscription(data:IfindUserSubscriptionDto):Promise<IfindUserSubscriptionResponseDto|null>
    handleCheckoutComplete(data:ICheckoutCompleteDto):Promise<void>;
    handleInvoicePaymentSuccess(data:IHandlePaymentSuccessDto):Promise<void>
    handleInvoicePaymentFailure(data:IHandlePaymentFailureDto):Promise<void>
}