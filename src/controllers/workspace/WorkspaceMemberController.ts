import { inject, injectable } from "tsyringe";
import { Token } from "../../di/token";
import { IWorkspaceMemberService } from "../../services/workspace/interface/IWorkspaceMemberService";
import { IWorkspaceMemberController } from "./interface/IWorkspaceMemberController";
import { Request, Response, NextFunction } from "express";
import { extractStringParams } from "../../helper/stringParamUtils";
import { successResponse } from "../../helper/responseHanlder";
import { STATUS_CODES } from "../../constants/statusCodes";
import { extractStringQueryParams } from "../../helper/queryParamUtils";

@injectable()
export class WorkspaceMemberController implements IWorkspaceMemberController {
  constructor(
    @inject(Token.WorkspaceMemberService)
    private readonly _workspaceMemberService: IWorkspaceMemberService
  ) {}

  async handleListMembers(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { workspaceId } = extractStringParams(req.params, ["workspaceId"]);

      const params = extractStringQueryParams(req.query, [
        "search",
        "page",
        "limit",
      ]);

      const search = params?.search || "";
      const page = parseInt(params?.page || "1");
      const limit = parseInt(params?.limit || "10");

      const result = await this._workspaceMemberService.listMember({
        workspaceId,
        search,
        limit,
        page,
      });
      successResponse(
        res,
        "Workspace members list fetched",
        STATUS_CODES.OK,
        result
      );
    } catch (error) {
      next(error);
    }
  }

  async handleUpdateMemberRole(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { workspaceId, memberId } = extractStringParams(req.params, [
        "workspaceId",
        "memberId",
      ]);

      const { roleId } = req.body;

      await this._workspaceMemberService.updateMemberRole({
        workspaceId,
        memberId,
        roleId,
      });

      successResponse(
        res,
        "Workspace memeber role updates",
        STATUS_CODES.OK,
        {}
      );
    } catch (error) {
      next(error);
    }
  }

  async handleRemoveMember(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { workspaceId, memberId } = extractStringParams(req.params, [
        "workspaceId",
        "memberId",
      ]);

      await this._workspaceMemberService.removeMember({
        workspaceId,
        memberId,
      });

      successResponse(res, "Workspace memeber removed", STATUS_CODES.OK, {});
    } catch (error) {
      next(error);
    }
  }
}
