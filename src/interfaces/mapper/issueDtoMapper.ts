import { IIssue } from "../../models/Issue";
import { IIssueResDto } from "../dtos/IssueDto";


export class IssueDtoMapper {
    static toIssueResDto(issue: IIssue): IIssueResDto {
        return {
            id: issue._id.toString(),
            title: issue.title,
            key: issue.key,
            description: issue.description,
            type: issue.type,
            storyPoints: issue.storyPoints,
            priority: issue.priority,
            status: issue.status,
            assignee: issue.assignee,
            reporter: issue.reporter,
            projectId: issue.projectId,
            workspaceId: issue.workspaceId,
            sprintId: issue.sprintId,
            labels: issue.labels,
            createdAt: issue.createdAt,
            updatedAt: issue.updatedAt,
        }
    }
}