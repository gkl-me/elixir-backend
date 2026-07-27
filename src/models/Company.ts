import mongoose, { Document, model,  } from "mongoose";

<<<<<<< Updated upstream


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

=======
export interface ICompany extends Document {
  name: string;
  type: string;
  size: number;
  email: string;
  phone: string;
  website?: string;
  status: 'active' | 'suspended';
  createdAt?: Date;
  updatedAt?: Date;
}

const CompanySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      required: true,
    },
    size: {
      type: Number,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    website: {
      type: String,
    },
    phone: {
      type: String,
    },
    status: {
      type: String,
      enum: ['active', 'suspended'],
      default: 'active',
    },
  },
  {
    timestamps: true,
  }
);
>>>>>>> Stashed changes

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

