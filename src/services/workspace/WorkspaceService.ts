import { inject, injectable } from "tsyringe";
import { IWorkspaceService } from "./interface/IWorkspaceService";
import { Token } from "../../di/token";
import { IWorkspaceRepository } from "../../repositories/workspace/interface/IWorkspaceRepository";
import { IWorkspace } from "../../models/Workspace";
import { builtInRoles } from "../../constants/builtInRoles";
import { IWorkspaceRoleRepository } from "../../repositories/workspace/interface/IWorkspaceRoleRepository";
import { logError } from "../../middlewares/loggerHelper";
import logger from "../../middlewares/logger";
import { CustomError } from "../../errors/CustomError";
import {
  CONSTANT_MESSAGES,
  WORKSPACE_MESSAGES,
} from "../../constants/messages";
import { STATUS_CODES } from "../../constants/statusCodes";
import { IWorkspaceMemberRepository } from "../../repositories/workspace/interface/IWorkspaceMemberRepository";
import { IUserRepository } from "../../repositories/user/interfaces/IUserRepository";
import { generateSlug } from "../../helper/generateSlug";
import {
  ICreateWorkspaceDto,
  IListAllWorkspaceDto,
  IListAllWorkspaceResDto,
  IToggleWorkspaceStatusDto,
  IWorkpsaceContextDto,
  IWorksapceLimitsResDto,
  IWorkspaceBootstrapDto,
  IWorkspaceContextResDto,
  IWorkspaceLimitsDto,
  IWorkspaceResDto,
} from "../../interfaces/dtos/WorkspaceDto";
import {
  WORKSPACE_PERMISSIONS,
  PERMISSION_DEPENDENCIES,
  BUILTIN_ROLES,
} from "../../constants/workspacePermissions";
import { IPlanRepository } from "../../repositories/plan/interfaces/IPlanRepository";
import { IWorkspaceTeamRepository } from "../../repositories/workspace/interface/IWorkspaceTeamRepository";
import { workspaceDtoMapper } from "../../interfaces/mapper/workspaceDtoMapper";
import { ISubscriptionService } from "../subscription/interface/ISubscriptionService";

@injectable()
export class WorkspaceService implements IWorkspaceService {
  constructor(
    @inject(Token.WorkspaceRepository)
    private readonly _workspaceRepository: IWorkspaceRepository,
    @inject(Token.WorkspaceRoleRepository)
    private readonly _workspaceRoleRepository: IWorkspaceRoleRepository,
    @inject(Token.SubscriptionService)
    private readonly _subscriptionService: ISubscriptionService,
    @inject(Token.WorkspaceMemberRepository)
    private readonly _workspaceMemberRepository: IWorkspaceMemberRepository,
    @inject(Token.UserRepository)
    private readonly _userRepository: IUserRepository,
    @inject(Token.PlanRepository)
    private readonly _planRepository: IPlanRepository,
    @inject(Token.WorkspaceTeamRepository)
    private readonly _workspaceTeamRepository: IWorkspaceTeamRepository
  ) { }

  async createWorkspace(data: ICreateWorkspaceDto): Promise<IWorkspace> {
    try {
      const { name, ownerId, companyId, subscriptionId, planId } = data;

      const workspace = await this._workspaceRepository.create({
        name,
        ownerId,
        companyId,
        subscriptionId,
        slug: generateSlug(name),
        type: companyId ? "company" : "personal",
        planId,
      });

      return workspace;
    } catch (error) {
      throw error;
    }
  }

  async bootStrapWorkspace(
    data: IWorkspaceBootstrapDto
  ): Promise<IWorkspaceResDto> {
    try {
      const workspace = await this.createWorkspace({
        name: data.workspaceName,
        ownerId: data.ownerId,
        companyId: data.companyId,
        planId: data.planId,
      });

      const roles = builtInRoles(String(workspace._id), data.ownerId);

      const workspaceRoles =
        await this._workspaceRoleRepository.createMany(roles);

      // const subscription = await this._subscriptionRepository.create({
      //   workspaceId: String(workspace._id),
      //   userId: data.ownerId,
      //   planId: data.planId,
      //   stripePriceId: data.stripePriceId,
      //   stripeSubscriptionId: data.stripeSubscriptionId,
      //   status: "active",
      //   currentPeriodStart: new Date(),
      // });

      const { subscriptionId } =
        await this._subscriptionService.createSubscription({
          workspaceId: String(workspace._id),
          userId: data.ownerId,
          planId: data.planId,
          stripePriceId: data.stripePriceId,
          stripeSubscriptionId: data.stripeSubscriptionId,
          stripeCustomerId: data.stripeCustomerId,
          currentPeriodEnd: data.currentPeriodEnd,
          currentPeriodStart: data.currentPeriodStart,
        });

      const roleId = workspaceRoles.find((role) => role.name === "Owner")?._id;

      await this._workspaceMemberRepository.create({
        workspaceId: String(workspace._id),
        userId: data.ownerId,
        roleId: String(roleId),
        isRemoved: false,
        invitedByUserId: data.ownerId,
        joinedAt: new Date(),
      });

      workspace.subscriptionId = String(subscriptionId);
      await workspace.save();

      return workspaceDtoMapper.toWorkspace(workspace);
    } catch (error) {
      throw error;
    }
  }

  async workspaceContext(
    data: IWorkpsaceContextDto
  ): Promise<IWorkspaceContextResDto> {
    try {
      const { userId, slug } = data;

      let workspace = await this._workspaceRepository.findOne({ slug });
      if (!workspace && slug && slug.match(/^[0-9a-fA-F]{24}$/)) {
        workspace = await this._workspaceRepository.findById(slug);
      }

      if (!workspace) {
        throw new CustomError(
          WORKSPACE_MESSAGES.NOT_FOUND,
          STATUS_CODES.NOT_FOUND
        );
      }

      const member = await this._workspaceMemberRepository.findOne({
        workspaceId: workspace._id,
        userId,
        isRemoved: false,
      });

      if (!member) {
        throw new CustomError(
          CONSTANT_MESSAGES.FORBIDDEN,
          STATUS_CODES.FORBIDDEN
        );
      }

      const role = await this._workspaceRoleRepository.findById(member.roleId);

      const user = await this._userRepository.findById(userId);
      if (!user) {
        logger.warn("WorkspaceService.workspaceContext DEBUG: User not found", {
          userId,
          userIdType: typeof userId,
          slug,
          workspaceId: String(workspace?._id),
          memberId: String(member?._id),
          memberRoleId: String(member?.roleId),
          memberUserId: String(member?.userId),
        });
        throw new CustomError(
          CONSTANT_MESSAGES.BAD_REQUEST,
          STATUS_CODES.BAD_REQUEST
        );
      }

      const hasOwnWorkspace = await this._workspaceRepository.findOne({
        ownerId: userId,
      });

      await this._userRepository.update(userId, {
        lastActiveWorkspaceId: String(workspace._id),
      });

      const workspaces =
        await this._workspaceMemberRepository.listUserWorkspace(userId);

      return {
        name: user?.name,
        email: user?.email,
        avatarUrl: user?.avatarUrl || "",
        workspaceId: String(workspace._id),
        workspaceName: workspace.name,
        workspaceSlug: workspace.slug,
        isOwner: role?.key === "owner",
        hasOwnWorkspace: !!hasOwnWorkspace,
        memberId: String(member._id),
        roleId: String(role?._id),
        roleKey: role?.key || "member",
        permissions: role?.permissions || [],
        allPermissions: Object.values(WORKSPACE_PERMISSIONS),
        permissionDependencies: PERMISSION_DEPENDENCIES as Record<
          string,
          string[]
        >,
        builtinRoles: BUILTIN_ROLES as Record<string, string[]>,
        workspaces,
      };
    } catch (error) {
      logError(error, {
        service: "WorkspaceService.workspaceContext",
      });
      throw error;
    }
  }

  async workspaceLimits(
    data: IWorkspaceLimitsDto
  ): Promise<IWorksapceLimitsResDto> {
    try {
      const { workspaceId } = data;

      const workspace = await this._workspaceRepository.findById(workspaceId);

      if (!workspace || !workspace.planId) {
        throw new CustomError(
          CONSTANT_MESSAGES.BAD_REQUEST,
          STATUS_CODES.BAD_REQUEST
        );
      }

      const workspacePlan = await this._planRepository.findById(
        workspace?.planId
      );

      if (!workspacePlan || !workspacePlan?.limits) {
        throw new CustomError(
          CONSTANT_MESSAGES.BAD_REQUEST,
          STATUS_CODES.BAD_REQUEST
        );
      }

      const limits = workspacePlan.limits;

      //usage

      const [teams, members, customRoles] = await Promise.all([
        this._workspaceTeamRepository.count({ workspaceId }),
        this._workspaceMemberRepository.count({ workspaceId }),
        this._workspaceRoleRepository.count({ workspaceId }),
      ]);

      console.log("teams", teams);

      return {
        limits,
        used: {
          teams,
          members,
          customRoles,
          storageBytes: 0,
          projects: 0,
        },
      };
    } catch (error) {
      logError(error, {
        service: "WorkspaceService.workspaceLimits",
      });
      throw error;
    }
  }

  async listAllWorkspace(
    data: IListAllWorkspaceDto
  ): Promise<IListAllWorkspaceResDto> {
    try {
      const { search, page, limit, status } = data;

      const skip = (page - 1) * limit;

      const { workspaces, totalCount } =
        await this._workspaceRepository.getWorkspaceDetails({
          search,
          status,
          skip,
          limit,
        });

      return {
        workspaces: workspaces.map((workspace) =>
          workspaceDtoMapper.toWorkspaceList(workspace)
        ),
        totalCount,
      };
    } catch (error) {
      logError(error, {
        service: "WorkspaceService.listAllWorkspace",
      });
      throw error;
    }
  }

  async toggleWorkspaceStatus(data: IToggleWorkspaceStatusDto): Promise<void> {
    try {
      const { workspaceId } = data;

      const workspace = await this._workspaceRepository.findById(workspaceId);

      if (!workspace) {
        throw new CustomError(
          WORKSPACE_MESSAGES.NOT_FOUND,
          STATUS_CODES.BAD_REQUEST
        );
      }

      workspace.status = workspace.status === "active" ? "suspended" : "active";
      await workspace.save();
    } catch (error) {
      logError(error, {
        service: "WorkspaceService.toggleWorkspaceStatus",
      });
      throw error;
    }
  }
}
