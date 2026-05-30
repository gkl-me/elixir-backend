import { inject, injectable } from "tsyringe";
import { IWorkspaceService } from "./interface/IWorkspaceService";
import { Token } from "../../di/token";
import { IWorkspaceRepository } from "../../repositories/workspace/interface/IWorkspaceRepository";
import { IWorkspace } from "../../models/Workspace";
import { builtInRoles } from "../../constants/builtInRoles";
import { IWorkspaceRoleRepository } from "../../repositories/workspace/interface/IWorkspaceRoleRepository";
import { ISubscriptionRepository } from "../../repositories/subscription/interface/ISubscriptionRepository";
import { logError } from "../../middlewares/loggerHelper";
import { CustomError } from "../../errors/CustomError";
import { CONSTANT_MESSAGES } from "../../constants/messages";
import { STATUS_CODES } from "../../constants/statusCodes";
import { IWorkspaceMemberRepository } from "../../repositories/workspace/interface/IWorkspaceMemberRepository";
import { IUserRepository } from "../../repositories/user/interfaces/IUserRepository";

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
  ) {}

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
  }) {
    try {
      const workspace = await this.createWorkspace({
        name: data.workspaceName,
        ownerId: data.ownerId,
        companyId: data.companyId,
      });

      const roles = builtInRoles(String(workspace._id), data.ownerId);

      const workspaceRoles = await this._workspaceRoleRepository.createMany(roles);

      const subscription = await this._subscriptionRepository.create({
        workspaceId: String(workspace._id),
        userId: data.ownerId,
        planId: data.planId,
        stripePriceId: data.stripePriceId,
        stripeSubscriptionId: data.stripeSubscriptionId,
        status: "active",
        currentPeriodStart: new Date(),
      });

      const roleId = workspaceRoles.find(role => role.name === "Owner")?._id

      const workspaceMember = await this._workspaceMemberRepository.create({
        workspaceId: String(workspace._id),
        userId: data.ownerId,
        roleId: String(roleId),
        isRemoved: false,
        invitedByUserId: data.ownerId,
        joinedAt: new Date(),
      })

      workspace.subscriptionId = String(subscription._id);
      await workspace.save();
    } catch (error) {
      throw error;
    }
  }


  async workspaceContext(data: { userId: string }): Promise<{ workspaceId: string; memberId: string; roleId: string; name: string; email: string; }> {
    try {


      const {userId} = data;

      console.log("User ID in workspaceContext:", userId); // Debug log to check userId

      const workspace = await this._workspaceRepository.findOne({ownerId: userId})
      const user = await this._userRepository.findById(userId)

      console.log("Workspace found:", workspace); // Debug log to check workspace
      console.log("User found:", user); // Debug log to check user

      if(!user) {
        throw new CustomError(CONSTANT_MESSAGES.NOT_FOUND,STATUS_CODES.NOT_FOUND)
      }

      if(!workspace) {
        throw new CustomError(CONSTANT_MESSAGES.NOT_FOUND,STATUS_CODES.NOT_FOUND)
      }

      const member = await this._workspaceMemberRepository.findOne({workspaceId:workspace._id, userId, isRemoved:false})
      console.log("Workspace member found:", member); // Debug log to check workspace member

      if(!member) {
        throw new CustomError(CONSTANT_MESSAGES.NOT_FOUND,STATUS_CODES.NOT_FOUND)
      }

      const role = await this._workspaceRoleRepository.findById(member.roleId)
      console.log("Workspace role found:", role); // Debug log to check workspace role

      return {
        workspaceId: String(workspace._id),
        memberId: String(member._id),
        roleId: String(role?._id),
        name: user.name,
        email: user.email,
      }

    } catch (error) {
     logError(error,{
      service:"WorkspaceService.workspaceContext"
     }) 
     throw error;
    }
  }
}
