import { NextFunction, Request, Response } from "express";
import { WORKSPACE_PERMISSION } from "../constants/workspacePermissions";
import { CustomError } from "../errors/CustomError";
import { CONSTANT_MESSAGES } from "../constants/messages";
import { STATUS_CODES } from "../constants/statusCodes";
import { container } from "tsyringe";
import { Token } from "../di/token";
import { IWorkspaceRoleRepository } from "../repositories/workspace/interface/IWorkspaceRoleRepository";
import { IWorkspaceMemberRepository } from "../repositories/workspace/interface/IWorkspaceMemberRepository";

export const requirePermission = (...required: WORKSPACE_PERMISSION[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const _workspaceMemberRepository =
        container.resolve<IWorkspaceMemberRepository>(
          Token.WorkspaceMemberRepository
        );
      const _workspaceRoleRepository =
        container.resolve<IWorkspaceRoleRepository>(
          Token.WorkspaceRoleRepository
        );

      const userId = req.user.userId;
      const workspaceId = req.params.workspaceId;

      if (!userId || !workspaceId) {
        throw new CustomError(
          CONSTANT_MESSAGES.UNAUTHORIZED,
          STATUS_CODES.UNAUTHORIZED
        );
      }

      const memberRepo = await _workspaceMemberRepository.findOne({
        workspaceId,
        userId,
        isRemoved: false,
      });
      const roleRepo = await _workspaceRoleRepository.findById(
        memberRepo?.roleId || ""
      );

      if (!memberRepo || !roleRepo) {
        throw new CustomError(
          CONSTANT_MESSAGES.UNAUTHORIZED,
          STATUS_CODES.UNAUTHORIZED
        );
      }

      const permissions = roleRepo.permissions;

      const allowed = required.every((perm) => {
        return permissions.includes(perm) || permissions.includes("*");
      });

      req.workspaceMember = {
        workspaceMemberId: memberRepo._id.toString(),
        workspaceRoleId: roleRepo._id.toString(),
        permissions: permissions,
      };
      next();
    } catch (error) {
      next(error);
    }
  };
};
