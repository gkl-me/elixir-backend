import { inject, injectable } from "tsyringe";
import { IWorkspaceService } from "./interface/IWorkspaceService";
import { Token } from "../../di/token";
import { IWorkspaceRepository } from "../../repositories/workspace/interface/IWorkspaceRepository";
import { IWorkspace } from "../../models/Workspace";
import { builtInRoles } from "../../constants/builtInRoles";
import { IWorkspaceRoleRepository } from "../../repositories/workspace/interface/IWorkspaceRoleRepository";
import { ISubscriptionRepository } from "../../repositories/subscription/interface/ISubscriptionRepository";

@injectable()
export class WorkspaceService implements IWorkspaceService {
  constructor(
    @inject(Token.WorkspaceRepository)
    private readonly _workspaceRepository: IWorkspaceRepository,
    @inject(Token.WorkspaceRoleRepository)
    private readonly _workspaceRoleRepository: IWorkspaceRoleRepository,
    @inject(Token.SubscriptionRepository)
    private readonly _subscriptionRepository: ISubscriptionRepository,
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

      workspace.subscriptionId = String(subscription._id);
      await workspace.save();
    } catch (error) {
      throw error;
    }
  }
}
