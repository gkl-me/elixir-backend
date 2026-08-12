import { inject, injectable } from "tsyringe";
import { IIssueController } from "./interface/IIssueController";
import { Token } from "../../di/token";
import { IIssueService } from "../../services/issue/interface/IIssueService";
import { Request, NextFunction, Response } from "express";
import { extractStringParams } from "../../helper/stringParamUtils";
import { successResponse } from "../../helper/responseHanlder";
import { STATUS_CODES } from "../../constants/statusCodes";




@injectable()
export class IssueController implements IIssueController {
    constructor(
        @inject(Token.IssueService) private readonly _issueService: IIssueService
    ) { }

    async handleCreateBacklogIssue(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {

            const { workspaceId } = extractStringParams(req.params, ["workspaceId"])
            const reporter = req.user.userId

            const {
                assignee,
                description,
                priority,
                projectId,
                status,
                storyPoints,
                title,
                type, } = req.body

            await this._issueService.createBacklogIssue({
                assignee,
                description,
                priority,
                projectId,
                reporter,
                status,
                storyPoints,
                title,
                type,
                workspaceId,
            })

            successResponse(res, "Issue successfully created", STATUS_CODES.CREATED, {})

        } catch (error) {
            next(error)
        }
    }
}