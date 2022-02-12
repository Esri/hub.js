import { IHubEntityBase } from "./IHubEntityBase";
import { IHubGeography } from "../..";

/**
 * Properties exposed by Entities that are backed by Items
 */
export interface IHubItemEntity extends IHubEntityBase {
  /**
   * Thumbnail Uril (read-only)
   */
  thumbnailUrl?: string;
  /**
   * Username of the owner of the item
   */
  owner: string;
  /**
   * Description for the item
   */
  description?: string;
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
   * User configurable tags
   */
  tags: string[];
  /**
   * System configurable typekeywords
   */
  typeKeywords?: string[];
  /**
   * Canonical Url for the Entity
   */
  url?: string;
}
