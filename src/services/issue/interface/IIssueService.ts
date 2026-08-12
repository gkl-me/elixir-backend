import {
  IBackLogsDetailsDto,
  ICreateIssueDto,
  IListBacklogsDto,
} from "../../../interfaces/dtos/IssueDto";

export interface IIssueService {
  createBacklogIssue(data: ICreateIssueDto): Promise<void>;
  listBacklog(data: IListBacklogsDto): Promise<IBackLogsDetailsDto>;
}
