import { inject, injectable } from "tsyringe";
import { IWorkspaceService } from "./interface/IWorkspaceService";
import { Token } from "../../di/token";
import { IWorkspaceRepository } from "../../repositories/workspace/interface/IWorkspaceRepository";





@injectable()
export class WorkspaceService implements IWorkspaceService{
    constructor(
        @inject(Token.WorkspaceRepository) private readonly _workspaceRepository:IWorkspaceRepository
    ){}

    async createWorkspace({name,userId,companyId,subscriptionId}:{
        name:string,
        userId:string,
        companyId?:string,
        subscriptionId?:string
    }){
        try {
            
            const workspace = await this._workspaceRepository.create({
                name,
                userId,
                companyId,
                subscriptionId
            })

            return workspace 

        } catch (error) {
            throw error
        }
    }
}