import mongoose, { Document, model,  } from "mongoose";



export interface ICompany extends Document{
    name:string,
    industry:string,
    employees:number,
    email:string,
    password:string,
    website?:string,
    isBlocked:boolean,
    createdAt?:Date
    updatedAt?:Date
}


const CompanySchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    industry:{
        type:String,
        required:true
    },
    employees:{
        type:Number,
        required:true
    },
    adminEmail:{
        type:String,
        required:true,
        unique:true
    },
    adminPassword:{
        type:String,
        required:true
    },
    website:{
        type:String
    },
    isBlocked:{
        type:Boolean,
        default:false
    },
},{
    timestamps:true
})


export const Company = model<ICompany>('company',CompanySchema)

