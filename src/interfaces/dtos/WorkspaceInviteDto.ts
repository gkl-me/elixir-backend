import { WorkspaceInviteStatus } from "../../models/WorkspaceInvite";

export interface IListInvitesDto {
    workspaceId: string,
}

export interface IListInvitesResDto {
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

export interface ISendInviteDto {
    workspaceId: string,
    email: string,
    roleId: string,
    invitedByUserId: string
}

export interface IResendInviteDto {
    inviteId: string,
    workspaceId: string
}

export interface IRevokeInviteDto {
    inviteId: string,
    workspaceId: string
}

export interface IValidateInviteDto {
    inviteToken: string,
}

export interface IAcceptInviteDto {
    inviteToken: string,
    userId: string,
}

export interface IAcceptInviteResDto {
    workspaceSlug: string
}

export interface IValidateInviteResDto {
    workspaceName: string,
    workspaceSlug: string,
    email: string
}


