import { ICreateIssueDto } from "../../../interfaces/dtos/IssueDto";



export interface IIssueService {
    createBacklogIssue(data: ICreateIssueDto): Promise<void>
}