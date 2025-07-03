import { Document, model, Schema } from "mongoose";

export interface IAdmin extends Document {
    name:string,
    email:string,
    password:string
}


const adminSchema = new Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    }
},{
    timestamps:true
})


export const Admin = model<IAdmin>('Admin',adminSchema)