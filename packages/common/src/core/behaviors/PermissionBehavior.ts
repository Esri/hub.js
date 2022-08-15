import { IUser } from "@esri/arcgis-rest-types";
import { PermissionManager } from "../PermissionManager";
import { IHubPermission, HubPermission } from "../types/IHubPermission";

/**
 * Composable behavior that adds permissions to an entity
 */
export interface IPermissionBehavior {
  permissions: PermissionManager;
}

// Permission util functions

/**
 * Check if the user has a specific permission in the context of an entity
 * @param entity
 * @param permission
 * @param user
 * @returns
 */
export function checkPermission(
  permission: HubPermission,
  user: IUser,
  permissions: IHubPermission[]
): boolean {
  // filter to only those for the requested permission
  const filteredPermissions = permissions.filter(
    (p) => p.permission === permission
  );
  let result = false;
  // check if the user has the permission
  filteredPermissions.forEach((p) => {
    // if the user has the permission, return true
    if (p.target === "user" && p.targetId === user.username) {
      result = true;
    }
    // if the user's or has the permission, return true
    if (!result && p.target === "org" && p.targetId === user.orgId) {
      result = true;
    }
    // if the user is in a group that has the permission, return true
    if (!result && p.target === "group") {
      if (user.groups?.find((g) => g.id === p.targetId)) {
        result = true;
      }
    }
  });
  return result;
}

/**
 * Get all the permission definitions for the given entity, and the specific permission
 * @param permission
 * @param permissions
 * @returns
 */
export function getPermissions(
  permission: HubPermission,
  permissions: IHubPermission[]
): IHubPermission[] {
  return permissions.filter((p) => p.permission === permission);
}

/**
 * Add a permission entry to the permissions array
 * @param permission
 * @param definition
 * @param permissions
 * @returns
 */
export function addPermission(
  permission: HubPermission,
  definition: IHubPermission,
  permissions: IHubPermission[]
): IHubPermission[] {
  const otherPermissions = removePermission(
    permission,
    definition.targetId,
    permissions
  );
  return [...otherPermissions, definition];
}

/**
 * Remove a permission
 * @param permission
 * @param targetId
 * @param permissions
 * @returns
 */
export function removePermission(
  permission: HubPermission,
  targetId: string,
  permissions: IHubPermission[]
): IHubPermission[] {
  return permissions.filter((p) => {
    let keep = true;
    if (p.permission === permission && p.targetId === targetId) {
      keep = false;
    }
    return keep;
  });
}
