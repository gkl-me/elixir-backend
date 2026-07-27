import { BUILTIN_ROLES } from "./workspacePermissions";

type IBuiltInRole = {
  workspaceId: string;
  key: string;
  name: string;
  permissions: string[];
  createdByUserId: string;
  isEditable: boolean;
  isDeletable: boolean;
};

export const builtInRoles = (
  workspaceId: string,
  ownerId: string
): IBuiltInRole[] => {
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
