import { IHubGeography } from "../..";

/**
 * Standardized light-weight search result structure, applicable to all
 * types of search results - users, groups, content, events etc
 */
export interface IHubSearchResult {
  /**
   * Access level of the backing entity
   */
  access: "public" | "shared" | "org" | "private";
  /**
   * Identifier - could be a guid or a username
   */
  id: string;
  /**
   * Hub Family: "dataset" | "map" | "document" | "content"
   * TODO: Can we create a type for this?
   */
  family: string;
  /**
   * Actual type
   * For Item backed results, this will be item.type
   * Otherwise it will be "Group", "User", "Event" etc
   */
  type: string;
  /**
   * Name or title
   */
  name: string;
  /**
   * Owner; Applies to Items and Groups
   */
  owner: string;
  /**
   * Sanitized summary derived from item.snippet, item.description, group.description
   */
  summary: string;
  /**
   * Date when the entity was created
   */
  createdDate: Date;
  /**
   * Source of the creation date as a property path
   * e.g. `item.created`
   */
  createdDateSource: string;
  /**
   * Date when the entity was last updated
   * Depending on the entity, this could be derived
   * in many different ways
   */
  updatedDate?: Date;
  /**
   * Source of the updated date as a property path
   * e.g. `featureService.lastEdit`
   */
  updatedDateSource?: string;
  /**
   * Fully qualified thumbnail url for items, groups, users
   * Will not have the token appended. Consuming app needs to
   */
  thumbnailUrl: string;
  /**
   * Hash of pre-computed urls
   */
  urls: {
    /**
     * Canononical ArcGIS Online Url for this entity (if applicable)
     */
    agoUrl?: string;
    /**
     * Relative url, which can be appended to a Site's root Url
     * e.g. /datasets/3ef8c7a, or /events/june-meeting
     * This is much easier than passing a Site into the search
     * system so the full url can be computed
     */
    siteRelativeUrl: string;
  };
  /**
   * Used in the Gallery components, where a callback can be
   * provided to compute a custom url for each result.
   * Useful when using those components in a custom app and
   * the routing is different from urls.siteRelativeUrl
   */
  customUrl?: string;
  /**
   * Geometry connected to this entity
   * For items, it will default to the extent,
   * but may be derived from a boundary resource
   * or the extent of a layer
   */
  geometry?: IHubGeography;
  /**
   * Generic hash of type-specific properties
   * that will be shown in the results card
   */
  metadata?: Array<{
    key: string;
    value: number | string | Date;
    label?: string;
    format?: Record<string, any>;
  }>;
  /**
   * Source of the entity.
   * Exact logic for this tbd, but the intent is to allow the
   * result to be attributed to something other than "owner"
   */
  source?: string;
}
