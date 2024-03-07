import { WellKnownCollection } from "../wellKnownCatalog";

export interface IHubCatalog {
  /**
   * Title for the Gallery
   */
  title?: string;
  /**
   * Filter defines the "scopes" of the Catalog, on a per entity type basis
   */
  scopes?: ICatalogScope;
  /**
   * Collections within the Catalog
   */
  collections?: IHubCollection[];
  /**
   * Schema Version
   */
  schemaVersion: number;
}

export interface ICatalogScope extends Partial<Record<EntityType, IQuery>> {}

export interface IHubCollection {
  /**
   * String to show in the UI. translated.
   */
  label: string;
  /**
   * Unique key, used for query params and telemetry
   */
  key: string;
  /**
   * Specify the includes to be requested when working with this collection
   */
  include?: string[];
  /**
   * Default query for the Collection
   */
  scope: IQuery;
  /**
   * Default sort field for the Collection
   */
  sortField?: string;
  /**
   * Default sort direction for the Collection
   */
  sortDirection?: "asc" | "desc";
  /**
   * What entity is this query targeting. This is used internally to
   * ensure we query the correct API
   */
  targetEntity: EntityType;
}

export type EntityType =
  | "item"
  | "group"
  | "user"
  | "portalUser"
  | "communityUser"
  | "groupMember"
  | "event"
  | "channel"
  | "discussionPost";
/**
 * @private
 *
 * This interface wraps IHubCollection and provides additional fields
 * for collection configuration. It is the actual interface used when
 * when storing an entity's catalog collections.
 */
export interface IHubCollectionPersistance extends IHubCollection {
  hidden?: boolean;
}

/**
 * IQuery is the fundamental unit used to execute a search. By composing
 * `Filter`'s and `IPredicate`s, we can express very complex queries
 *
 *  The [Hub Search Guide](/hub.js/guides/hub-search) contains many examples.
 */
export interface IQuery {
  /**
   * What entity is this query targeting. This is used internally to
   * ensure we query the correct API
   */
  targetEntity: EntityType;
  /**
   * An id for a well known collection that the query should use.
   *
   * Note: The collection's filters will be used _in addition_ to
   * any existing filters within the IQuery.filters array
   */
  collection?: WellKnownCollection;
  /**
   * Filters that make up the query
   */
  filters: IFilter[];
  /**
   * Additional properties. Useful for groupMember queries
   * where we need to send in the groupId to construct the url
   */
  properties?: Record<string, any>;
}

/**
 * Queries are composed from a set of `IFilter` objects.
 * All Filters are combined via `AND`, but the predicates
 * that make up a filter are combined using the specified `operation`
 * thereby allowing queries to be composed dynamically and deterministically.
 *
 *  The [Hub Search Guide](/hub.js/guides/hub-search) contains many examples.
 */
export interface IFilter {
  /**
   * Operation used to combine the predicates
   */
  operation?: "AND" | "OR";
  /**
   * Predicates which specify the properties and values to match in the search
   */
  predicates: IPredicate[];
}

/**
 * An `IPredicate` is a set of key/value pairs
 * that can be evaluated into a boolean value in a search system.
 *
 * For example, a predicate like
 * ```js
 * const p = { type: "Web Map"}
 * ```
 * equates to a search `where type = "Web Map"`
 *
 * Properties can be `string`, `string[]`, `IMatchOption`,
 * `IDateRange<number>` or  `IRelativeDate`. Some properties are booleans
 * and other properties have a limited set of values that can be passed.
 *
 * The [Hub Search Guide](/hub.js/guides/hub-search) contains a list
 * of properties that can be sent to the ArcGIS Portal API.
 */
export interface IPredicate {
  /**
   * This is intentionally loosely typed to allow flexibility
   * in implementation without constantly updates to this interface
   */
  [key: string]: any;
}
