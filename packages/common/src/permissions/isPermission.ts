import { ValidPermissions } from "./_internal/constants";
import { Permission } from "./types/Permission";

/**
 * Validate a Permission
 * @param permission
 * @returns
 */
export function isPermission(maybePermission: string): boolean {
  return ValidPermissions.includes(maybePermission as Permission);
}
