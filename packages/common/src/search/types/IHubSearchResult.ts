import { HubFamily, IHubGeography } from "../..";
import { AccessLevel, IHubEntityBase } from "../../core";

/**
 * Simple interface for Links
 */
export interface ILink {
  /**
   * Link url
   */
  href: string;
  /**
   * Additional optional properties
   */
  [key: string]: string;
}

/**
 * Standardized light-weight search result structure, applicable to all
 * types of search results - users, groups, content, events etc
 */
export interface IHubSearchResult extends IHubEntityBase {
  /**
   * Access level of the backing entity
   */
  access: AccessLevel;

  /**
   * Hub Family
   */
  family: HubFamily;

  /**
   * Owner; Applies to Items and Groups
   */
  owner?: string;

  /**
   * Tags; Applies to Items
   */
  tags?: string[];

  /**
   * Categories; Applies to Items
   */
  categories?: string[];

  /**
   * Links to related things
   */
  links?: {
    /**
     * Url to Thumbnail. Will not include a token
     */
    thumbnail?: string;
    /**
     * Url to the entities canonical "self"
     * For Items/Groups/Users, this will be the Home App url
     * For other entities, it will be the canonical url
     */
    self: string;
    /**
     * Relative url of the entity, within a site
     */
    siteRelative: string;
    /**
     * Additional urls
     */
    [key: string]: string | ILink;
  };

  /**
   * Geometry connected to this entity
   * For items, it will default to the extent,
   * but may be derived from a boundary resource
   * or the extent of a layer
   */
  geometry?: IHubGeography;

  /** Allow any additional properties to be added */
  [key: string]: any;
}
