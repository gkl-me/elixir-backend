import { injectable } from "tsyringe";
import {
  IWorkspaceMember,
  WorkspaceMember,
} from "../../models/WorkspaceMember";
import { BaseRepository } from "../base/BaseRepository";
import { IWorkspaceMemberRepository, IWorkspaceMemberWithUser } from "./interface/IWorkspaceMemberRepository";
import { CustomError } from "../../errors/CustomError";
import { STATUS_CODES } from "../../constants/statusCodes";

@injectable()
export class WorkspaceMemberRepository
  extends BaseRepository<IWorkspaceMember>
  implements IWorkspaceMemberRepository {
  constructor() {
    super(WorkspaceMember);
  }

  async listMembers(workspaceId: string): Promise<IWorkspaceMemberWithUser[] | []> {
    try {


      const data = await this._model.aggregate([
        {
          $match: {
            workspaceId: workspaceId,
            isRemoved: false
          }
        },
        {
          $addFields: {
            userObjId: {
              $convert: {
                input: "$userId",
                to: "objectId",
                onError: null,
                onNull: null
              }
            },
            roleObjId: {
              $convert: {
                input: "$roleId",
                to: "objectId",
                onError: null,
                onNull: null
              }
            }
          }
        },
        {
          $lookup: {
            from: 'users',
            localField: "userObjId",
            foreignField: "_id",
            as: "user"
          }
        },
        {
          $unwind: "$user"
        }, {
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
        }, {
          $lookup: {
            from: 'workspaceroles',
            localField: "roleObjId",
            foreignField: "_id",
            as: "role"
          }
        }, {
          $unwind: "$role"
        }, {
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
        }
      ])

      return data;

    } catch (error) {
      throw new CustomError("Failed to get workspace members", STATUS_CODES.INTERNAL_SERVER_ERROR)
    }
  }
}
