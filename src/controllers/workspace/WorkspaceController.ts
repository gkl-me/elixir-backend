import { inject, injectable } from "tsyringe";
import { IWorkspaceController } from "./interface/IWorkspaceController";
import { Token } from "../../di/token";
import { IWorkspaceService } from "../../services/workspace/interface/IWorkspaceService";
import { Request, Response, NextFunction } from "express";
import { successResponse } from "../../helper/responseHanlder";
import { extractStringParams } from "../../helper/stringParamUtils";
import {
  CONSTANT_MESSAGES,
  WORKSPACE_MESSAGES,
} from "../../constants/messages";
import { STATUS_CODES } from "../../constants/statusCodes";
import { extractStringQueryParams } from "../../helper/queryParamUtils";

@injectable()
export class WorkspaceController implements IWorkspaceController {
  constructor(
    @inject(Token.WorkspaceService)
    private readonly _workspaceService: IWorkspaceService
  ) {}

  async handleWorkspaceContext(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const params = extractStringParams(req.params, ["slug"]);
      const slug = params.slug;
      const userId = req.user.userId;

      const workspaceContext = await this._workspaceService.workspaceContext({
        userId,
        slug,
      });

      if (workspaceContext) {
        req.workspace = {
          workspaceId: workspaceContext.workspaceId,
          workspaceSlug: workspaceContext.workspaceSlug,
        };
      }

      console.log("workspace", req.workspace);
      successResponse(res, WORKSPACE_MESSAGES.SUCCESS, STATUS_CODES.OK, {
        workspaceContext,
      });
    } catch (error) {
      next(error);
    }
  }

  async handleWorkspaceLimits(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const params = extractStringQueryParams(req.params, ["workspaceId"]);
      const workspaceId = params?.workspaceId || "";

      const data = await this._workspaceService.workspaceLimits({
        workspaceId,
      });

      successResponse(res, CONSTANT_MESSAGES.SUCCESS, STATUS_CODES.OK, data);
    } catch (error) {
      next(error);
    }
  }

  async handleListAllWorkspace(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const params = extractStringQueryParams(req.query, [
        "search",
        "status",
        "page",
        "limit",
      ]);

      const processed = {
        search: params?.search || "",
        status: params?.status || "",
        page: parseInt(params?.page || "1"),
        limit: parseInt(params?.limit || "10"),
      };

      const data = await this._workspaceService.listAllWorkspace(processed);

      successResponse(res, CONSTANT_MESSAGES.SUCCESS, STATUS_CODES.OK, data);
    } catch (error) {
      next(error);
    }
  }

  async handletoggleWorkspaceStatus(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { workspaceId } = extractStringParams(req.params, ["workspaceId"]);

      await this._workspaceService.toggleWorkspaceStatus({
        workspaceId,
      });

      successResponse(res, CONSTANT_MESSAGES.SUCCESS, STATUS_CODES.OK, {});
    } catch (error) {
      next(error);
    }
  }
}
