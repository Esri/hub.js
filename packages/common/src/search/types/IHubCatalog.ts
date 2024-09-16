import { CORNERS, DROP_SHADOWS } from "../../core/schemas/shared/enums";
import { WellKnownCollection } from "../wellKnownCatalog";

export interface IHubCatalog {
  /**
   * Title for the Gallery
   */
  title?: string;
  /**
   * Optional Emoji to show in the UI
   */
  emojii?: string;
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
  /**
   * Hashes to verify the integrity of the catalog
   * Only verified when the catalog is loaded into the editor
   * If the hashes do not match, the catalog will not be loaded
   * and the user will simply have the option to reset the catalog
   */
  integrity?: {
    scopes: string;
    collections: string;
  };
  /**
   * Optional entries to control a catalog's appearance in the UI
   */
  displayConfig?: IGalleryDisplayConfig;
}

export interface ICatalogScope extends Partial<Record<EntityType, IQuery>> {}

/**
 * Configuration for how to display a gallery. This can apply to any gallery's display,
 * including a catalog, a collection, or a gallery card.
 */
export interface IGalleryDisplayConfig {
  /**
   * Optional override prop needed for things like collections; when true, the collection will utilize
   * its own display configuration instead of the catalog's default display configuration
   */
  override?: boolean;

  /**
   * Whether or not the current item is hidden in the gallery display. i.e.
   * if this is true on a collection's display config, that collection will not be displayed in the gallery.
   */
  hidden?: boolean;

  /**
   * List of IFacet keys that will be used to build IFacets and display facets in the gallery experience
   */
  facets?: string[];

  /**
   * Determines the type of corners for the cards in the gallery
   */
  corners?: CORNERS;

  /**
   * Determines the type of drop shadow for the cards in the gallery
   */
  dropShadow?: DROP_SHADOWS;

  /**
   * Determines whether to display a thumbnail or an icon for the cards in the gallery
   */
  image?: "thumbnail" | "icon";

  /**
   * Future display props can be added here (heading size, possible gallery layouts, etc.)
   */
}

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
  /**
   * Optional entries to control a collection's appearance in the UI
   */
  displayConfig?: IGalleryDisplayConfig;
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
  | "discussionPost"
  | "event"
  | "eventAttendee";

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
