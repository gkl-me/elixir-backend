import { Document, model, Schema } from "mongoose";

export interface IUser extends Document{
    name:string,
    email:string,
    password:string,
    isVerified:boolean
    isBlocked:boolean
    isDeleted:boolean
    createdAt?:Date
    updatedAt?:Date
}

const UserSchema = new Schema({
    name:{type:String,required:true},
    email:{type:String,required:true,unique:true},
    isVerified:{type:Boolean,default:false},
    isBlocked:{type:Boolean,default:false},
    isDeleted:{type:Boolean,default:false},
    password:{type:String,required:true},
},{
    timestamps:true
})


export const User = model<IUser>('User',UserSchema)

