import { UserSession } from "@esri/arcgis-rest-auth";

/**
 * Generic filter used with various search functions.
 *
 * `Filter<T extends FilterType>` [FilterType](../FilterType) is constrained to
 *
 * - `Filter<"any">` [AnyFilterDefinition](../AnyFilterDefinition)
 * - `Filter<"content">` [ContentFilterDefinition](../ContentFilterDefinition)
 * - `Filter<"user">` [UserFilterDefinition](../UserFilterDefinition)
 * - `Filter<"group">` [GroupFilterDefinition](../GroupFilterDefinition)
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
export type Filter<T extends FilterType> = FilterTypeMap[T] & {
  filterType: T;
};

/**
 * Defines the valid FilterTypes for use with `Filter<T extends FilterType>`
 * See [Filter](../Filter)
 */
export type FilterTypeMap = {
  any: AnyFilterDefinition;
  content: ContentFilterDefinition;
  user: UserFilterDefinition;
  group: GroupFilterDefinition;
  event: EventFilterDefinition;
};
export type FilterType = keyof FilterTypeMap;

/**
 * Common set of fields that are reasonable to apply at the
 * top level of a Catalog
 */
export type AnyFilterDefinition = {
  title?: string | string[] | MatchOptions;
  access?: string | string[] | MatchOptions;
  owner?: string | string[] | MatchOptions;
  tags?: string | string[] | MatchOptions;
  created?: DateRange<number> | RelativeDate;
  modified?: DateRange<number> | RelativeDate;
  description?: string | string[] | MatchOptions;
  group?: string | string[] | MatchOptions;
  orgid?: string | string[] | MatchOptions;
  type?:
    | string
    | NamedContentFilter
    | Array<string | NamedContentFilter>
    | MatchOptions;
};

/**
 * Fields related to Content based searches
 */
export type ContentFilterDefinition = {
  access?: string | string[] | MatchOptions;
  owner?: string | string[] | MatchOptions;
  tags?: string | string[] | MatchOptions;
  created?: DateRange<number> | RelativeDate;
  description?: string | string[] | MatchOptions;
  snippet?: string | string[] | MatchOptions;
  group?: string | string[] | MatchOptions;
  id?: string | string[] | MatchOptions;
  modified?: DateRange<number> | RelativeDate;
  orgid?: string | string[] | MatchOptions;
  term?: string;
  title?: string | string[] | MatchOptions;
  type?:
    | string
    | NamedContentFilter
    | Array<string | NamedContentFilter>
    | MatchOptions;
  typekeywords?: string | string[] | MatchOptions;
  // this allows arbitrary keys, which Hub api supports
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
  /**
   * @internal
   * Support for complex OR queries; Used with various expansions
   */
  subFilters?: Array<ContentFilterDefinition | NamedContentFilter>;
};

// This type is used internally to Hub.js and is the
// "expanded" version of a ContentFilterDefinition
// which can then be serialized into Portal or Hub queries
export type ContentFilter = {
  access?: MatchOptions;
  created?: DateRange<number>;
  description?: MatchOptions;
  group?: MatchOptions;
  id?: MatchOptions;
  modified?: DateRange<number>;
  orgid?: MatchOptions;
  owner?: MatchOptions;
  tags?: MatchOptions;
  term?: string;
  title?: MatchOptions;
  type?: MatchOptions;
  typekeywords?: MatchOptions;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
  subFilters?: ContentFilter[];
};

// Short-cut strings for `type`
export type WellKnownContentFilters = {
  $dashboard: ContentFilterDefinition[];
  $dataset: ContentFilterDefinition[];
  $experience: ContentFilterDefinition[];
  $site: ContentFilterDefinition[];
  $storymap: ContentFilterDefinition[];
  $initiative: ContentFilterDefinition[];
  $document: ContentFilterDefinition[];
};

// Allows type-safe query "short-cuts"
export type NamedContentFilter = keyof WellKnownContentFilters;

export type UserFilterDefinition = {
  disabled?: boolean;
  email?: string | string[] | MatchOptions;
  firstname?: string | string[] | MatchOptions;
  fullname?: string | string[] | MatchOptions;
  groups?: string | string[] | MatchOptions;
  lastname?: string | string[] | MatchOptions;
  username?: string | string[] | MatchOptions;
};

export type GroupFilterDefinition = {
  access?: string | string[] | MatchOptions;
  created?: DateRange<number> | RelativeDate;
  id?: string | string[] | MatchOptions;
  isInvitationOnly: boolean;
  modified?: DateRange<number> | RelativeDate;
  orgid?: string | string[] | MatchOptions;
  searchUserAccess?: "groupMember" | "admin";
  tags?: string | string[] | MatchOptions;
  title?: string | string[] | MatchOptions;
  typekeywords?: string | string[] | MatchOptions;
};

export type EventFilterDefinition = {
  created?: DateRange<number> | RelativeDate;
  modified?: DateRange<number> | RelativeDate;
  orgid?: string | string[] | MatchOptions;
  title?: string | string[] | MatchOptions;
};

// User controlled refinements
// can be static or dynamic (based on stats from the api)
export type Facet = {
  // Label for the whole facet, shown in UI
  label: string;
  // what attribute this is powered by
  attribute?: string;
  // what type of facet is this
  type: "single-select" | "multi-select" | "date-range" | "histogram";
  // if static, contains the pre-defined options
  // if dynamic the code must construct these
  // from the API response
  options?: FacetOption[];
};

// Facet Options shown in the UI
export type FacetOption = {
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
};

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
export type Catalog = {
  /**
   * Title for the Gallery
   */
  title?: string;
  // Filter defines the "scope" of the Catalog
  // typically a set of groups or orgids
  filter: Filter<FilterType>;
  // sort options to be shown in the Gallery
  // if not specified, defaults are merged in
  sort?: SortOption[];
  // Sub Groups within the Catalog
  collections?: Collection[];
  // facets to use with all Filters
  facets?: Facet[];
};

export type SortOption = {
  // String to show in the UI. translated.
  label: string;
  // attribute to sort by at the API level
  attribute: string;
};

/**
 * A Filter that defines a subset of a Catalog, aka a Collection
 */
export type Collection = {
  label: string;
  filter: Filter<FilterType>;
  facets?: Facet[];
};

export type DateRange<T> = {
  type?: "date-range";
  from: T;
  to: T;
};

// Relative Date will be convertd to a real date-range
// at run-time
export type RelativeDate = {
  type: "relative-date";
  num: number;
  unit: "minutes" | "hours" | "days" | "weeks" | "months" | "years";
};

/**
 * Define how values should be matched
 */
export type MatchOptions = {
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
};

export type SearchOptions = {
  site?: string;
  authentication?: UserSession;
  sortField?: string;
  sortOrder?: "desc" | "asc";
  page?: string;
  aggregations?: string;
  bbox?: string;
  fields?: string;
  apis: Array<NamedApis | ApiDefinition>;
};

// Examples
// const opts: SearchOptions = {
//   authentication: new UserSession({}),
//   apis: ["arcgisQA", "hubQA"],
// };

// const entOpts: SearchOptions = {
//   authentication: new UserSession({}),
//   apis: [
//     {
//       type: "arcgis",
//       url: "https://rpubs16029.ags.esri.com/portal",
//     },
//   ],
// };

// const demoCatalog: Catalog = {
//   title: "Demo Catalog",
//   filter: {
//     filterType: "content",
//     group: ["1d1f24e8556642f49448f1c88b5a571b"],
//     type: {
//       not: [
//         "Code Attachment",
//         "Featured Items",
//         "Symbol Set",
//         "Color Set",
//         "Windows Viewer Add In",
//         "Windows Viewer Configuration",
//         "Map Area",
//         "Indoors Map Configuration",
//       ],
//     },
//     typekeywords: {
//       not: ["SMX", "MapAreaPackage"],
//     },
//   },
// };

export type WellKnownApis = {
  arcgis: ApiDefinition;
  arcgisQA: ApiDefinition;
  arcgisDEV: ApiDefinition;
  hub: ApiDefinition;
  hubQA: ApiDefinition;
  hubDEV: ApiDefinition;
};

export const SEARCH_APIS: WellKnownApis = {
  arcgis: {
    label: "ArcGIS Online",
    url: "https://www.arcgis.com",
    type: "arcgis",
  },
  arcgisQA: {
    label: "ArcGIS Online QAEXT",
    url: "https://qaext.arcgis.com",
    type: "arcgis",
  },
  arcgisDEV: {
    label: "ArcGIS Online DEVEXT",
    url: "https://devext.arcgis.com",
    type: "arcgis",
  },
  hub: {
    label: "ArcGIS Hub",
    url: "https://hub.arcgis.com/api",
    type: "arcgis-hub",
  },
  hubDEV: {
    label: "ArcGIS Hub DEV",
    url: "https://hubdev.arcgis.com/api",
    type: "arcgis-hub",
  },
  hubQA: {
    label: "ArcGIS Hub QA",
    url: "https://hubqa.arcgis.com/api",
    type: "arcgis-hub",
  },
};

// Allows type-safe query "short-cuts"
export type NamedApis = keyof WellKnownApis;

// Defines an API
export type ApiDefinition = {
  label?: string;
  // url of the api
  // - for "arcgis", /sharing/rest will be appended
  // - for "arcgis-hub", the /v3/search will be added
  url: string;
  // We can add types as we add support for more
  type: "arcgis" | "arcgis-hub";
  // Future - allows separate auth objects per API Definition
  authentication?: UserSession;
};
