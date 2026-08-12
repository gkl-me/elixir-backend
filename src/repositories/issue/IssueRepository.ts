import { injectable } from "tsyringe";
import { IIssue, issue } from "../../models/Issue";
import { BaseRepository } from "../base/BaseRepository";
import {
  IGetBacklogsDto,
  IGetBacklogsResDto,
  IIssueRepository,
} from "./interface/IIssueRepository";
import { logError } from "../../middlewares/loggerHelper";

@injectable()
export class IssueRepository
  extends BaseRepository<IIssue>
  implements IIssueRepository
{
  constructor() {
    super(issue);
  }

  async getBacklogs(data: IGetBacklogsDto): Promise<IGetBacklogsResDto> {
    try {
      const { search, type, status, workspaceId, projectId } = data;

      const pipeline = [];

      pipeline.push({
        $match: {
          workspaceId: String(workspaceId),
          projectId: String(projectId),
          $or: [
            { sprintId: { $exists: false } },
            { sprintId: null },
            { sprintId: "" },
          ],
        },
      });

      if (search) {
        pipeline.push({
          $match: {
            $or: [
              { title: { $regex: search.trim(), $options: "i" } },
              { key: { $regex: search.trim(), $options: "i" } },
              { description: { $regex: search.trim(), $options: "i" } },
            ],
          },
        });
      }

      if (type) {
        pipeline.push({
          $match: {
            type,
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
        $project: {
          _id: 1,
          title: 1,
          key: 1,
          description: 1,
          type: 1,
          storyPoints: 1,
          priority: 1,
          status: 1,
          assignee: 1,
          reporter: 1,
          projectId: 1,
          workspaceId: 1,
          sprintId: 1,
          labels: 1,
          createdAt: 1,
          updatedAt: 1,
        },
      });

      pipeline.push({
        $facet: {
          issues: [
            {
              $sort: {
                createdAt: -1 as const,
              },
            },
          ],
          totalCount: [
            {
              $count: "count",
            },
          ],
          stories: [
            {
              $match: {
                type: "story",
              },
            },
            {
              $count: "count",
            },
          ],
          bugs: [
            {
              $match: {
                type: "bug",
              },
            },
            {
              $count: "count",
            },
          ],
          totalStoryPoint: [
            {
              $group: {
                _id: null,
                totalStoryPoint: { $sum: "$storyPoints" },
              },
            },
          ],
        },
      });

      const [result] = await this._model.aggregate(pipeline);
      return {
        issues: result?.issues || [],
        totalCount: result?.totalCount[0]?.count || 0,
        stories: result?.stories[0]?.count || 0,
        bugs: result?.bugs[0]?.count || 0,
        totalStoryPoint: result?.totalStoryPoint[0]?.totalStoryPoint || 0,
      };
    } catch (error) {
      logError(error, {
        service: "IssueRepository.getBacklogs",
      });
      throw error;
    }
  }
}
