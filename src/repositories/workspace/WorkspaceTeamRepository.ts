import { injectable } from "tsyringe";
import { PipelineStage, Types } from "mongoose";
import { BaseRepository } from "../base/BaseRepository";
import { IWorkspaceTeam, WorkspaceTeam } from "../../models/WorkspaceTeam";
import {
  IMembersResDto,
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
  implements IWorkspaceTeamRepository {
  constructor() {
    super(WorkspaceTeam);
  }

  async listTeams(
    workspaceId: string,
    limit: number,
    skip: number,
    search?: string
  ): Promise<IWorkspaceTeamWithMember[] | []> {
    try {
      const teams = await this._model.aggregate([
        {
          $match: {
            workspaceId,
          },
        },
        {
          $match: {
            $or: [{ name: { $regex: search, $options: "i" } }],
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
        {
          $skip: skip,
        },
        {
          $limit: limit,
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

  async getUniqueMembersByTeamIds(
    workspaceId: string,
    teamIds: string[],
    search?: string
  ): Promise<IMembersResDto[]> {
    try {
      const teamObjIds = teamIds
        .filter((id) => Types.ObjectId.isValid(id))
        .map((id) => new Types.ObjectId(id));

      if (teamObjIds.length === 0) return [];

      const pipeline: PipelineStage[] = [
        {
          $match: {
            workspaceId,
            _id: {
              $in: teamObjIds,
            },
          },
        },
        {
          $unwind: "$memberIds",
        },
        {
          $group: {
            _id: "$memberIds",
          },
        },
        {
          $lookup: {
            from: "workspacemembers",
            let: {
              userIdStr: "$_id",
              wsId: workspaceId,
            },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $and: [
                      { $eq: ["$workspaceId", "$$wsId"] },
                      { $eq: ["$userId", "$$userIdStr"] },
                      { $eq: ["$isRemoved", false] },
                    ],
                  },
                },
              },
            ],
            as: "workspaceMember",
          },
        },
        {
          $unwind: "$workspaceMember",
        },
        {
          $addFields: {
            userObjId: {
              $convert: {
                input: "$_id",
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
        {
          $unwind: "$userDetail",
        },
      ];

      if (search && search.trim() !== "") {
        pipeline.push({
          $match: {
            $or: [
              { "userDetail.name": { $regex: search.trim(), $options: "i" } },
              { "userDetail.email": { $regex: search.trim(), $options: "i" } },
            ],
          },
        });
      }

      pipeline.push({
        $project: {
          _id: 0,
          id: "$_id",
          name: "$userDetail.name",
          email: "$userDetail.email",
          avatarUrl: "$userDetail.avatarUrl",
          role: "$workspaceMember.roleId",
        },
      });

      const members = await this._model.aggregate(pipeline);
      console.log("members", members)
      return members;

    } catch (error) {
      logError(error, {
        service: "WorkspaceTeamRepository.getUniqueMembersByTeamIds",
      });
      throw error;
    }
  }
}
