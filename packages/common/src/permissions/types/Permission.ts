import { ValidPermissions } from "../_internal/constants";

/**
 * A union type of all possible/supported permissions
 */
export type Permission = (typeof ValidPermissions)[number];
