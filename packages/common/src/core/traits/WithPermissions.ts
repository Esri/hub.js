import { IHubPermission } from "../behaviors";

/**
 * Adds permissions property to an entity
 */
export interface IWithPermissions {
  /**
   * List of permissions for the entity
   */
  permissions: IHubPermission[];
}
