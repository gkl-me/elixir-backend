import { Document, model, Mongoose, Schema } from "mongoose";

export type SUBSCRIBTION_STATUS = 'active'|'inactive'|'canceled'

export interface ISubscription extends Document{


    userId:string,
    workspaceId:string

    stripeSubscriptionId:string
    stripePriceId:string

    planId:string

    status:SUBSCRIBTION_STATUS,

    currentPeriodStart?:Date,
    currentPeriodEnd?:Date,

    cancelAtPeriodEnd?:Date

    createdAt?:Date,
    updatedAt?:Date
}


const SubscriptionSchema  = new Schema({
    userId:{
        type:String,
        required:true
    },
    workSpaceId:{
        type:String
    },
    stripePriceId:{
        type:String
    },
    stripeSubscriptionId:{
        type:String
    },
    status:{
        type:String,
        enum:['active','inactive','cancelled'],
        default:'inactive'
    },
    currentPeriodStart:{
        type:Date
    },
    currentPeriodEnd:{
        type:Date
    },
    cancelAtPeriodEnd:{
        type:Date
    },
    planId:{
        type:String
    }
},{
    timestamps:true
})


export const Subscription = model<ISubscription>('Subscription',SubscriptionSchema)