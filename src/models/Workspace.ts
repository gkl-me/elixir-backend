import { Document, model, Schema } from "mongoose";


export interface IWorkspace extends Document{
    name:string,
    userId:string,
    companyId?:string,
    subscriptionId?:string,
    createdAt?:Date
    updatedAt?:Date
}


const WorkspaceSchema = new Schema({
    name:{
        type:String,
        required:true
    },
    userId:{
        type:String,
        required:true
    },
    companyId:{
        type:String,
    },
    subscriptionId:{
        type:String
    }
},{
    timestamps:true
})


export const Workspace = model<IWorkspace>('Workspace',WorkspaceSchema)