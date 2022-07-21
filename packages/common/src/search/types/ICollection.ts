import { Filter, FilterType, IFilterGroup, ISortOption } from "./types";

/**
 * A Collection is a subset of a Catalog, but can be used independently
 * in Galleries
 */
export interface ICollection {
  // String to show in the UI. translated.
  label: string;
  // Unique key, used for query params and telemetry
  key: string;
  /**
   * Filter Type used in this collection
   */
  filterType?: FilterType;
  /**
   * Scope is a set of FilterGroups which define the limits of the Collection.
   * Typically it is just a set of group ids, but it may be arbitrarily complex.
   * If one was to "search the collection", this is the description of what would be returned.
   */
  scope?: Array<IFilterGroup<FilterType>>;
  /**
   * Specify the includes to be requested when working with this collection
   */
  include?: string[];

  // Default Sorts
  sortOption: ISortOption;

  // Filter defines the "scope" of the Collection, typically a set of groups or orgids
  // DEPRECATED: Use `scope`
  filter?: Filter<FilterType>;

  // Default query for the Collection
  // DEPRECATED: use `scope`
  defaultQuery?: string;
}
