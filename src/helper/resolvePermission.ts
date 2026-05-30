import {
  PERMISSION_DEPENDENCIES,
  WORKSPACE_PERMISSION,
} from "../constants/workspacePermissions";

export function resolvePermission(
  permissions: WORKSPACE_PERMISSION[]
): WORKSPACE_PERMISSION[] {
  const resolvedPermissions = new Set(permissions);

  for (const permission of resolvedPermissions) {
    const dependencies = PERMISSION_DEPENDENCIES[permission];

    dependencies?.forEach((dep) => {
      resolvedPermissions.add(dep);
    });
  }

  return [...resolvedPermissions];
}
