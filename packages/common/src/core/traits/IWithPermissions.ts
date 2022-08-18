import { IHubPermission } from "../types";

/**
 * Adds permissions property to an entity
 */
export interface IWithPermissionDefinition {
  /**
   * List of permissions for the entity
   */
  permissionDefinition: IHubPermission[];
}
