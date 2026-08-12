import {
  ICreateProjectDto,
  IGetProjectDetailsDto,
  IListProjectsDto,
  IListProjectsResDto,
  IProjectDto,
} from "../../../interfaces/dtos/ProjectDto";

export interface IProjectService {
  createProject(data: ICreateProjectDto): Promise<void>;
  listProjects(data: IListProjectsDto): Promise<IListProjectsResDto>;
  getProjectsDetails(data: IGetProjectDetailsDto): Promise<IProjectDto>;
}
