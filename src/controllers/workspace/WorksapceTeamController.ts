import { inject, injectable } from "tsyringe";
import { IWorkspaceTeamController } from "./interface/IWorkspaceTeamController";
import { Token } from "../../di/token";
import { IWorkspaceTeamService } from "../../services/workspace/interface/IWorkspaceTeamService";
import { Request, Response, NextFunction } from "express";
import { extractStringQueryParams } from "../../helper/queryParamUtils";
import { successResponse } from "../../helper/responseHanlder";
import { STATUS_CODES } from "../../constants/statusCodes";
import { extractStringParams } from "../../helper/stringParamUtils";

@injectable()
export class WorkspaceTeamController implements IWorkspaceTeamController {
  constructor(
    @inject(Token.WorkspaceTeamService)
    private readonly workspaceTeamService: IWorkspaceTeamService
  ) { }

  async handleListTeams(
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

      const proccessParams = {
        search: params?.search ?? "",
        page: parseInt(params?.page || "1"),
        limit: parseInt(params?.limit || "10"),
      };

      const result = await this.workspaceTeamService.listTeams({
        workspaceId,
        ...proccessParams,
      });

      successResponse(
        res,
        "Workspace teams fetched successfully",
        STATUS_CODES.OK,
        result
      );
    } catch (error) {
      next(error);
    }
  }

  async handleCreateTeam(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const params = extractStringQueryParams(req.params, ["workspaceId"]);
      const workspaceId = params?.workspaceId || "";

      const { name, memberIds, description } = req.body;

      const createdByUserId = req?.user.userId;

      await this.workspaceTeamService.createTeam({
        workspaceId,
        name,
        createdByUserId,
        memberIds,
        description,
      });

      successResponse(
        res,
        "Workspace team created successfully",
        STATUS_CODES.CREATED,
        {}
      );
    } catch (error) {
      next(error);
    }
  }

  async handleAddMembers(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const params = extractStringQueryParams(req.params, [
        "workspaceId",
        "teamId",
      ]);
      const workspaceId = params?.workspaceId || "";
      const teamId = params?.teamId || "";

      const { memberIds } = req.body;

      await this.workspaceTeamService.addMembers({
        workspaceId,
        memberIds,
        teamId,
      });

      successResponse(res, "Members added successfully", STATUS_CODES.OK, {});
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
      const params = extractStringQueryParams(req.params, [
        "workspaceId",
        "teamId",
        "memberId",
      ]);
      const workspaceId = params?.workspaceId || "";
      const teamId = params?.teamId || "";
      const memberId = params?.memberId || "";

      await this.workspaceTeamService.removeMember({
        workspaceId,
        memberId,
        teamId,
      });

      successResponse(res, "Member removed successfully", STATUS_CODES.OK, {});
    } catch (error) {
      next(error);
    }
  }

  async handleGetTeam(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const params = extractStringQueryParams(req.params, [
        "workspaceId",
        "teamId",
      ]);
      const workspaceId = params?.workspaceId || "";
      const teamId = params?.teamId || "";

      console.log("works", workspaceId, "team", teamId);

      const team = await this.workspaceTeamService.getTeam({
        workspaceId,
        teamId,
      });

      successResponse(res, "Team fetched successfully", STATUS_CODES.OK, {
        team,
      });
    } catch (error) {
      next(error);
    }
  }

  async handleGetUniqueTeamMembers(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {


      const { workspaceId } = extractStringParams(req.params, ["workspaceId"])

      const { teamIds, search } = req.body

      const members = await this.workspaceTeamService.getUniqueTeamMembers({
        workspaceId,
        teamIds,
        search
      });

      successResponse(res, "Team fetched successfully", STATUS_CODES.OK, {
        members
      });
    } catch (error) {
      next(error);
    }
  }
}
