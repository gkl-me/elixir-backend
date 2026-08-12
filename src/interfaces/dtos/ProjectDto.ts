import { ProjectPriority, ProjectStatus } from "../../models/Project";

export interface ICreateProjectDto {
  workspaceId: string;
  name: string;
  description: string;
  tags: string[];
  priority: ProjectPriority;
  startDate: Date;
  dueDate: Date;
  teams: string[];
}

export interface IListProjectsDto {
  workspaceId: string;
  search?: string;
  status?: string;
  filter?: string;
  page: number;
  limit: number;
}

export interface IProjectDto {
  id: string;
  key: string;
  name: string;
  description: string;
  status: ProjectStatus;
  priority: ProjectPriority;
  tags: string[];
  teams: string[];
  startDate: Date;
  dueDate: Date;

  doneTasks: number;
  totalTasks: number;
  inProgressTasks: number;
  toDoTasks: number;
  inReviewTasks: number;
  totalStoryPoints: number;
  doneStoryPoints: number;

  createdAt?: Date;
  updatedAt?: Date;
}

export interface IGetProjectDetailsDto {
  workspaceId: string;
  projectId: string;
}

export interface IListProjectsResDto {
  projects: IProjectDto[] | [];
  totalCount: number;
  activeProjects: number;
  totalTasks: number;
  doneTasks: number;
}

export interface IProjectDetailsResDto {
  id: string;
  key: string;
  name: string;
  description: string;
  status: ProjectStatus;
  priority: ProjectPriority;
  tags: string[];
  teams: string[];
  startDate: Date;
  dueDate: Date;

  createdAt?: Date;
  updatedAt?: Date;
}
