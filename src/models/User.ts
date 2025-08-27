import { Document, model, Schema } from "mongoose";
import { PlanType } from "./Plan";
import { string } from "zod";

export enum UserType{
    USER='user',
    COMPANY='company'
}

export interface IUser extends Document{
    name:string,
    email:string,
    password?:string,
    isVerified:boolean
    isBlocked:boolean
    createdAt?:Date
    updatedAt?:Date,
    role:UserType
    workSpaceId:string
    companyId:string
    stripeCustomerId:string
    googleId?:string
    image?:string
}

const UserSchema = new Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    isVerified:{
        type:Boolean,
        default:false
    },
    isBlocked:{
        type:Boolean,
        default:false
    },
    password:{
        type:String,
    },
    role:{
        type:String,
        default:'user',
        enum:['user','company']
    },
    workSpaceId:{
        type:String
    },
    companyId:{
        type:String
    },
    stripeCustomerId:{
        type:String,
    },
    googleId:{
        type:String,
    },
    image:{
        type:String
    }
},{
    timestamps:true
})


export const User = model<IUser>('User',UserSchema)

