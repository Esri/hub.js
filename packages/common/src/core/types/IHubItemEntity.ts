import { IHubEntityBase } from "./IHubEntityBase";
import { BBox, IHubGeography } from "../../types";
import { AccessLevel } from "./types";

/**
 * Properties exposed by Entities that are backed by Items
 */
export interface IHubItemEntity extends IHubEntityBase {
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
  extent?: BBox;

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
   * System configurable typekeywords
   */
  typeKeywords?: string[];
}
