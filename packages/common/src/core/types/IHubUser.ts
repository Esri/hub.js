import { IUserHubSettings } from "../../utils/IUserHubSettings";
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

  /**
   * Id of the org that the user belongs to
   */
  orgId?: string;

  // NOTE: this is only needed b/c some pre-existing code
  // expects all entities to have an owner
  /**
   * User's own username
   */
  owner?: string;

  /**
   * the user's settings
   */
  settings?: IUserHubSettings;

  /**
   * the user's org settings that are configurable from hub
   * IMPT NOTE: this is a TEMPORARY solution and should be used sparingly. We are currently allowing
   * these settings to live on a user entity to allow for updating these settings in the user workspace
   * using the entity-editor. In the long term, we'd want these to be updated in an org-specific
   * workspace, rather than in the user workspace.
   *
   * We do NOT EVER want to rely on reading from these props on the user entity to dictate
   * what an org setting should look like.
   */
  hubOrgSettings?: IHubUserOrgSettings;

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

/**
 * Defines the properties of a Hub Org's settings stored on a IHubUser.
 *
 * IMPT NOTE: this is a TEMPORARY solution and should be used sparingly. We are currently allowing
 * these settings to live on a user entity to allow for updating these settings in the user workspace
 * using the entity-editor. In the long term, we'd want these to be updated in an org-specific
 * workspace, rather than in the user workspace.
 *
 * We do NOT EVER want to rely on reading from these props on the user entity to dictate
 * what an org setting should look like.
 */
export interface IHubUserOrgSettings {
  /**
   * Whether or not to show the informational banner
   */
  showInformationalBanner?: boolean;

  informationalBanner?: Record<string, unknown>;
  /**
   * Whether or not to enable terms and conditions when signing up in a community org
   */
  enableTermsAndConditions?: boolean;
  /**
   * The terms and conditions text
   */
  termsAndConditions?: string;
  /**
   * Whether or not to enable a custom signup text when signing up in a community org
   */
  enableSignupText?: boolean;
  /**
   * The custom signup text
   */
  signupText?: string;
}
