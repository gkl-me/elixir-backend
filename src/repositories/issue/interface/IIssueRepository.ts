import { IIssue } from "../../../models/Issue";
import { IBaseRepository } from "../../base/interface/IBaseRepository";


export interface IGetBacklogsDto {
    search?: string,
    status?: string,
    type?: string,
    workspaceId: string,
    projectId: string
}

export interface IGetBacklogsResDto {
    issues: IIssue[],
    totalCount: number,
    stories: number,
    bugs: number,
    totalStoryPoint: number
}

export interface IIssueRepository extends IBaseRepository<IIssue> {
    getBacklogs(data: IGetBacklogsDto): Promise<IGetBacklogsResDto>
}