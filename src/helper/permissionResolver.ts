// import {
//   PERMISSION_DEPENDENCIES,
//   WORKSPACE_PERMISSION,
// } from "../constants/workspacePermissions";

import {
  PERMISSION_DEPENDENCIES,
  WORKSPACE_PERMISSION,
} from "../constants/workspacePermissions";

// export function resolvePermission(
//   permissions: WORKSPACE_PERMISSION[]
// ): WORKSPACE_PERMISSION[] {
//   const resolvedPermissions = new Set(permissions);

//   for (const permission of resolvedPermissions) {
//     const dependencies = PERMISSION_DEPENDENCIES[permission];

//     dependencies?.forEach((dep) => {
//       resolvedPermissions.add(dep);
//     });
//   }

//   return [...resolvedPermissions];
// }

export function resolveDependencies(
  selected: WORKSPACE_PERMISSION[]
): WORKSPACE_PERMISSION[] {
  const result = new Set(selected);
  let changed = true;

  while (changed) {
    changed = false;
    for (const perm of Array.from(result)) {
      const deps = PERMISSION_DEPENDENCIES[perm] ?? [];
      for (const dep of deps) {
        if (!result.has(dep)) {
          result.add(dep);
          changed = true;
        }
      }
    }
  }

  return Array.from(result);
}

export function removeDependents(
  toRemove: WORKSPACE_PERMISSION,
  current: WORKSPACE_PERMISSION[]
): WORKSPACE_PERMISSION[] {
  const dependents = new Set();

  const findDeps = (perm: WORKSPACE_PERMISSION): void => {
    for (const [key, deps] of Object.entries(PERMISSION_DEPENDENCIES)) {
      if (deps.includes(perm)) {
        if (!dependents.has(key)) {
          dependents.add(key);
          findDeps(key as WORKSPACE_PERMISSION);
        }
      }
    }
  };

  findDeps(toRemove);
  dependents.add(toRemove);

  return current.filter((p) => !dependents.has(p));
}
