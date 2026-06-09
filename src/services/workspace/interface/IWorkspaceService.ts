import { IWorkpsaceContextDto, IWorkspaceContextResDto } from "../../../interfaces/dtos/WorkspaceDto";
import { IWorkspace } from "../../../models/Workspace";

export interface IWorkspaceService {
  createWorkspace({
    name,
    ownerId,
    companyId,
    subscriptionId,
  }: {
    name: string;
    ownerId: string;
    companyId?: string;
    subscriptionId?: string;
  }): Promise<IWorkspace>;
  bootStrapWorkspace(data: {
    ownerId: string;
    workspaceName: string;
    planId: string;
    companyId?: string;
    stripePriceId?: string;
    stripeSubscriptionId?: string;
  }): Promise<IWorkspace>;
  workspaceContext(data: IWorkpsaceContextDto): Promise<IWorkspaceContextResDto>;
}
