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

export interface IGetProjectResDto extends IProject {
    doneTasks: number,
    totalTasks: number
    inProgressTasks: number,
    toDoTasks: number,
    inReviewTasks: number,
    totalStoryPoints: number,
    doneStoryPoints: number
}

export interface IGetProjectsResDto {
    projects: IGetProjectResDto[] | []
    totalCount: number
    activeProjects: number
    totalTasks: number
    doneTasks: number
}

export interface IGetProjectByIdDto {
    workspaceId: string
    projectId: string
}

export interface IProjectRepository extends IBaseRepository<IProject> {
    getProjects(data: IGetProjectsDto): Promise<IGetProjectsResDto>
    getProjectById(data: IGetProjectByIdDto): Promise<IGetProjectResDto>
}
