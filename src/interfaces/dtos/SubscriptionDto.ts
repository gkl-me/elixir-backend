export interface SubscriptionDto{
    planId:string,
    userId:string,
}

export interface SubscriptionResponseDto{
    subscriptionId:string,
    clientSecret:string
}


export interface CreateCheckoutDto{
    planId:string,
    userId:string
}


export interface CreateCheckoutResponseDto{
    sessionId:string,
    checkoutUrl:string
}