import { Document, model, Schema } from "mongoose";

export enum PlanType  {
    'Free'="Free",
    'Pro'='Pro',
    'Enterprice'='Enterprice'
}

export interface IPlan extends Document{
    name:PlanType,
    price:number,
    limits:{
        projects:number,
        teams:number,
        members:number,
        customRoles:number,
        storageBytes:number
    },
    features:{
        githubAutomation:boolean,
        automationScripts:boolean
    }
    stripePriceId?:string,
    stripeProductId?:string,
    isActive:boolean,
    createdAt?:Date,
    updatedAt?:Date
}

const PlanSchema = new Schema({
    name:{
        type:String,
        enum:['Free','Pro','Enterprice'],
        required:true,
        unique:true
    },
    price:{
        type:Number,
        required:true,
        default:0
    },
    limits:{
        projects:{
            type:Number,
            required:true,
            min:-1
        },
        teams:{
            type:Number,
            required:true,
            min:-1
        },
        members:{
            type:Number,
            required:true,
            min:-1
        },
        customRoles:{
            type:Number,
            required:true,
            min:0
        },
        storageBytes:{
            type:Number,
            required:true,
            min:0
        }
    },
    features:{
        githubAutomation:{
            type:Boolean,
            default:false
        },
        automationScripts:{
            type:Boolean,
            default:false
        }
    },
    stripePriceId:{
        type:String,
    },
    stripeProductId:{
        type:String
    },
    isActive:{
        type:Boolean,
        default:true
    }
},{
    timestamps:true
})


export const Plan = model<IPlan>('Plan',PlanSchema)
