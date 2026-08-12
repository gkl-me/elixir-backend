import { IssuePriority, IssueStatus, IssueType } from "../../models/Issue";

export interface ICreateIssueDto {
  type: IssueType;
  title: string;
  description: string;
  storyPoints: number;
  priority: IssuePriority;
  status: IssueStatus;
  assignee: string;
  reporter: string;

  projectId: string;
  workspaceId: string;
  sprintId?: string;
}

export interface IListBacklogsDto {
  workspaceId: string;
  projectId: string;
  search?: string;
  status?: string;
  type?: string;
}

export interface IIssueResDto {
  id: string;
  title: string;
  key: string;
  description: string;
  type: IssueType;
  storyPoints: number;
  priority: IssuePriority;
  status: IssueStatus;
  assignee: string;
  reporter: string;

  projectId: string;
  workspaceId: string;
  sprintId?: string;

  labels: string[];
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IBackLogsDetailsDto {
  backLogs: IIssueResDto[] | [];
  totalCount: number;
  stories: number;
  bugs: number;
  totalStoryPoint: number;
}
