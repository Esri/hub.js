import { IHubEntityBase } from "./IHubEntityBase";
import { IHubGeography } from "../../types";
import { AccessLevel } from "./types";
import { IWithPermissions, IWithViewSettings } from "../traits";
import { IHubLocation } from "./IHubLocation";

/**
 * Properties exposed by Entities that are backed by Items
 */
export interface IHubItemEntity extends IHubEntityBase, IWithPermissions {
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
   * Thumbnail Uril (read-only)
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

  location?: IHubLocation;

  /**
   * The orgId of the Entity, if available
   */
  orgId?: string;
}
