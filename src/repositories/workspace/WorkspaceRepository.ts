import { injectable } from "tsyringe";
import { IWorkspace, Workspace } from "../../models/Workspace";
import { BaseRepository } from "../base/BaseRepository";
import { IGetAllWorkspace, IGetAllWorkspaceDetails, IGetAllWorkspaceRes, IWorkspaceRepository } from "./interface/IWorkspaceRepository";
import { Types } from "mongoose";

@injectable()
export class WorkspaceRepository
  extends BaseRepository<IWorkspace>
  implements IWorkspaceRepository {
  constructor() {
    super(Workspace);
  }

  async getWorkspaceDetails(data: IGetAllWorkspace): Promise<IGetAllWorkspaceRes> {

    const { search, status, skip, limit } = data

    const pipeline = []

    if (status) {
      pipeline.push({
        $match: {
          status: status
        }
      })
    }

    pipeline.push(

      //lookup for owner email

      {
        $lookup: {
          from: 'users',
          let: {
            ownerId: {
              $toObjectId: "$ownerId"
            }
          },
          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: ['$_id', '$$ownerId']
                }
              }
            }, {
              $project: {
                _id: 0,
                email: 1
              }
            }
          ],
          as: "ownerEmail"
        }
      },

      //undwind the owner email
      {
        $unwind: {
          path: '$ownerEmail',
          preserveNullAndEmptyArrays: true
        }
      },


      //plan 

      {
        $lookup: {
          from: 'plans',
          let: {
            planId: { $toObjectId: "$planId" }
          },
          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: ['$_id', '$$planId']
                }
              }
            },
            {
              $project: {
                _id: 0,
                type: 1
              }
            }
          ],
          as: "planType"
        }
      },

      //undwind the plan type
      {
        $unwind: {
          path: "$planType",
          preserveNullAndEmptyArrays: true
        }
      },

      //member count
      {
        $lookup: {
          from: 'workspacemembers',
          let: {
            workspaceId: { $toString: "$_id" }
          },
          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: ["$workspaceId", '$$workspaceId']
                }
              }
            }, {
              $count: "count"
            }
          ],
          as: "totalCount"
        }
      },

      {
        $unwind: {
          path: '$totalCount',
          preserveNullAndEmptyArrays: true
        }
      },

      {
        $addFields: {
          totalCount: { $ifNull: ["$totalCount.count", 0] },
        }
      },

      //project the details
      {
        $project: {
          _id: 1,
          name: 1,
          ownerEmail: "$ownerEmail.email",
          totalUsers: "$totalCount",
          status: 1,
          planType: "$planType.type",
          createdAt: 1
        }
      }

    )


    if (search) {
      pipeline.push({
        $match: {
          $or: [
            {
              name: {
                $regex: search,
                $options: "i"
              }
            },
            {
              ownerEmail: {
                $regex: search,
                $options: "i"
              }
            }
          ]
        }
      })
    }

    pipeline.push({
      $facet: {
        data: [
          {
            $skip: skip
          },
          {
            $limit: limit
          }
        ],
        totalCount: [
          {
            $count: "count"
          }
        ]
      }
    })

    const [result] = await this._model.aggregate(pipeline)
    return {
      workspaces: result.data,
      totalCount: result.totalCount[0]?.count || 0,
    }
  }
}
