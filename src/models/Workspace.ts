import { Document, model, Schema } from "mongoose";


export interface IWorkspace extends Document{
    name:string,
    createdAt?:Date
    updatedAt?:Date
}


const WorkspaceSchema = new Schema({
    name:{
        type:String,
        required:true
    }
},{
    timestamps:true
})


export const Workspace = model<IWorkspace>('Workspace',WorkspaceSchema)