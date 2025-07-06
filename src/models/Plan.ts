import { Document, model, Schema } from "mongoose";

export enum PlanType  {
    'Free'="Free",
    'Pro'='Pro',
    'Enterprice'='Enterprise'
}

export interface IPlan extends Document{
    name:PlanType,
    price:number,
    limits:{
        maxProjects:number,
        maxTeams:number
        maxUsersPerTeam:number
    },
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
        maxProjects:{
            type:Number,
            required:true,
            min:0
        },
        maxTeams:{
            type:Number,
            required:true,
            min:0
        },
        maxUsersPerTeam:{
            type:Number,
            required:true,
            min:0
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
