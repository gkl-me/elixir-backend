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
}
