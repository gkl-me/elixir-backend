import { IWorkspace } from "../../models/Workspace";
import { IWorkspaceInvite } from "../../models/WorkspaceInvite";
import { IWorkspaceRole } from "../../models/WorkspaceRole";
import { IWorkspaceMemberWithUser } from "../../repositories/workspace/interface/IWorkspaceMemberRepository";
import {
  IGetAllWorkspaceDetails,
} from "../../repositories/workspace/interface/IWorkspaceRepository";
import {
  IWorkspaceTeamWithMember,
  IWorkspaceTeamWithMemberDetail,
} from "../../repositories/workspace/interface/IWorkspaceTeamRepository";
import {
  IListAllWorkspaceResponseDto,
  IWorkspaceResDto,
} from "../dtos/WorkspaceDto";
import {
  IListInvitesDetails,
} from "../dtos/WorkspaceInviteDto";
import {
  IListMemberDetils,
} from "../dtos/WorkspaceMemberDto";
import {
  ICreateRoleResDto,
  IGetRolesResDto,
  IUpdateRoleResDto,
} from "../dtos/WorkspaceRoleDto";
import {
  IGetTeamResDto,
  IListTeamsDetails,
} from "../dtos/WorkspaceTeamDto";

export class workspaceRoleDtoMapper {
  static toGetRoles(role: IWorkspaceRole): IGetRolesResDto {
    return {
      id: String(role?._id),
      workspaceId: role?.workspaceId,
      key: role?.key,
      name: role?.name,
      permissions: role?.permissions,
      createdByUserId: role?.createdByUserId,
      isEditable: role?.isEditable,
      isDeletable: role?.isDeletable,
      isDeleted: role?.isDeleted,
      createdAt: role?.createdAt,
      updatedAt: role?.updatedAt,
    };
  }

  static toUpdateRoles(role: IWorkspaceRole): IUpdateRoleResDto {
    return {
      workspaceId: role?.workspaceId,
      key: role?.key,
      name: role?.name,
      permissions: role?.permissions,
      createdByUserId: role?.createdByUserId,
      isEditable: role?.isEditable,
      isDeletable: role?.isDeletable,
      isDeleted: role?.isDeleted,
      createdAt: role?.createdAt,
      updatedAt: role?.updatedAt,
    };
  }

  static toCreateRoles(role: IWorkspaceRole): ICreateRoleResDto {
    return {
      workspaceId: role?.workspaceId,
      key: role?.key,
      name: role?.name,
      permissions: role?.permissions,
      createdByUserId: role?.createdByUserId,
      isEditable: role?.isEditable,
      isDeletable: role?.isDeletable,
      isDeleted: role?.isDeleted,
      createdAt: role?.createdAt,
      updatedAt: role?.updatedAt,
    };
  }
}

export class workspaceInviteDtoMapper {
  static toListInvites(invite: IWorkspaceInvite): IListInvitesDetails {
    return {
      id: String(invite?._id),
      workspaceId: invite?.workspaceId,
      email: invite?.email,
      roleId: invite?.roleId,
      invitedByUserId: invite?.invitedByUserId,
      status: invite?.status,
      sentAt: invite?.sentAt,
      expiresAt: invite?.expiresAt,
      acceptedAt: invite?.acceptedAt,
      revokedAt: invite?.revokedAt,
      createdAt: invite?.createdAt,
      updatedAt: invite?.updatedAt,
    };
  }
}

export class workspaceMemberDtoMapper {
  static toListMembers(member: IWorkspaceMemberWithUser): IListMemberDetils {
    return {
      memberId: member?._id,
      name: member?.user?.name,
      email: member?.user?.email,
      avatarUrl: member?.user?.avatarUrl,
      roleId: member?.roleId,
      roleKey: member?.role?.key,
      joinedAt: member?.joinedAt || new Date(),
      userId: member?.user?._id,
    };
  }
}

export class workspaceTeamDtoMapper {
  static toListTeams(team: IWorkspaceTeamWithMember): IListTeamsDetails {
    return {
      id: String(team?._id),
      name: team?.name,
      memberCount: team?.memberCount,
      memberName: team?.memberName,
    };
  }

  static toGetTeam(team: IWorkspaceTeamWithMemberDetail): IGetTeamResDto {
    return {
      id: String(team?._id),
      name: team?.name,
      description: team?.description,
      members: team?.members.map((member) => ({
        id: String(member?._id),
        name: member?.name,
        email: member?.email,
        avatarUrl: member?.avatarUrl,
        role: member?.role,
      })),
    };
  }
}

export class workspaceDtoMapper {
  static toWorkspace(workspace: IWorkspace): IWorkspaceResDto {
    return {
      id: String(workspace._id),
      name: workspace.name,
      slug: workspace.slug,
      ownerId: workspace.ownerId,
      companyId: workspace.companyId,
      subscriptionId: workspace.subscriptionId,
      planId: workspace.planId,
      type: workspace.type,
      status: workspace.status,
      createdAt: workspace.createdAt,
      updatedAt: workspace.updatedAt,
    };
  }

  static toWorkspaceList(
    workspace: IGetAllWorkspaceDetails
  ): IListAllWorkspaceResponseDto {
    return {
      id: String(workspace._id),
      name: workspace.name,
      ownerEmail: workspace.ownerEmail,
      totalUsers: workspace.totalUsers,
      status: workspace.status,
      planType: workspace.planType,
      createdAt: workspace.createdAt,
    };
  }
}
