import { PlanType } from "../../models/Plan";
import { WorkspaceType } from "../../models/Workspace";
import { IUserWorkspace } from "../../repositories/workspace/interface/IWorkspaceMemberRepository";

export interface ICreateWorkspaceDto {
  name: string;
  ownerId: string;
  companyId?: string;
  subscriptionId?: string;
  planId: string
}

export interface IWorkspaceResDto {
  id: string
  name: string;
  slug: string;
  type: WorkspaceType;
  ownerId: string;
  companyId?: string;
  subscriptionId?: string;
  status: 'active' | 'suspended';
  planId: string,
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IWorkspaceBootstrapDto {
  ownerId: string;
  workspaceName: string;
  planId: string;
  companyId?: string;
  stripePriceId?: string;
  stripeSubscriptionId?: string;
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



export interface IWorkspaceLimitsDto {
  workspaceId: string
}

export interface IWorksapceLimitsResDto {
  limits: {
    projects: number,
    members: number,
    teams: number,
    customRoles: number,
    storageBytes: number
  },
  used: {
    projects: number,
    members: number,
    teams: number,
    customRoles: number,
    storageBytes: number
  },
}

export interface IListAllWorkspaceDto {
  search?: string,
  page: number,
  limit: number
  status: string
}

export interface IListAllWorkspaceResponseDto {
  id: string,
  name: string,
  ownerEmail: string,
  totalUsers: number,
  status: string,
  planType: PlanType,
  createdAt?: Date,
}

export interface IListAllWorkspaceResDto {
  workspaces: IListAllWorkspaceResponseDto[] | [],
  totalCount: number
}


export interface IToggleWorkspaceStatusDto {
  workspaceId: string
}