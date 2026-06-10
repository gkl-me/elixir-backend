import { inject, injectable } from "tsyringe";
import { IWorkspaceRoleController } from "./interface/IWorkspaceRoleController";
import { Token } from "../../di/token";
import { IWorkspaceRoleService } from "../../services/workspace/interface/IWorkspaceRoleService";
import { Request, Response, NextFunction } from "express";
import { extractStringParams } from "../../helper/stringParamUtils";
import { successResponse } from "../../helper/responseHanlder";
import { STATUS_CODES } from "../../constants/statusCodes";
import { extractStringQueryParams } from "../../helper/queryParamUtils";

@injectable()
export class WorkspaceRoleController implements IWorkspaceRoleController {
  constructor(
    @inject(Token.WorkspaceRoleService)
    private readonly _workspaceRoleService: IWorkspaceRoleService
  ) {}

  async handleGetRoles(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { workspaceId } = extractStringParams(req.params, ["workspaceId"]);

      const roles = await this._workspaceRoleService.getRoles({
        workspaceId,
      });

      successResponse(res, "Workspace roles", STATUS_CODES.OK, { roles });
    } catch (error) {
      next(error);
    }
  }

  async handleCreateRole(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const params = extractStringQueryParams(req.params, ["workspaceId"]);
      console.log(params?.workspaceId);

      const { name, permissions, createdByUserId } = req.body;

      //validate the data
      await this._workspaceRoleService.createRole({
        workspaceId: params?.workspaceId || "",
        createdByUserId,
        permissions,
        name,
      });

      successResponse(
        res,
        "Workspace role created successfullly",
        STATUS_CODES.CREATED,
        {}
      );
    } catch (error) {
      next(error);
    }
  }

  async handleUpdateRole(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { workspaceId, roleId } = extractStringParams(req.params, [
        "workspaceId",
        "roleId",
      ]);

      //validate
      const { name, permissions } = req.body;

      await this._workspaceRoleService.updateRole({
        roleId,
        workspaceId,
        name,
        permissions,
      });

      successResponse(
        res,
        "Workspace Role succesffuly updated",
        STATUS_CODES.OK,
        {}
      );
    } catch (error) {
      next(error);
    }
  }

  async handleDeleteRole(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { workspaceId, roleId } = extractStringParams(req.params, [
        "workspaceId",
        "roleId",
      ]);

      await this._workspaceRoleService.deleteRole({
        workspaceId,
        roleId,
      });

      successResponse(res, "Workspace role deleted", STATUS_CODES.OK, {});
    } catch (error) {
      next(error);
    }
  }
}
