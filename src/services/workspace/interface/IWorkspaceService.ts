import { IWorkspace } from "../../../models/Workspace"




export interface IWorkspaceService{
    createWorkspace({name,userId,companyId,subscriptionId}:{
        name:string,
        userId:string,
        companyId?:string,
        subscriptionId?:string
    }):Promise<IWorkspace>
}