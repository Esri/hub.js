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
}

export interface ICatalogScope extends Record<EntityType, IQuery> {}

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
}

export type EntityType = "item" | "group" | "user" | "groupMember" | "event";

export interface IQuery {
  /**
   * What entity is this query targeting. This is used internally to
   * ensure we query the correct API
   */
  targetEntity: EntityType;
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

export interface IFilter {
  /**
   * Operation used to combine the predicates
   */
  operation?: "AND" | "OR";
  /**
   * Predicates
   */
  predicates: IPredicate[];
}

export interface IPredicate extends Record<string, any> {}
