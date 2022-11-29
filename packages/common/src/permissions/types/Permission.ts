/**
 * Defines the values for Permissions
 * Note: This needs to be managed as a single list or typechecking does not work
 * We use an array so we can check for valid permissions
 */
const validPermissions = [
  "hub:site:create",
  "hub:site:delete",
  "hub:site:edit",
  "hub:site:view",
  "hub:project:create",
  "hub:project:delete",
  "hub:project:edit",
  "hub:project:view",
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
