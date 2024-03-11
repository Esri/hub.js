import { IHubEntityBase } from "./IHubEntityBase";
import { IHubGeography } from "../../types";
import { AccessLevel } from "./types";
import {
  IWithPermissions,
  IWithViewSettings,
  IWithDiscussions,
} from "../traits";
import { IHubLocation } from "./IHubLocation";
import { IWithFollowers } from "../traits/IWithFollowers";
import { IWithAssociations } from "../traits/IWithAssociations";
import { IMetricEditorValues } from "./Metrics";

/**
 * Properties exposed by Entities that are backed by Items
 */
export interface IHubItemEntity
  extends IHubEntityBase,
    IWithPermissions,
    IWithDiscussions,
    IWithFollowers,
    IWithAssociations {
  /**
   * Access level of the item ("private" | "org" | "public")
   */
  access?: AccessLevel;

  /**
   * boundary will default to the item extent
   * but can be overwritten by enrichments from the Hub API (inline)
   * or fetched from a location such as /resources/boundary.json
   */
  boundary?: IHubGeography;

  /**
   * Parsed item categories (see parseItemCategories)
   */
  categories?: string[];

  /**
   * Culture code of the content
   * i.e. `en-us`
   */
  culture?: string;

  /**
   * Description for the item
   */
  description?: string;

  /**
   * Extent of the Entity
   */
  extent?: number[][];

  /**
   * Platform derived based on current user's access to the entity
   * if defined, it means the user can edit the entity
   */
  itemControl: string;

  /**
   * Username of the owner of the item
   */
  owner: string;

  /**
   * TODO: change this property to store item.url. Store the
   * canonical url in IHubEntityBase.links.self instead.
   *
   * Canonical Url for the Entity
   */
  url?: string;

  /**
   * Current schema version. Used to determine what if any
   * schema migrations should be applied when the item is loaded
   */
  schemaVersion: number;

  /**
   * User configurable tags
   */
  tags: string[];

  /**
   * TODO: Deprecate this in favor of IHubEntityBase.links.thumbnail
   * Thumbnail Url (read-only)
   */
  thumbnailUrl?: string;

  /**
   * Thumbnail (read-only)
   */
  thumbnail?: string;

  /**
   * System configurable typekeywords
   */
  typeKeywords?: string[];

  /**
   * Project display properties
   */
  view?: IWithViewSettings;

  /**
   * Can current user edit the entity
   * Derived from `item.itemControl` = "admin" | "update"
   * @readonly
   */
  canEdit: boolean;

  /**
   * Can current user delete the entity
   * Derived from `item.itemControl` = "admin"
   * @readonly
   */
  canDelete: boolean;

  /**
   * The location of the Entity
   */
  location?: IHubLocation;

  /**
   * The orgId of the Entity, if available
   */
  orgId?: string;

  /**
   * Is the item protected?
   */
  protected?: boolean;
  /**
   * Can this item be recycled?
   * This will be returned by the Portal API once recycling is enabled on the platform
   * Optional because it can default to false if not returned by the API
   */
  canRecycle?: boolean;
}

export type IHubItemEntityEditor<T> = Omit<T, "extent"> & {
  view: {
    featuredImage?: any;
  };
  /**
   * Thumbnail image. This is only used on the Editor and is
   * persisted in the fromEditor method on the Class
   */
  _thumbnail?: any;
  /**
   * Follower group settings. These settings are only used in the
   * Editor and is persisted appropriately in the fromEditor
   * method on the Class
   */
  _followers?: {
    groupAccess?: AccessLevel;
    showFollowAction?: boolean;
    isDiscussable?: boolean;
  };

  /**
   * Association group settings. These settings are only used in the
   * Editor and is persisted appropriately in the fromEditor
   * method on the Class
   */
  _associations?: {
    groupAccess?: AccessLevel;
    membershipAccess?: "organization" | "collaborators" | "anyone";
    includeInCatalog?: boolean;
  };
  _metric?: IMetricEditorValues;
};
