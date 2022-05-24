import { UserSession } from "@esri/arcgis-rest-auth";
import { IHubContent, AccessLevel } from "../..";
import { IFacet } from "./IFacet";

/**
 * Generic filter used with various search functions.
 *
 * `Filter<T extends FilterType>` [FilterType](../FilterType) is constrained to
 *
 * - `Filter<"any">` [IAnyFilterDefinition](../IAnyFilterDefinition)
 * - `Filter<"content">` [IContentFilterDefinition](../IContentFilterDefinition)
 * - `Filter<"user">` [IUserFilterDefinition](../IUserFilterDefinition)
 * - `Filter<"group">` [IGroupFilterDefinition](../IGroupFilterDefinition)
 *
 * When constructing a Filter as json, the `filterType` must be specified,
 * and it must be `keyof` [FilterTypeMap](../FilterTypeMap)
 *
 * ```ts
 * const f:Filter<"content"> = {
 *   filterType: "content" // must match the FilterType
 *   term: "water"
 * }
 * ```
 */
export type Filter<T extends FilterType> = IFilterTypeMap[T] & {
  filterType: T;
};

/**
 * Groups of filters with an operation specifying how the
 * filters should be connected when serialized
 */
export interface IFilterGroup<T extends FilterType> {
  filterType: T;
  operation?: "AND" | "OR";
  filters: Array<Filter<T>>;
}

/**
 * Defines the valid FilterTypes for use with `Filter<T extends FilterType>`
 * See [Filter](../Filter)
 */
export interface IFilterTypeMap {
  // any: IAnyFilterDefinition;
  item: IItemFilter;
  /**
   * DEPRECATED use item
   */
  content: IContentFilterDefinition;
  user: IUserFilterDefinition;
  group: IGroupFilterDefinition;
  event: IEventFilterDefinition;
}
export type FilterType = keyof IFilterTypeMap;

/**
 * Common set of fields that are reasonable to apply at the
 * top level of a Catalog
 */
// export interface IAnyFilterDefinition {
//   title?: string | string[] | IMatchOptions;
//   access?: string | string[] | IMatchOptions;
//   owner?: string | string[] | IMatchOptions;
//   tags?: string | string[] | IMatchOptions;
//   created?: IDateRange<number> | IRelativeDate;
//   modified?: IDateRange<number> | IRelativeDate;
//   description?: string | string[] | IMatchOptions;
//   group?: string | string[] | IMatchOptions;
//   orgid?: string | string[] | IMatchOptions;
//   type?:
//     | string
//     | NamedContentFilter
//     | Array<string | NamedContentFilter>
//     | IMatchOptions;
// }

export interface IItemFilter {
  access?: AccessLevel | AccessLevel[] | IMatchOptions;
  owner?: string | string[] | IMatchOptions;
  tags?: string | string[] | IMatchOptions;
  categories?: string | string[] | IMatchOptions;
  created?: IDateRange<number> | IRelativeDate;
  description?: string | string[] | IMatchOptions;
  snippet?: string | string[] | IMatchOptions;
  group?: string | string[] | IMatchOptions;
  id?: string | string[] | IMatchOptions;
  modified?: IDateRange<number> | IRelativeDate;
  orgid?: string | string[] | IMatchOptions;
  term?: string;
  title?: string | string[] | IMatchOptions;
  type?: string | string[] | IMatchOptions;

  typekeywords?: string | string[] | IMatchOptions;
  // this allows arbitrary keys, which Hub api supports
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}

/**
 * Fields related to Content based searches
 */
export interface IContentFilterDefinition {
  access?: string | string[] | IMatchOptions;
  owner?: string | string[] | IMatchOptions;
  tags?: string | string[] | IMatchOptions;
  categories?: string | string[] | IMatchOptions;
  created?: IDateRange<number> | IRelativeDate;
  description?: string | string[] | IMatchOptions;
  snippet?: string | string[] | IMatchOptions;
  group?: string | string[] | IMatchOptions;
  id?: string | string[] | IMatchOptions;
  modified?: IDateRange<number> | IRelativeDate;
  orgid?: string | string[] | IMatchOptions;
  term?: string;
  title?: string | string[] | IMatchOptions;
  type?:
    | string
    | NamedContentFilter
    | Array<string | NamedContentFilter>
    | IMatchOptions;
  typekeywords?: string | string[] | IMatchOptions;
  // this allows arbitrary keys, which Hub api supports
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
  /**
   * @internal
   * Support for complex OR queries; Used with various expansions
   */
  subFilters?: Array<IContentFilterDefinition | NamedContentFilter>;
}

// This type is used internally to Hub.js and is the
// "expanded" version of a ContentFilterDefinition
// which can then be serialized into Portal or Hub queries
export interface IContentFilter {
  access?: IMatchOptions;
  created?: IDateRange<number>;
  description?: IMatchOptions;
  group?: IMatchOptions;
  id?: IMatchOptions;
  modified?: IDateRange<number>;
  orgid?: IMatchOptions;
  owner?: IMatchOptions;
  tags?: IMatchOptions;
  term?: string;
  title?: IMatchOptions;
  type?: IMatchOptions;
  typekeywords?: IMatchOptions;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
  subFilters?: IContentFilter[];
}

// Short-cut strings for `type`
export interface IWellKnownContentFilters {
  $apps: IContentFilterDefinition[];
  $dashboard: IContentFilterDefinition[];
  $dataset: IContentFilterDefinition[];
  $experience: IContentFilterDefinition[];
  $site: IContentFilterDefinition[];
  $storymap: IContentFilterDefinition[];
  $initiative: IContentFilterDefinition[];
  $document: IContentFilterDefinition[];
}

// Allows type-safe query "short-cuts"
export type NamedContentFilter = keyof IWellKnownContentFilters;

export interface IUserFilterDefinition {
  created?: IDateRange<number> | IRelativeDate;
  disabled?: boolean;
  email?: string | string[] | IMatchOptions;
  firstname?: string | string[] | IMatchOptions;
  fullname?: string | string[] | IMatchOptions;
  groups?: string | string[] | IMatchOptions;
  lastlogin?: IDateRange<number> | IRelativeDate;
  lastname?: string | string[] | IMatchOptions;
  modified?: IDateRange<number> | IRelativeDate;
  role?: string | string[] | IMatchOptions;
  term?: string;
  userlicensetype?: string | string[] | IMatchOptions;
  username?: string | string[] | IMatchOptions;
}

export interface IGroupFilterDefinition {
  access?: string | string[] | IMatchOptions;
  created?: IDateRange<number> | IRelativeDate;
  id?: string | string[] | IMatchOptions;
  isInvitationOnly?: boolean;
  modified?: IDateRange<number> | IRelativeDate;
  orgid?: string | string[] | IMatchOptions;
  owner?: string | string[] | IMatchOptions;
  searchUserAccess?: "groupMember";
  tags?: string | string[] | IMatchOptions;
  term?: string;
  title?: string | string[] | IMatchOptions;
  typekeywords?: string | string[] | IMatchOptions;
}

export interface IEventFilterDefinition {
  created?: IDateRange<number> | IRelativeDate;
  modified?: IDateRange<number> | IRelativeDate;
  orgid?: string | string[] | IMatchOptions;
  title?: string | string[] | IMatchOptions;
}

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

/**
 * searchContent return
 */
export interface IContentSearchResult {
  total: number;
  results: IHubContent[];
  facets?: IFacet[];
  hasNext: boolean;
  next: (params?: any) => Promise<IContentSearchResult>;
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
  // Future - allows separate auth objects per API Definition
  authentication?: UserSession;
}

export interface IFacetState {
  [key: string]: string;
}

export interface ICollectionState {
  query?: string; // query term
  sort?: string; // attribute|direction
  [key: string]: string;
}

export interface ICatalogState {
  collection: string; // key of the active collection (only relevant for -catalog component)
  collectionState?: ICollectionState; // state of the collection
}

/**
 * Generic key/value type for storing component state
 */
export interface IComponentState {
  [key: string]: string;
}
