import { IUser } from "@esri/arcgis-rest-types";
import { getWithDefault, setProp } from "../../objects";

export interface IPermissionBehavior {
  /**
   * Check if the user has a specific permission in the context of an entity
   * @param permission
   */
  checkPermission(permission: HubPermission): boolean;
  /**
   * Get all the permission definitions for the given entity, and the specific permission
   * @param key permission to check for
   */
  getPermissions(key: string): IHubPermission[];
  /**
   * Set a permission for the given entity
   * @param permission
   */
  addPermission(permission: HubPermission, definition: IHubPermission): void;
  /**
   * Remove a permission for the given entity and store it in the store
   * @param key permission to remove
   */
  removePermission(key: string): void;
}

export type HubPermission =
  | "addInitiative"
  | "createInitiative"
  | "editInitiative"
  | "deleteInitiative"
  | "addProject"
  | "createProject"
  | "editProject"
  | "deleteProject";

export type PermissionTarget = "org" | "group" | "user";

export interface IHubPermission {
  /**
   * Identifier for the permission
   */
  key: string;
  /**
   * What action is being enabled for the target
   */
  permission: HubPermission;
  /**
   * What is the target of the permission
   */
  target: PermissionTarget;
  /**
   * Id of the entity that this permission is granted for
   */
  targetId: string;
}

export function checkPermission<T>(
  entity: T,
  permission: HubPermission,
  user: IUser
): boolean {
  const allPermissions = getWithDefault(
    entity,
    "permissions",
    []
  ) as IHubPermission[];
  // filter to only those for the requested permission
  const filteredPermissions = allPermissions.filter(
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

export function getPermissions<T>(entity: T, key: string): IHubPermission[] {
  const allPermissions = getWithDefault(
    entity,
    "permissions",
    []
  ) as IHubPermission[];
  return allPermissions.filter((p) => p.key === key);
}

// TODO: should this take a permission array and return a new permission array
export function addPermission<T>(
  entity: T,
  permission: HubPermission,
  definition: IHubPermission
): T {
  const allPermissions = getWithDefault(
    entity,
    "permissions",
    []
  ) as IHubPermission[];
  const otherPermissions = allPermissions.filter((p) => {
    return p.permission !== permission && p.target !== definition.target;
  });
  const newPermissions = [...otherPermissions, definition];
  // TODO: Add permissions to IHubProject
  setProp("permissions", newPermissions, entity);
  return entity;
}

export function removePermission<T>(entity: T, key: string): T {
  const allPermissions = getWithDefault(
    entity,
    "permissions",
    []
  ) as IHubPermission[];
  const otherPermissions = allPermissions.filter((p) => {
    return p.key !== key;
  });
  // TODO: Add permissions to IHubProject
  setProp("permissions", otherPermissions, entity);
  return entity;
}
