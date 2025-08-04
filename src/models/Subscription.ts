import { Document, model, Mongoose, Schema } from "mongoose";

export enum SUBSCRIBTION_STATUS{
    INCOMPLETE='incomplete',
    ACTIVE='active',
    OVERDUE='overdue',
    CANCELED='canceled'
}

export interface ISubscription extends Document{
    userId:string,
    planId:string
    stripePriceId?:string,
    stripeSubscriptionId?:string,
    status:SUBSCRIBTION_STATUS,
    current_period_start?:Date,
    current_period_end?:Date,
    createdAt:Date,
    updatedAt:Date
}


const SubscriptionSchema  = new Schema({
    userId:{
        type:String,
        required:true
    },
    planId:{
        type:String,
        required:true
    },
    stripePriceId:{
        type:String,
    },
    stripeSubscriptionId:{
        type:String
    },
    status:{
        type:String,
        enum:['incomplete','active','canceled','overdue'],
        default:'incomplete'
    },
    current_period_start:{
        type:Date
    },
    current_period_end:{
        type:Date
    }
},{
    timestamps:true
})


export const Subscription = model<ISubscription>('Subscription',SubscriptionSchema)