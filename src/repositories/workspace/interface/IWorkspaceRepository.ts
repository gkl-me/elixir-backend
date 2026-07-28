import { PlanType } from "../../../models/Plan";
import { IWorkspace } from "../../../models/Workspace";
import { BaseRepository } from "../../base/BaseRepository";

export interface IWorkspaceRepository extends BaseRepository<IWorkspace> {
    getWorkspaceDetails(data: IGetAllWorkspace): Promise<IGetAllWorkspaceRes>
}


export interface IGetAllWorkspace {
    search?: string,
    status?: string,
    skip: number,
    limit: number,
}

export interface IGetAllWorkspaceDetails {
    _id: string,
    name: string,
    ownerEmail: string,
    totalUsers: number,
    status: string,
    planType: PlanType,
    createdAt?: Date,
}


export interface IGetAllWorkspaceRes {
    workspaces: IGetAllWorkspaceDetails[] | []
    totalCount: number
}