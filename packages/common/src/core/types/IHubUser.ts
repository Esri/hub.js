import { IHubEntityBase } from "./IHubEntityBase";
import { SettableAccessLevel } from "./types";

/**
 * Defines the properties of a Hub User object
 *
 * NOTE: unlike other entities, we do not support
 * creating, updating, or deleting users due to
 * the limitations imposed by the platform on those operations
 *
 * @internal
 */
export interface IHubUser extends IHubEntityBase {
  /**
   * Access level of the user
   * ("private" | "org" | "public")
   */
  access: SettableAccessLevel;

  /**
   * Description for the item
   */
  description?: string;

  // NOTE: this is only needed b/c some pre-existing code
  // expects all entities to have an owner
  /**
   * User's own username
   */
  owner?: string;

  /**
   * User configurable tags
   */
  tags?: string[];

  /**
   * User thumbnail url (read-only)
   */
  thumbnail?: string;

  /**
   * System configurable typekeywords
   * NOTE: this will be initialized as an empty array
   * and is only here for consistency with other entities
   * and will be ignored otherwise
   */
  typeKeywords?: string[];

  // NOTE: may want more like email, role, etc, see:
  // https://developers.arcgis.com/rest/users-groups-and-items/user.htm
}
