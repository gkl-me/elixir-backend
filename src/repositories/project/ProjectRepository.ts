import { injectable } from "tsyringe";
import { IGetProjectsDto, IGetProjectsResDto, IProjectRepository } from "./interface/IProjectRepository";
import { BaseRepository } from "../base/BaseRepository";
import { IProject, project } from "../../models/Project";
import { logError } from "../../middlewares/loggerHelper";



@injectable()
export class ProjectRepository extends BaseRepository<IProject> implements IProjectRepository {
    constructor() {
        super(project)
    }

    async getProjects(data: IGetProjectsDto): Promise<IGetProjectsResDto> {
        try {

            const { search, filter, status, skip, limit, workspaceId } = data

            const pipeline = []

            if (workspaceId) {
                pipeline.push({
                    $match: {
                        workspaceId
                    }
                })
            }

            if (search) {
                pipeline.push({
                    $match: {
                        $or: [
                            { name: { $regex: search.trim(), $options: "i" } },
                            { key: { $regex: search.trim(), $options: "i" } },
                            { description: { $regex: search.trim(), $options: "i" } },
                        ]
                    }
                })
            }

            if (filter) {
                pipeline.push({
                    $match: {
                        priority: filter
                    }
                })
            }

            if (status) {
                pipeline.push({
                    $match: {
                        status
                    }
                })
            }


            pipeline.push({
                $facet: {
                    projects: [
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
                    ],
                    activeProjects: [
                        {
                            $match: {
                                status: "active"
                            },
                        },
                        {
                            $count: "count"
                        }

                    ]
                }
            })


            const [result] = await this._model.aggregate(pipeline)
            return {
                projects: result.projects,
                totalCount: result.totalCount[0]?.count,
                activeProjects: result.activeProjects[0]?.count
            }


        } catch (error) {
            logError(error, {
                service: "ProjectRepository.getProjects"
            })
            throw error
        }
    }
}