import { IProject } from "../../../models/Project";
import { IBaseRepository } from "../../base/interface/IBaseRepository";


export interface IGetProjectsDto {
    search?: string,
    status?: string,
    filter?: string,
    skip: number,
    limit: number,
    workspaceId: string,
}

export interface IGetProjectsResDto {
    projects: IProject[] | []
    totalCount: number
    activeProjects: number
    totalTasks?: number
    doneTasks?: number
}

export interface IProjectRepository extends IBaseRepository<IProject> {
    getProjects(data: IGetProjectsDto): Promise<IGetProjectsResDto>
}
