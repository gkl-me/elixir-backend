import { BUILTIN_ROLES, WORKSPACE_PERMISSIONS } from "./workspacePermissions";

export const builtInRoles = (workspaceId: string, ownerId: string) => {
  return [
    {
      workspaceId,
      key: "owner",
      name: "Owner",
      permissions: ["*"],
      createdByUserId: ownerId,
      isEditable: false,
      isDeletable: false,
    },
    {
      workspaceId,
      key: "admin",
      name: "Admin",
      permissions: [...BUILTIN_ROLES.admin],
      createdByUserId: ownerId,
      isEditable: false,
      isDeletable: false,
    },
    {
      workspaceId,
      key: "member",
      name: "Member",
      permissions: [...BUILTIN_ROLES.member],
      createdByUserId: ownerId,
      isEditable: false,
      isDeletable: false,
    },
  ];
};
