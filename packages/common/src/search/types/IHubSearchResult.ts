import { AccessLevel, IHubEntityBase } from "../../core";
import { HubFamily, IHubGeography } from "../../types";

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
   * TypeKeywords; Applies to Items
   */
  typeKeywords?: string[];

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
