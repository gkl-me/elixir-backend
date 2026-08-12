import { IProject } from "../../models/Project";
import { IGetProjectResDto } from "../../repositories/project/interface/IProjectRepository";
import { IProjectDto } from "../dtos/ProjectDto";




export class ProjectDtoMapper {
    static toProjectList(project: IGetProjectResDto): IProjectDto {
        return {
            id: String(project._id),
            key: project.key,
            name: project.name,
            description: project.description,
            status: project.status,
            priority: project.priority,
            tags: project.tags || [],
            startDate: project.startDate,
            dueDate: project.dueDate,
            teams: project.teams || [],
            doneTasks: project.doneTasks || 0,
            totalTasks: project.totalTasks || 0,
            inProgressTasks: project.inProgressTasks || 0,
            toDoTasks: project.toDoTasks || 0,
            inReviewTasks: project.inReviewTasks || 0,
            totalStoryPoints: project.totalStoryPoints || 0,
            doneStoryPoints: project.doneStoryPoints || 0,

            createdAt: project.createdAt,
            updatedAt: project.updatedAt
        }
    }
}