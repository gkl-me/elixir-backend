import { ICreateProjectDto, IListProjectsDto, IListProjectsResDto } from "../../../interfaces/dtos/ProjectDto";



export interface IProjectService {
    createProject(data: ICreateProjectDto): Promise<void>
    listProjects(data: IListProjectsDto): Promise<IListProjectsResDto>
}