import { WorkspaceInviteStatus } from "../../models/WorkspaceInvite";

export interface IListInvitesDto {
  workspaceId: string;
  search?: string;
  limit: number;
  page: number;
}

export interface IListInvitesDetails {
  id: string;
  workspaceId: string;
  email: string;
  roleId: string;
  invitedByUserId: string;
  status: WorkspaceInviteStatus;
  sentAt: Date;
  expiresAt: Date;
  acceptedAt?: Date;
  acceptedByUserId?: string;
  revokedAt?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IListInvitesResDto {
  invites: IListInvitesDetails[] | [];
  totalCount: number;
}

export interface ISendInviteDto {
  workspaceId: string;
  email: string;
  roleId: string;
  invitedByUserId: string;
}

export interface IResendInviteDto {
  inviteId: string;
  workspaceId: string;
}

export interface IRevokeInviteDto {
  inviteId: string;
  workspaceId: string;
}

export interface IValidateInviteDto {
  inviteToken: string;
}

export interface IAcceptInviteDto {
  inviteToken: string;
  userId: string;
}

export interface IAcceptInviteResDto {
  workspaceSlug: string;
}

export interface IValidateInviteResDto {
  workspaceName: string;
  workspaceSlug: string;
  email: string;
}
