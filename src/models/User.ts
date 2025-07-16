import { Document, model, Schema } from "mongoose";
import { PlanType } from "./Plan";

export enum UserType{
    INDIVIDUAL='individual',
    COMPANY='company'
}

export interface IUser extends Document{
    name:string,
    email:string,
    password:string,
    isVerified:boolean
    isBlocked:boolean
    createdAt?:Date
    updatedAt?:Date
    plan:PlanType,
    userType:UserType
    workSpaceId:string
    companyId:string
    
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
        required:true
    },
    plan:{
        type:String,
        enum:['Free','Pro','Enterprice']
    },
    userType:{
        type:String,
        enum:['individual','company']
    },
    workSpaceId:{
        type:String
    },
    companyId:{
        type:String
    }
},{
    timestamps:true
})


export const User = model<IUser>('User',UserSchema)

