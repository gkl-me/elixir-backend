import { injectable } from "tsyringe";
import {
  IWorkspaceMember,
  WorkspaceMember,
} from "../../models/WorkspaceMember";
import { BaseRepository } from "../base/BaseRepository";
import {
  IUserWorkspace,
  IWorkspaceMemberRepository,
  IWorkspaceMemberWithUser,
} from "./interface/IWorkspaceMemberRepository";
import { CustomError } from "../../errors/CustomError";
import { STATUS_CODES } from "../../constants/statusCodes";
import { logError } from "../../middlewares/loggerHelper";

@injectable()
export class WorkspaceMemberRepository
  extends BaseRepository<IWorkspaceMember>
  implements IWorkspaceMemberRepository
{
  constructor() {
    super(WorkspaceMember);
  }

  async listMembers(
    workspaceId: string
  ): Promise<IWorkspaceMemberWithUser[] | []> {
    try {
      const data = await this._model.aggregate([
        {
          $match: {
            workspaceId: workspaceId,
            isRemoved: false,
          },
        },
        {
          $addFields: {
            userObjId: {
              $convert: {
                input: "$userId",
                to: "objectId",
                onError: null,
                onNull: null,
              },
            },
            roleObjId: {
              $convert: {
                input: "$roleId",
                to: "objectId",
                onError: null,
                onNull: null,
              },
            },
          },
        },
        {
          $lookup: {
            from: "users",
            localField: "userObjId",
            foreignField: "_id",
            as: "user",
          },
        },
        {
          $unwind: "$user",
        },
        {
          $project: {
            workspaceId: 1,
            userId: 1,
            roleId: 1,
            isRemoved: 1,
            invitedByUserId: 1,
            joinedAt: 1,
            roleObjId: 1,

            user: {
              _id: "$user._id",
              name: "$user.name",
              email: "$user.email",
              avatarUrl: "$user.avatarUrl",
              isVerified: "$user.isVerified",
            },
          },
        },
        {
          $lookup: {
            from: "workspaceroles",
            localField: "roleObjId",
            foreignField: "_id",
            as: "role",
          },
        },
        {
          $unwind: "$role",
        },
        {
          $project: {
            workspaceId: 1,
            userId: 1,
            roleId: 1,
            isRemoved: 1,
            invitedByUserId: 1,
            joinedAt: 1,

            user: {
              _id: "$user._id",
              name: "$user.name",
              email: "$user.email",
              avatarUrl: "$user.avatarUrl",
              isVerified: "$user.isVerified",
            },

            role: {
              _id: "$role._id",
              workspaceId: "$role.workspaceId",
              key: "$role.key",
              name: "$role.name",
            },
          },
        },
      ]);

      return data;
    } catch (error) {
      logError(error, {
        service: "WorkspaceMemberRepository.listMembers",
      });
      throw new CustomError(
        "Failed to get workspace members",
        STATUS_CODES.INTERNAL_SERVER_ERROR
      );
    }
  }

  async listUserWorkspace(userId: string): Promise<IUserWorkspace[] | []> {
    try {
      const workspaces = await WorkspaceMember.aggregate([
        {
          $match: {
            userId,
            isRemoved: false,
          },
        },
        {
          $addFields: {
            workspaceObjId: {
              $toObjectId: "$workspaceId",
            },
          },
        },
        {
          $lookup: {
            from: "workspaces",
            localField: "workspaceObjId",
            foreignField: "_id",
            as: "workspace",
          },
        },
        {
          $unwind: "$workspace",
        },
        {
          $project: {
            _id: 0,
            id: {
              $toString: "$workspace._id",
            },
            name: "$workspace.name",
            slug: "$workspace.slug",
            isActive: {
              $literal: true,
            },
          },
        },
      ]);

      return workspaces;
    } catch (error) {
      logError(error, {
        service: "WorkspaceMemberRepository.listUserWorkspace",
      });
      throw new CustomError(
        "Failed to get user workspaces",
        STATUS_CODES.INTERNAL_SERVER_ERROR
      );
    }
  }
}
