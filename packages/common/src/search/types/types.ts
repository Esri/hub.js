import { HubEntityType } from "../../core/types/HubEntityType";
import {
  EntityType,
  IFilter,
  IHubCatalog,
  IPredicate,
  IQuery,
} from "./IHubCatalog";

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
  | "numviews"
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

export type ApiTarget = "portal" | "hub";

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
export type ICatalogInfo = Partial<IDeepCatalogInfo>;

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
 * Type wrapper for a kilobyte
 * This is complete syntactic sugar, it makes sizes easier to understand
 * with units as a type
 */
export type Kilobyte = number;

/**
 * When creating an entity, an editor can elect to initialize
 * the entity's catalog with a new group or an existing group.
 * The following types enumerate these options.
 */
export const CATALOG_SETUP_TYPES = [
  "blank",
  "newGroup",
  "existingGroup",
] as const;
export type CatalogSetupType = (typeof CATALOG_SETUP_TYPES)[number];

/**
 * Interface for configuring the catalog of an entity
 * when it is created.
 */
export interface ICatalogSetup {
  type: CatalogSetupType;
  groupId?: string[];
}

/**
 * Explanation of why a result matched a query
 */
export interface IQueryExplanation {
  /**
   * Copy of result; Useful when doing bulk calls
   */
  result: GenericResult;
  /**
   * Copy of query; Useful when doing bulk calls
   */
  query: IQuery;
  /**
   * Whether the result matched the query
   */
  matched: boolean;
  /**
   * Array of explanations for each filter
   */
  reasons: IFilterExplanation[];
  /**
   * Summary of all reasons for the result matching the query
   */
  summary: IMatchReason[];
}

export interface IQueryExplanationDetails {
  value: string;
  description: string;
  details: [];
}

/**
 * Explanation of why a filter matched a query
 */
export interface IFilterExplanation {
  /**
   * Copy of the Filter
   */
  filter: IFilter;
  /**
   * Did the filter match the query?
   */
  matched: boolean;
  /**
   * Array of explanations for each predicate in the Filter
   */
  reasons: IPredicateExplanation[];
}

/**
 * Explanation of why a predicate matched a query
 */
export interface IPredicateExplanation {
  /**
   * Copy of the Predicate
   */
  predicate: IPredicate;
  /**
   * Did the predicate match the query?
   */
  matched: boolean;
  /**
   * Array of reasons why the predicate matched the query
   */
  reasons: IMatchReason[];
  /**
   * Additional information about the predicate which can be useful
   * when preparing a UI to display the explanation
   */
  meta?: Record<string, any>;
}

/**
 * Match condition
 */
export type MatchCondition = "IN" | "NOT_IN" | "ALL";

/**
 * Reason why a result matched a query
 */
export interface IMatchReason {
  attribute: string;
  values?: string;
  condition?: MatchCondition; // EQ | NE | IN | NOT_IN | GT | LT | GTE | LTE | BETWEEN | NOT_BETWEEN | LIKE | NOT_LIKE | IS | IS_NOT | CONTAINS | NOT_CONTAINS | STARTS_WITH | ENDS_WITH | NOT_STARTS_WITH | NOT_ENDS_WITH | NOT_NULL | IS_NULL | NOT_EMPTY | IS_EMPTY | NOT_IN | NOT_BETWEEN | NOT_LIKE | NOT_CONTAINS | NOT_STARTS_WITH | NOT_ENDS_WITH | NOT_NULL | IS_NOT | IS_EMPTY;
  matched: boolean;
  requirement?: string;
  message?: string;
  meta?: Record<string, any>;
}

/**
 * Wide type allowing any object to be passed in as a result
 */
export type GenericResult = Record<string, any>;
