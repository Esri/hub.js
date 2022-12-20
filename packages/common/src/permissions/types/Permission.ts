import { ProjectPermissions } from "../../projects/_internal/ProjectBusinessRules";
import { SitePermissions } from "../../sites/_internal/SiteBusinessRules";
import { InitiativePermissions } from "../../initiatives/_internal/InitiativeBusinessRules";

/**
 * Defines the values for Permissions
 * It's critical that the arrays defined in the modules use `as const`
 * otherwise Permission devolves into just a string type
 */
const validPermissions = [
  ...SitePermissions,
  ...ProjectPermissions,
  ...InitiativePermissions,
] as const;

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
