import { Types } from "mongoose";
import { injectable } from "tsyringe";
import {
  IGetProjectByIdDto,
  IGetProjectResDto,
  IGetProjectsDto,
  IGetProjectsResDto,
  IProjectRepository,
} from "./interface/IProjectRepository";
import { BaseRepository } from "../base/BaseRepository";
import { IProject, project } from "../../models/Project";
import { logError } from "../../middlewares/loggerHelper";

@injectable()
export class ProjectRepository
  extends BaseRepository<IProject>
  implements IProjectRepository
{
  constructor() {
    super(project);
  }

  async getProjects(data: IGetProjectsDto): Promise<IGetProjectsResDto> {
    try {
      const { search, filter, status, skip, limit, workspaceId } = data;

      const pipeline = [];

      if (workspaceId) {
        pipeline.push({
          $match: {
            workspaceId,
          },
        });
      }

      if (search) {
        pipeline.push({
          $match: {
            $or: [
              { name: { $regex: search.trim(), $options: "i" } },
              { key: { $regex: search.trim(), $options: "i" } },
              { description: { $regex: search.trim(), $options: "i" } },
            ],
          },
        });
      }

      if (filter) {
        pipeline.push({
          $match: {
            priority: filter,
          },
        });
      }

      if (status) {
        pipeline.push({
          $match: {
            status,
          },
        });
      }

      pipeline.push({
        $lookup: {
          from: "issues",
          let: {
            projectIdStr: { $toString: "$_id" },
          },
          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: ["$projectId", "$$projectIdStr"],
                },
              },
            },
            {
              $group: {
                _id: null,
                totalTasks: { $sum: 1 },
                doneTasks: {
                  $sum: {
                    $cond: [
                      {
                        $eq: ["$status", "done"],
                      },
                      1,
                      0,
                    ],
                  },
                },
              },
            },
          ],
          as: "taskStats",
        },
      });

      pipeline.push({
        $unwind: {
          path: "$taskStats",
          preserveNullAndEmptyArrays: true,
        },
      });

      pipeline.push({
        $project: {
          name: 1,
          key: 1,
          description: 1,
          status: 1,
          priority: 1,
          dueDate: 1,
          teams: 1,
          createdAt: 1,
          updatedAt: 1,
          taskStats: 1,
          totalTasks: {
            $ifNull: ["$taskStats.totalTasks", 0],
          },
          doneTasks: {
            $ifNull: ["$taskStats.doneTasks", 0],
          },
        },
      });

      pipeline.push({
        $facet: {
          projects: [
            {
              $skip: skip,
            },
            {
              $limit: limit,
            },
          ],
          totalCount: [
            {
              $count: "count",
            },
          ],
          activeProjects: [
            {
              $match: {
                status: "active",
              },
            },
            {
              $count: "count",
            },
          ],
          totalTasks: [
            { $group: { _id: null, count: { $sum: "$totalTasks" } } },
          ],
          doneTasks: [{ $group: { _id: null, count: { $sum: "$doneTasks" } } }],
        },
      });

      const [result] = await this._model.aggregate(pipeline);

      console.log(result);
      return {
        projects: result.projects,
        totalCount: result.totalCount[0]?.count || 0,
        activeProjects: result.activeProjects[0]?.count || 0,
        totalTasks: result.totalTasks[0]?.count || 0,
        doneTasks: result.doneTasks[0]?.count || 0,
      };
    } catch (error) {
      logError(error, {
        service: "ProjectRepository.getProjects",
      });
      throw error;
    }
  }

  async getProjectById(data: IGetProjectByIdDto): Promise<IGetProjectResDto> {
    try {
      const { workspaceId, projectId } = data;

      const pipeline = [];

      pipeline.push({
        $match: {
          workspaceId,
          _id: new Types.ObjectId(projectId),
        },
      });

      pipeline.push({
        $lookup: {
          from: "issues",
          let: {
            projectIdStr: { $toString: "$_id" },
          },
          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: ["$projectId", "$$projectIdStr"],
                },
              },
            },
            {
              $group: {
                _id: null,
                totalTasks: { $sum: 1 },
                doneTasks: {
                  $sum: {
                    $cond: [
                      {
                        $eq: ["$status", "done"],
                      },
                      1,
                      0,
                    ],
                  },
                },
                inProgressTasks: {
                  $sum: {
                    $cond: [
                      {
                        $eq: ["$status", "in-progress"],
                      },
                      1,
                      0,
                    ],
                  },
                },
                toDoTasks: {
                  $sum: {
                    $cond: [
                      {
                        $eq: ["$status", "to-do"],
                      },
                      1,
                      0,
                    ],
                  },
                },
                inReviewTasks: {
                  $sum: {
                    $cond: [
                      {
                        $eq: ["$status", "in-review"],
                      },
                      1,
                      0,
                    ],
                  },
                },
                totalStoryPoints: {
                  $sum: "$storyPoints",
                },
                doneStoryPoints: {
                  $sum: {
                    $cond: [
                      {
                        $eq: ["$status", "done"],
                      },
                      "$storyPoints",
                      0,
                    ],
                  },
                },
              },
            },
          ],
          as: "taskStats",
        },
      });

      pipeline.push({
        $unwind: {
          path: "$taskStats",
          preserveNullAndEmptyArrays: true,
        },
      });

      pipeline.push({
        $project: {
          name: 1,
          key: 1,
          description: 1,
          status: 1,
          priority: 1,
          dueDate: 1,
          teams: 1,
          createdAt: 1,
          updatedAt: 1,
          taskStats: 1,
          totalTasks: {
            $ifNull: ["$taskStats.totalTasks", 0],
          },
          doneTasks: {
            $ifNull: ["$taskStats.doneTasks", 0],
          },
          inProgressTasks: {
            $ifNull: ["$taskStats.inProgressTasks", 0],
          },
          toDoTasks: {
            $ifNull: ["$taskStats.toDoTasks", 0],
          },
          inReviewTasks: {
            $ifNull: ["$taskStats.inReviewTasks", 0],
          },
          totalStoryPoints: {
            $ifNull: ["$taskStats.totalStoryPoints", 0],
          },
          doneStoryPoints: {
            $ifNull: ["$taskStats.doneStoryPoints", 0],
          },
        },
      });

      const project = await this._model.aggregate(pipeline);
      return project[0];
    } catch (error) {
      logError(error, {
        service: "ProjectRepository.getProjectById",
      });
      throw error;
    }
  }
}
