import { inject, injectable } from "tsyringe";
import { IProjectService } from "./interface/IProjectService";
import { Token } from "../../di/token";
import { IProjectRepository } from "../../repositories/project/interface/IProjectRepository";
import { ICreateProjectDto, IListProjectsDto, IListProjectsResDto } from "../../interfaces/dtos/ProjectDto";
import { logError } from "../../middlewares/loggerHelper";
import { generateProjectKey } from "../../helper/generateProjectKey";
import { ProjectDtoMapper } from "../../interfaces/mapper/projectDtoMapper";





@injectable()
export class ProjectService implements IProjectService {
    constructor(
        @inject(Token.ProjectRepository) private readonly _projectRepository: IProjectRepository
    ) { }


    async createProject(data: ICreateProjectDto): Promise<void> {
        try {

            const { name, description, tags, priority, startDate, dueDate, teams, workspaceId } = data

            const key = generateProjectKey(name)
            await this._projectRepository.create({
                name,
                key,
                workspaceId,
                description,
                tags,
                priority,
                startDate,
                dueDate,
                teams
            })

        } catch (error) {
            logError(error, {
                service: "ProjectService.createProject"
            })
            throw error;
        }
    }

    async listProjects(data: IListProjectsDto): Promise<IListProjectsResDto> {
        try {

            const { search, filter, status, workspaceId, limit, page } = data

            const skip = (page - 1) * limit


            const { projects, activeProjects, totalCount } = await this._projectRepository.getProjects({
                search,
                filter,
                status,
                skip,
                limit,
                workspaceId
            })


            return {
                totalCount,
                activeProjects,
                projects: projects.map(ProjectDtoMapper.toProjectList)
            }


        } catch (error) {
            logError(error, {
                service: "ProjectService.listProjects"
            })
            throw error;
        }
    }

}