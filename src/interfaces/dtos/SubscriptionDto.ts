import { SUBSCRIBTION_STATUS } from "../../models/Subscription"

export interface ICreateCheckoutDto{
    stripeCustomerId:string,
    stripePriceId:string,
    userId:string,
    planId:string
}


export interface ICreateCheckoutResponseDto{
    sessionId:string,
    checkoutUrl:string
}


export interface ICreateSubscriptionDto{
    planId:string,
    userId:string
}


export interface ICreateSubscriptionResponseDto{
    subscriptionId?:string,
    subscriptionStatus?:SUBSCRIBTION_STATUS,
    sessionId?:string,
    checkoutUrl?:string
}


export interface ICreateStripCustomerDto{
    userId:string
}

export interface ICreateStripeCustomerResponseDto{
    stripeCustomerId:string
}


export interface IfindUserSubscriptionDto{
    userId:string
}

export interface IfindUserSubscriptionResponseDto{
    subscriptionId:string,
    subscriptionStatus:SUBSCRIBTION_STATUS,
    invoiceUrl?:string
}


export interface ICheckoutCompleteDto{
    metadata?:StripeCheckOutMetadata|null
    stripeSubscriptionId?:string
}

export interface StripeCheckOutMetadata{
    userId?:string,
    planId?:string
}

export interface IHandlePaymentSuccessDto{
    subId:string|null
}

export interface IHandlePaymentFailureDto{
    subId:string|null
    invoiceUrl:string|null
}