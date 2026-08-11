import { IProject } from "../../models/Project";
import { IProjectDto } from "../dtos/ProjectDto";




export class ProjectDtoMapper {
    static toProjectList(project: IProject): IProjectDto {
        return {
            id: String(project._id),
            key: project.key,
            name: project.name,
            description: project.description,
            status: project.status,
            priority: project.priority,
            tags: project.tags,
            startDate: project.startDate,
            dueDate: project.dueDate,

            createdAt: project.createdAt,
            updatedAt: project.updatedAt
        }
    }
}