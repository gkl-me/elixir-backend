


export interface ICreateSubscriptionDto{
    userId:string,
    planId:string,
    workspaceId:string,
    stripeSubscriptionId?:string,
    stripePriceId?:string,
    status?:'active'|'inactive'|'canceled',
    currentPeriodStart?:Date,
    currentPeriodEnd?:Date,
}