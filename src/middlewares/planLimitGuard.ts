import { NextFunction, Request, Response } from "express"
import { container } from "tsyringe"
import { Token } from "../di/token"
import { ISubscriptionRepository } from "../repositories/subscription/interface/ISubscriptionRepository"
import { IPlanRepository } from "../repositories/plan/interfaces/IPlanRepository"
import { IWorkspaceRepository } from "../repositories/workspace/interface/IWorkspaceRepository"
import { CustomError } from "../errors/CustomError"
import { STATUS_CODES } from "../constants/statusCodes"
import { IWorkspaceMemberRepository } from "../repositories/workspace/interface/IWorkspaceMemberRepository"
import { IWorkspaceRoleRepository } from "../repositories/workspace/interface/IWorkspaceRoleRepository"
import { extractStringParams } from "../helper/stringParamUtils"
import { extractStringQueryParams } from "../helper/queryParamUtils"

type LimitType = 'members' | 'customRoles' | 'projects' | 'teams' | 'storageBytes'

export const checkPlanLimit = (limitType: LimitType) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            const _workspaceRepository = container.resolve<IWorkspaceRepository>(Token.WorkspaceRepository)
            const _subscriptionRepository = container.resolve<ISubscriptionRepository>(Token.SubscriptionRepository)
            const _planRepository = container.resolve<IPlanRepository>(Token.PlanRepository)

            const params = extractStringQueryParams(req.params, ["workspaceId", "slug"])
            const workspaceId = params?.workspaceId
            const slug = params?.slug

            let workspace;
            if (workspaceId) {
                workspace = await _workspaceRepository.findById(workspaceId);
            } else if (slug) {
                workspace = await _workspaceRepository.findOne({ slug });
            } else {
                throw new CustomError("Workspace identifier is required", STATUS_CODES.BAD_REQUEST);
            }

            if (!workspace) {
                throw new CustomError("Workspace not found", STATUS_CODES.BAD_REQUEST);
            }

            const subscription = await _subscriptionRepository.findOne({
                workspaceId: String(workspace._id),
                status: "active"
            })

            if (!subscription) {
                throw new CustomError("No active subscription", STATUS_CODES.BAD_REQUEST)
            }

            const plan = await _planRepository.findById(subscription.planId)

            if (!plan) {
                throw new CustomError("Plan not found", STATUS_CODES.BAD_REQUEST)
            }

            const limits = plan.limits

            if (limitType == 'members') {
                const memberRepo = container.resolve<IWorkspaceMemberRepository>(Token.WorkspaceMemberRepository)

                const count = await memberRepo.count({
                    workspaceId: String(workspace._id),
                    isRemoved: false
                })

                if (limits.members === -1) return next()

                if (count >= limits.members) {
                    throw new CustomError("Members limit reached. Upgrade your plan", STATUS_CODES.FORBIDDEN)
                }
                return next()
            }

            if (limitType == "customRoles") {

                const roleRepo = container.resolve<IWorkspaceRoleRepository>(Token.WorkspaceRoleRepository)

                const count = await roleRepo.count({
                    workspaceId: String(workspace._id),
                    isEditable: true,
                    isDeleted: false
                })

                if (limits.customRoles == -1) return next()

                if (count >= limits.customRoles) {
                    throw new CustomError("Custom role limit reached", STATUS_CODES.FORBIDDEN)
                }

                return next()

            }


            next()


        } catch (error) {
            next(error)
        }
    }
}