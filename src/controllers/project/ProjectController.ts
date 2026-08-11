import { inject, injectable } from "tsyringe";
import { IProjectController } from "./interface/IProjectController";
import { IProjectService } from "../../services/project/interface/IProjectService";
import { Token } from "../../di/token";
import { Request, Response, NextFunction } from "express";
import { successResponse } from "../../helper/responseHanlder";
import { STATUS_CODES } from "../../constants/statusCodes";
import { extractStringParams } from "../../helper/stringParamUtils";
import { extractStringQueryParams } from "../../helper/queryParamUtils";




@injectable()
export class ProjectController implements IProjectController {
    constructor(
        @inject(Token.ProjectService) private readonly _projectService: IProjectService
    ) { }

    async handleCreateProject(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {

            const { workspaceId } = extractStringParams(req.params, ["workspaceId"])

            const { name, description, startDate, dueDate, tags, teams, priority } = req.body

            await this._projectService.createProject({
                name,
                workspaceId,
                description,
                startDate,
                dueDate,
                tags,
                teams,
                priority
            })


            successResponse(res, "Project created successfully", STATUS_CODES.CREATED, {})

        } catch (error) {
            next(error)
        }
    }

    async handleListProjects(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {

            const params = extractStringQueryParams(req.query, ["search", "filter", "status", "page", "limit"])
            const { workspaceId } = extractStringParams(req.params, ["workspaceId"])

            const processed = {
                search: params?.search || "",
                status: params?.status || "",
                filter: params?.filter || "",
                page: parseInt(params?.page || "1"),
                limit: parseInt(params?.limit || "8")
            }

            const result = await this._projectService.listProjects({
                ...processed,
                workspaceId
            })

            successResponse(res, "Projects fetched success", STATUS_CODES.OK, result)

        } catch (error) {
            next(error)
        }
    }
}