import { IEntityFeatures, IEntityPermissionPolicy } from "../../permissions";

/**
 * Adds permissions property to an entity
 */
export interface IWithPermissions {
  /**
   * Array of permission policies that apply to the entity
   * Only permissions with `entity
   */
  permissions?: IEntityPermissionPolicy[];

  /**
   * We need a means to enable / disable the "feature/capability" represented by a permission
   * for an entity. e.g. we want to disable events for a site, so we have `hub:site:events`: false
   */
  features?: IEntityFeatures;
}
