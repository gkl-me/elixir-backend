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
  }): Promise<void>;
  workspaceContext(data:{}):Promise<{
  workspaceId: string;
  memberId:string,
  roleId:string
  name: string;
  email: string;
  }>
}
