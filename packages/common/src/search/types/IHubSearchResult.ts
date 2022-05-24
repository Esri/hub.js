import { HubFamily, IHubGeography } from "../..";
import { AccessLevel, IHubEntityBase } from "../../core";

export interface ILink {
  href: string;
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
   * DEPRECATED use links.thumbnail
   * Fully qualified thumbnail url for items, groups, users
   * Will not have the token appended. Consuming app needs to
   * check the value of `access` and apply the token as needed
   */
  thumbnailUrl?: string;
  /**
   * DEPRECATED - use links
   * Hash of pre-computed urls
   */
  urls?: {
    /**
     * DEPRECATED - use links
     * Canononical ArcGIS Online Url for this entity (if applicable)
     */
    portalHome?: string;
    /**
     * DEPRECATED - use links
     * Relative url, which can be appended to a Site's root Url
     * e.g. /datasets/3ef8c7a, or /events/june-meeting
     * This is much easier than passing a Site into the search
     * system so the full url can be computed
     */
    relative: string;

    /**
     * DEPRECATED - use links
     * Allow for arbitrary other urls, including `.customUrl` which
     * can ben generated client-side in the gallery via a callback
     */
    [key: string]: string;
  };

  /**
   * Links to
   */
  links?: {
    thumbnail?: string;
    self: string;
    siteRelative: string;
    [key: string]: string | ILink;
  };

  /**
   * Geometry connected to this entity
   * For items, it will default to the extent,
   * but may be derived from a boundary resource
   * or the extent of a layer
   */
  geometry?: IHubGeography;

  /**
   * DEPRECATED - includes/enrichments are directly attached
   * Optional metadata hash
   * Any specified enrichments will be attached in here, as well
   * as tags, typekeywords and culture
   */
  metadata?: Record<string, any>;

  /** Allow any additional properties to be added */
  [key: string]: any;
}
