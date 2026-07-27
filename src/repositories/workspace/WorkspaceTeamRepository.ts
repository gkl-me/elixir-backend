import { injectable } from "tsyringe";
import { Types } from "mongoose";
import { BaseRepository } from "../base/BaseRepository";
import { IWorkspaceTeam, WorkspaceTeam } from "../../models/WorkspaceTeam";
import {
  IWorkspaceTeamRepository,
  IWorkspaceTeamWithMember,
  IWorkspaceTeamWithMemberDetail,
} from "./interface/IWorkspaceTeamRepository";
import { logError } from "../../middlewares/loggerHelper";
import { STATUS_CODES } from "../../constants/statusCodes";
import { CustomError } from "../../errors/CustomError";

@injectable()
export class WorkspaceTeamRepository
  extends BaseRepository<IWorkspaceTeam>
  implements IWorkspaceTeamRepository
{
  constructor() {
    super(WorkspaceTeam);
  }

  async listTeams(
    workspaceId: string
  ): Promise<IWorkspaceTeamWithMember[] | []> {
    try {
      const teams = await this._model.aggregate([
        {
          $match: {
            workspaceId,
          },
        },
        {
          $addFields: {
            memberObjIds: {
              $map: {
                input: "$memberIds",
                as: "id",
                in: {
                  $convert: {
                    input: "$$id",
                    to: "objectId",
                    onError: null,
                    onNull: null,
                  },
                },
              },
            },
          },
        },
        {
          $lookup: {
            from: "users",
            localField: "memberObjIds",
            foreignField: "_id",
            as: "members",
          },
        },
        {
          $project: {
            _id: 1,
            name: 1,
            memberCount: {
              $size: "$members",
            },
            memberName: {
              $map: {
                input: "$members",
                as: "member",
                in: "$$member.name",
              },
            },
          },
        },
      ]);

      return teams;
    } catch (error) {
      logError(error, {
        service: "WorkspaceTeamRepository.listTeams",
      });
      throw new CustomError(
        "Failed to get team list",
        STATUS_CODES.INTERNAL_SERVER_ERROR
      );
    }
  }

  async listTeamMembers(
    workspaceId: string,
    teamId: string
  ): Promise<IWorkspaceTeamWithMemberDetail | null> {
    try {
      const team = await this._model.aggregate([
        {
          $match: {
            workspaceId,
            _id: new Types.ObjectId(teamId),
          },
        },
        {
          $lookup: {
            from: "workspacemembers",
            let: { teamWorkspaceId: "$workspaceId", memberIds: "$memberIds" },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $and: [
                      { $eq: ["$workspaceId", "$$teamWorkspaceId"] },
                      { $in: ["$userId", "$$memberIds"] },
                      { $eq: ["$isRemoved", false] },
                    ],
                  },
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
                  as: "userDetail",
                },
              },
              { $unwind: "$userDetail" },
              {
                $lookup: {
                  from: "workspaceroles",
                  localField: "roleObjId",
                  foreignField: "_id",
                  as: "roleDetail",
                },
              },
              { $unwind: "$roleDetail" },
              {
                $project: {
                  _id: "$userDetail._id",
                  name: "$userDetail.name",
                  email: "$userDetail.email",
                  avatarUrl: "$userDetail.avatarUrl",
                  role: "$roleDetail.name",
                },
              },
            ],
            as: "members",
          },
        },
        {
          $project: {
            _id: 1,
            name: 1,
            description: 1,
            members: 1,
          },
        },
      ]);

      return team.length ? team[0] : null;
    } catch (error) {
      logError(error, {
        service: "WorkspaceTeamRepository.listTeamMembers",
      });
      throw new CustomError(
        "Failed to get team members list",
        STATUS_CODES.INTERNAL_SERVER_ERROR
      );
    }
  }
}
