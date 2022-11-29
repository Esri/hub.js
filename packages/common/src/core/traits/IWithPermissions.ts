import { IEntityPermissionPolicy } from "../../permissions";

/**
 * Adds permissions property to an entity
 */
export interface IWithPermissions {
  /**
   * Array of permission policies that apply to the entity
   */
  permissions?: IEntityPermissionPolicy[];
}
