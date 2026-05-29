import { inject, injectable } from "tsyringe";
import { IWorkspaceController } from "./interface/IWorkspaceController";
import { Token } from "../../di/token";
import { IWorkspaceService } from "../../services/workspace/interface/IWorkspaceService";
import { Request, Response, NextFunction } from "express";
import { extractStringParams } from "../../helper/stringParamUtils";
import { success } from "zod/v4";
import { successResponse } from "../../helper/responseHanlder";





@injectable()
export class WorkspaceController implements IWorkspaceController{

    constructor(
        @inject(Token.WorkspaceService)private readonly _workspaceService:IWorkspaceService
    ){}


    async handleWorkspaceContext(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const userId = req.user.userId

            const workspaceContext = await this._workspaceService.workspaceContext({userId})

            successResponse(res,"Workspace context fetched successfully",200,{
                workspaceContext
            })

        } catch (error) {
            next(error)
        }
    }
}