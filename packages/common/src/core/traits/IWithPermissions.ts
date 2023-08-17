import { IEntityFeatures, IEntityPermissionPolicy } from "../../permissions";
import { EntityCapabilities } from "../../capabilities";

/**
 * Adds permissions property to an entity
 */
export interface IWithPermissions {
  /**
   * Array of permission policies that apply to the entity
   */
  permissions?: IEntityPermissionPolicy[];

  /**
   * We need a means to enable / disable the "feature/capability" represented by a permission
   * for an entity. e.g. we want to disable events for a site, so we have `hub:site:events`: false
   */
  features?: IEntityFeatures;

  /**
   * DEPRECATEDL use `features` instead
   */
  capabilities?: EntityCapabilities;
}
