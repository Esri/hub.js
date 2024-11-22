import { HubEntityType } from "../../core";
import { EntityType, IHubCatalog } from "./IHubCatalog";
import { IHubSearchResponse } from "./IHubSearchResponse";
import { IHubSearchResult } from "./IHubSearchResult";

/**
 * Sort Option to be displayed in a UI
 */
export interface ISortOption {
  // String to show in the UI. translated.
  label: string;
  // attribute to sort by at the API level
  attribute: string;
  // Default sort order for the sort field
  defaultOrder: string;
  // Current sort order for the sort field (mutable)
  order: string;
}

/**
 * Sort options supported
 */
export type SortOption =
  | "relevance"
  | "title"
  | "created"
  | "modified"
  | "username"
  | "joined"
  | "memberType"
  | "firstName"
  | "lastName"
  | "startDate";

/**
 * Defines a span of time by specifying a `from` and `to` Date
 * as either a number or a ISO string
 */
export interface IDateRange<T> {
  type?: "date-range";
  from: T;
  to: T;
}

/**
 * Relative Date will be convertd to a `IDateRange` at run-time
 */
export interface IRelativeDate {
  type: "relative-date";
  num: number;
  unit: "minutes" | "hours" | "days" | "weeks" | "months" | "years";
}

/**
 * Define how values should be matched
 */
export interface IMatchOptions {
  /**
   * return results which have ANY of the listed values
   * for the specified field
   */
  any?: string | string[];
  /**
   * return resutls which have ALL of the listed values
   * for the specified field
   */
  all?: string | string[];
  /**
   * return results which do not have any of the listed
   * values for the specified field
   */
  not?: string | string[];
  /**
   * Depending on the API being searched, `exact` will
   * attempt to structure the query such that it is an
   * exact match. For Portal API, this may involve using
   * the `filter` parameter, if the specific field can
   * be used with that parameter
   */
  exact?: string | string[];
}

export interface IWellKnownApis {
  arcgis: IApiDefinition;
  arcgisQA: IApiDefinition;
  arcgisDEV: IApiDefinition;
  hub: IApiDefinition;
  hubQA: IApiDefinition;
  hubDEV: IApiDefinition;
}

// Allows type-safe query "short-cuts"
export type NamedApis = keyof IWellKnownApis;

// Defines an API
export interface IApiDefinition {
  label?: string;
  // url of the api
  // - for "arcgis", /sharing/rest will be appended
  // - for "arcgis-hub", the /v3/search will be added
  url: string;
  // We can add types as we add support for more
  type: "arcgis" | "arcgis-hub";
}
/**
 * Base options when checking catalog containment
 */
export interface IContainsOptions {
  /**
   * Entity type of the identifier
   * Specifing this will allow us to skip a lookup
   */
  entityType?: EntityType;
  /**
   * Hub Entity type of the identifier
   */
  hubEntityType?: HubEntityType;
}

/**
 * Basic information about a catalog
 */
export interface ICatalogInfo extends Partial<IDeepCatalogInfo> {}

/**
 * Cacheable information about a catalog
 */
export interface IDeepCatalogInfo {
  // id of the entity with the catalog we are checking
  id: string;
  // Hub Entity type of the entity with the catalog we are checking
  // This enables us to use the entity functions to fetch the catalog
  hubEntityType: HubEntityType;

  // optional, but if passed it reduces the xhrs to fetch the catalogs
  catalog?: IHubCatalog;
}

/**
 * When checking containment, we want to be able to cache the response
 * so we return enough information to do that
 */
export interface IContainsResponse {
  // identifier being checked
  identifier: string;
  // is the entity actually contained in the catalog?
  isContained: boolean;
  /**
   * Cacheable information about the catalogs
   */
  catalogInfo?: Record<string, ICatalogInfo>;
  /**
   * How long did it take to check containment?
   */
  duration?: number;

  /**
   * If the entity is not contained, this will be populated with a reason
   */
  reason?: string;
}

/**
 * Response from a search operation on a Catalog
 */
export interface ICatalogSearchResponse {
  catalogTitle: string;
  collectionResults: ISearchResponseHash;
  scopeResults?: ISearchResponseHash;
}

/**
 * Response from a Catalog search operation where the responses for different collections
 * or entities are grouped into a single object.
 */

export interface ISearchResponseHash
  extends Record<string, IHubSearchResponse<IHubSearchResult>> {}

/**
 * Type wrapper for a kilobyte
 * This is complete syntactic sugar, it makes sizes easier to understand
 * with units as a type
 */
export type Kilobyte = number;
