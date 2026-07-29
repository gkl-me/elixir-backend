import { injectable } from "tsyringe";
import { BaseRepository } from "../base/BaseRepository";
import { ISubscription, Subscription } from "../../models/Subscription";
import { IGetAllSubscription, IGetAllSubscriptionRes, ISubscriptionRepository } from "./interface/ISubscriptionRepository";
import { logError } from "../../middlewares/loggerHelper";

@injectable()
export class SubscriptionRepository
  extends BaseRepository<ISubscription>
  implements ISubscriptionRepository {
  constructor() {
    super(Subscription);
  }

  async getAllSubscriptions(data: IGetAllSubscription): Promise<IGetAllSubscriptionRes> {
    try {

      const { search, status, skip, limit, plan } = data

      const pipeline = []

      if (status) {
        pipeline.push({
          $match: {
            status: status
          }
        })
      }

      if (plan) {
        pipeline.push({
          $match: {
            planType: plan
          }
        })
      }

      //lookup for owner email 

      pipeline.push(


        {
          $lookup: {
            from: "users",
            let: {
              userId: {
                $toObjectId: "$userId"
              }
            },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $eq: [
                      '$_id',
                      '$$userId'
                    ]
                  }
                }
              },
              {
                $project: {
                  _id: 0,
                  email: 1
                }
              }
            ],
            as: "ownerEmail"
          }
        },

        //unwind ownerEmail
        {
          $unwind: {
            path: '$ownerEmail',
            preserveNullAndEmptyArrays: true
          }
        },

        //lookup for workspace name

        {
          $lookup: {
            from: "workspaces",
            let: {
              workspaceId: {
                $toObjectId: "$workspaceId"
              }
            },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $eq: [
                      '$_id',
                      '$$workspaceId'
                    ]
                  }
                }
              },
              {
                $project: {
                  _id: 0,
                  name: 1
                }
              }
            ],
            as: "workspaceName"
          }
        },

        //unwind workspaceName

        {
          $unwind: {
            path: '$workspaceName',
            preserveNullAndEmptyArrays: true
          }
        },

        //project the details

        {
          $project: {
            _id: 1,
            workspaceName: "$workspaceName.name",
            ownerEmail: "$ownerEmail.email",
            planType: 1,
            status: 1,
            price: 1,
            currentPeriodEnd: 1,
            currentPeriodStart: 1,
            cancelAtPeriodEnd: 1,
            createdAt: 1
          }
        }
      )

      if (search) {
        pipeline.push({
          $match: {
            $or: [
              {
                workspaceName: {
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

      // add facet
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
        subscriptions: result.data,
        totalCount: result.totalCount[0]?.count || 0,
      }

    } catch (error) {
      logError(error, {
        service: "SubscriptionRepostiory.getAllSubscriptions"
      })
      throw error
    }
  }
}
