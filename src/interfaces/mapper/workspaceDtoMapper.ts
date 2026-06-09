import { IWorkspaceRole } from "../../models/WorkspaceRole";
import { ICreateRoleResDto, IGetRolesResDto, IUpdateRoleResDto } from "../dtos/WorkspaceRoleDto";


export class workspaceRoleDtoMapper {

    static toGetRoles(role: IWorkspaceRole): IGetRolesResDto {
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
        }
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
        }
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
        }
    }



}