import {
  CARD_TITLE_TAGS,
  CORNERS,
  DROP_SHADOWS,
} from "../../core/schemas/shared/enums";
import { WellKnownCollection } from "../wellKnownCatalog";

export type CatalogType = "content" | "exclusion";

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

  type?: CatalogType;
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
   * Optional display configuration to control a catalog's appearance in the UI
   */
  displayConfig?: IGalleryDisplayConfig;
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

  /**
   * Optional display configuration to control a collection's appearance in the UI
   */
  displayConfig?: IGalleryDisplayConfig;
}

export const targetEntities = [
  "item",
  "group",
  "user",
  "portalUser",
  "communityUser",
  "groupMember",
  "event",
  "channel",
  "discussionPost",
  "eventAttendee",
] as const;
export type EntityType = (typeof targetEntities)[number];

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

/**
 * Configuration for how to display a gallery. This can apply to a catalog's display,
 * a collection's display, the gallery-card's display, etc.
 */
export interface IGalleryDisplayConfig {
  /**s
   * Used for collections to determine if the collection should be hidden in the gallery.
   * If this is true on a collection's display config, that collection will not be shown in the gallery.
   */
  hidden?: boolean;
  layout?: "list" | "grid" | "map" | "table" | "calendar" | "compact";
  cardTitleTag?: CARD_TITLE_TAGS;
  showThumbnail?: "show" | "hide" | "grid";
  corners?: CORNERS;
  shadow?: DROP_SHADOWS;
  showLinkButton?: boolean;
  linkButtonStyle?: "solid" | "outline" | "outline-fill" | "transparent";
  linkButtonText?: string;
  sort?: "relevance" | "title" | "created" | "modified";
  filters?: Array<{
    key:
      | "location"
      | "type"
      | "source"
      | "event-occurrence"
      | "event-from"
      | "event-attendance"
      | "tags"
      | "categories"
      | "license"
      | "modified"
      | "access"
      | "group-role"
      | "group-type"
      | "group-access"
      | "event-access"
      | "event-date";
    hidden: boolean;
    label?: string;
  }>;
}
