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
      permissions: [],
      createdByUserId: ownerId,
      isEditable: false,
      isDeletable: false,
    },
    {
      workspaceId,
      key: "member",
      name: "Member",
      permissions: [],
      createdByUserId: ownerId,
      isEditable: false,
      isDeletable: false,
    },
  ];
};
