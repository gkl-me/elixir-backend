import { IssuePriority, IssueStatus, IssueType } from "../../models/Issue";




export interface ICreateIssueDto {
    type: IssueType,
    title: string,
    description: string,
    storyPoints: number,
    priority: IssuePriority,
    status: IssueStatus
    assignee: string
    reporter: string

    projectId: string,
    workspaceId: string
    sprintId?: string
}


