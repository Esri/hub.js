import { UserSession } from "@esri/arcgis-rest-auth";
import { IHubContent, IModel } from "..";

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
 * Defines the valid FilterTypes for use with `Filter<T extends FilterType>`
 * See [Filter](../Filter)
 */
export interface IFilterTypeMap {
  any: IAnyFilterDefinition;
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
export interface IAnyFilterDefinition {
  title?: string | string[] | IMatchOptions;
  access?: string | string[] | IMatchOptions;
  owner?: string | string[] | IMatchOptions;
  tags?: string | string[] | IMatchOptions;
  created?: IDateRange<number> | IRelativeDate;
  modified?: IDateRange<number> | IRelativeDate;
  description?: string | string[] | IMatchOptions;
  group?: string | string[] | IMatchOptions;
  orgid?: string | string[] | IMatchOptions;
  type?:
    | string
    | NamedContentFilter
    | Array<string | NamedContentFilter>
    | IMatchOptions;
}

/**
 * Fields related to Content based searches
 */
export interface IContentFilterDefinition {
  access?: string | string[] | IMatchOptions;
  owner?: string | string[] | IMatchOptions;
  tags?: string | string[] | IMatchOptions;
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

// User controlled refinements
// can be static or dynamic (based on stats from the api)
export interface IFacet {
  // Label for the whole facet, shown in UI
  label: string;
  // what attribute this is powered by
  attribute?: string;
  // what type of facet is this
  type: "single-select" | "multi-select" | "date-range" | "histogram";
  // if static, contains the pre-defined options
  // if dynamic the code must construct these
  // from the API response
  options?: IFacetOption[];
  // whether to keep the accordion closed
  accordionClosed?: boolean;
  // number of facet options to show
  pageSize?: number;
}

// Facet Options shown in the UI
export interface IFacetOption {
  // What's shown in the UI
  label: string;
  // API Value
  value: string;
  // Count, if returned from API
  count?: number;
  // is this selected
  selected: boolean;
  // when selected, this is the Filter to add
  filter: Filter<FilterType>;
}

/**
 * Catalog is the definition which powers what options
 * are available in a Gallery. It controls not only
 * the scoping of the search, but also the options
 * available to the UX.
 *
 * Thus the lower-level `searchContent`, `searchUser`, `searchGroup` functions
 * do not take Catalogs, rather they accept [Filters](../Filter)
 *
 * ```ts
 * const simpleCatalog:Catalog = {
 *   title: "Select Map",
 *   filter: {
 *     filterType: "content",
 *     type: "Web Map",
 *     owner: "jsmith"
 *   }
 * }
 * ```
 *
 * ## Collections
 * The key feature of a Catalog is the ability to defined [Collections](../Collection).
 * These are essentially sub-sets of content, typically organized around
 * generalized content types, i.e. "Datasets", vs "Maps", vs "Documents"
 *
 *
 * ```ts
 * const complex:Catalog = {
 *   filter: {
 *    type: "content",
 *    groups: ["3ef", "bc4"]
 *   },
 *   collections: [
 *     {
 *       label: "Documents",
 *       filter: {
 *         filterType: "content",
 *         type: ["Microsoft Word", "PDF", "Microsoft Excel"]
 *       }
 *     },
 *     {
 *       label: "Datasets",
 *       filter: {
 *         filterType: "content",
 *         type: ["Feature Layer", "Feature Service", "Map Service", "CSV"]
 *       }
 *     }
 *   ]
 * }
 * ```
 */
export interface ICatalog {
  /**
   * Title for the Gallery
   */
  title?: string;
  // Filter defines the "scope" of the Catalog
  // typically a set of groups or orgids
  filter: Filter<FilterType>;
  // sort options to be shown in the Gallery
  // if not specified, defaults are merged in
  sort?: ISortOption[];
  // Sub Groups within the Catalog
  collections?: ICollection[];
  // facets to use with all Filters
  facets?: IFacet[];
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
 * A Filter that defines a subset of a Catalog, aka a Collection
 */
export interface ICollection {
  label: string;
  filter: Filter<FilterType>;
  facets?: IFacet[];
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
 * Search Options
 */
export interface IHubSearchOptions {
  site?: IModel;
  authentication?: UserSession;
  sortField?: string;
  sortOrder?: "desc" | "asc";
  page?: string;
  num?: number;
  aggregations?: string[];
  bbox?: string;
  fields?: string;
  api?: NamedApis | IApiDefinition;
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
