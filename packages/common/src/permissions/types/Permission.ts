import { ProjectPermissions } from "../../projects/_internal/ProjectPermissionPolicies";
import { SitePermissions } from "../../sites/_internal/SitesPermissionPolicies";

/**
 * Defines the values for Permissions
 * It's critical that the arrays defined in the modules use `as const`
 * otherwise Permission devolves into just a string type
 */
const validPermissions = [...SitePermissions, ...ProjectPermissions] as const;

/**
 * Defines the possible values for Permissions
 */
export type Permission = typeof validPermissions[number];

/**
 * Validate a Permission
 * @param permission
 * @returns
 */
export function isPermission(maybePermission: string): boolean {
  return validPermissions.includes(maybePermission as Permission);
}
