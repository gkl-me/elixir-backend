import { inject, injectable } from "tsyringe";
import { IIssueService } from "./interface/IIssueService";
import { Token } from "../../di/token";
import { IIssueRepository } from "../../repositories/issue/interface/IIssueRepository";
import { ICreateIssueDto } from "../../interfaces/dtos/IssueDto";
import { logError } from "../../middlewares/loggerHelper";
import { ICacheRepository } from "../../repositories/cache/interface/ICacheRepository";
import { IProjectRepository } from "../../repositories/project/interface/IProjectRepository";
import { CustomError } from "../../errors/CustomError";
import { STATUS_CODES } from "../../constants/statusCodes";



@injectable()
export class IssueService implements IIssueService {
    constructor(
        @inject(Token.IssueRepository) private readonly _issueRepository: IIssueRepository,
        @inject(Token.CacheRepository) private readonly _cacheRepositroy: ICacheRepository<number>,
        @inject(Token.ProjectRepository) private readonly _projectRepository: IProjectRepository
    ) { }

    async createBacklogIssue(data: ICreateIssueDto): Promise<void> {
        try {

            const { type, title, description, storyPoints, priority, status, assignee, reporter, projectId, workspaceId } = data

            //create key 
            const project = await this._projectRepository.findById(projectId)
            if (!project) {
                throw new CustomError("Project not found", STATUS_CODES.BAD_REQUEST)
            }

            const key = project.key

            let count = await this._cacheRepositroy.get(project.key)
            if (!count) {
                count = 1
            } else {
                count++
                await this._cacheRepositroy.set(key, count)
            }

            await this._issueRepository.create({
                title,
                key: `${key}-${count}`,
                type,
                description,
                storyPoints,
                priority,
                projectId,
                status,
                assignee,
                reporter,
                workspaceId
            })



        } catch (error) {
            logError(error, {
                service: "IssueService.createBacklogIssue"
            })
            throw error
        }
    }
}