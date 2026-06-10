import { inject, injectable } from "tsyringe";
import { IWorkspaceService } from "./interface/IWorkspaceService";
import { Token } from "../../di/token";
import { IWorkspaceRepository } from "../../repositories/workspace/interface/IWorkspaceRepository";
import { IWorkspace } from "../../models/Workspace";
import { builtInRoles } from "../../constants/builtInRoles";
import { IWorkspaceRoleRepository } from "../../repositories/workspace/interface/IWorkspaceRoleRepository";
import { ISubscriptionRepository } from "../../repositories/subscription/interface/ISubscriptionRepository";
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
  IWorkpsaceContextDto,
  IWorkspaceContextResDto,
} from "../../interfaces/dtos/WorkspaceDto";
import {
  WORKSPACE_PERMISSIONS,
  PERMISSION_DEPENDENCIES,
  BUILTIN_ROLES,
} from "../../constants/workspacePermissions";

@injectable()
export class WorkspaceService implements IWorkspaceService {
  constructor(
    @inject(Token.WorkspaceRepository)
    private readonly _workspaceRepository: IWorkspaceRepository,
    @inject(Token.WorkspaceRoleRepository)
    private readonly _workspaceRoleRepository: IWorkspaceRoleRepository,
    @inject(Token.SubscriptionRepository)
    private readonly _subscriptionRepository: ISubscriptionRepository,
    @inject(Token.WorkspaceMemberRepository)
    private readonly _workspaceMemberRepository: IWorkspaceMemberRepository,
    @inject(Token.UserRepository)
    private readonly _userRepository: IUserRepository
  ) { }

  async createWorkspace({
    name,
    ownerId,
    companyId,
    subscriptionId,
  }: {
    name: string;
    ownerId: string;
    companyId?: string;
    subscriptionId?: string;
  }): Promise<IWorkspace> {
    try {
      const workspace = await this._workspaceRepository.create({
        name,
        ownerId,
        companyId,
        subscriptionId,
        slug: generateSlug(name),
        type: companyId ? "company" : "personal",
      });

      return workspace;
    } catch (error) {
      throw error;
    }
  }

  async bootStrapWorkspace(data: {
    ownerId: string;
    workspaceName: string;
    planId: string;
    companyId?: string;
    stripePriceId?: string;
    stripeSubscriptionId?: string;
  }): Promise<IWorkspace> {
    try {
      const workspace = await this.createWorkspace({
        name: data.workspaceName,
        ownerId: data.ownerId,
        companyId: data.companyId,
      });

      const roles = builtInRoles(String(workspace._id), data.ownerId);

      const workspaceRoles =
        await this._workspaceRoleRepository.createMany(roles);

      const subscription = await this._subscriptionRepository.create({
        workspaceId: String(workspace._id),
        userId: data.ownerId,
        planId: data.planId,
        stripePriceId: data.stripePriceId,
        stripeSubscriptionId: data.stripeSubscriptionId,
        status: "active",
        currentPeriodStart: new Date(),
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

      workspace.subscriptionId = String(subscription._id);
      await workspace.save();

      return workspace;
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

      const workspaces = await this._workspaceMemberRepository.listUserWorkspace(userId);

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
        workspaces
      };
    } catch (error) {
      logError(error, {
        service: "WorkspaceService.workspaceContext",
      });
      throw error;
    }
  }
}
