import { Permission } from "..";
import { ValidPermissions } from "./_internal/constants";

/**
 * Validate a Permission
 * @param permission
 * @returns
 */
export function isPermission(maybePermission: string): boolean {
  return ValidPermissions.includes(maybePermission as Permission);
}
