import { IUserWorkspace } from "../../repositories/workspace/interface/IWorkspaceMemberRepository";

export interface ICreateWorkspaceDto {
  name: string;
  ownerId: string;
  companyId?: string;
  subscriptionId?: string;
}

export interface IWorkpsaceContextDto {
  userId: string;
  slug: string;
}

export interface IWorkspaceContextResDto {
  name: string;
  email: string;
  avatarUrl: string;
  workspaceId: string;
  workspaceName: string;
  workspaceSlug: string;
  isOwner: boolean;
  hasOwnWorkspace: boolean;
  memberId: string;
  roleId: string;
  roleKey: string;
  permissions: string[];
  allPermissions: string[];
  permissionDependencies: Record<string, string[]>;
  builtinRoles: Record<string, string[]>;
  workspaces: IUserWorkspace[] | [];
}
