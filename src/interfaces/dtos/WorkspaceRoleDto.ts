import { WORKSPACE_PERMISSION } from "../../constants/workspacePermissions";

export interface IGetRolesDto {
  workspaceId: string;
}

export interface IGetRolesResDto {
  id: string;
  workspaceId: string;
  key: string;
  name: string;
  permissions: string[];
  createdByUserId: string;
  isEditable: boolean;
  isDeletable: boolean;
  isDeleted: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ICreateRoleDto {
  workspaceId: string;
  name: string;
  permissions: WORKSPACE_PERMISSION[];
  createdByUserId: string;
}

export interface ICreateRoleResDto {
  workspaceId: string;
  key: string;
  name: string;
  permissions: string[];
  createdByUserId: string;
  isEditable: boolean;
  isDeletable: boolean;
  isDeleted: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IUpdateRoleDto {
  roleId: string;
  workspaceId: string;
  name?: string;
  permissions?: WORKSPACE_PERMISSION[];
}

export interface IUpdateRoleResDto {
  workspaceId: string;
  key: string;
  name: string;
  permissions: string[];
  createdByUserId: string;
  isEditable: boolean;
  isDeletable: boolean;
  isDeleted: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IDeleteRoleDto {
  roleId: string;
  workspaceId: string;
}
