

export interface ICheckoutDto{
    userId:string,
    planId:string,
    sessionId:string
}

export interface ICheckoutResponseDto{
    sessionId:string,
    payment_url:string
}

export interface IVerifyPaymentDto{
    sessionId:string
}

export interface IRetryPaymentDto{
    userId:string,
}

export interface IRetryPaymentResponseDto{
    payment_url:string
}