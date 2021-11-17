// DEPRECATED: remove this at the next breaking change
export { ISearchResponse } from "@esri/hub-common";

/**
 * Defines a generic date range interface
 */
export interface IDateRange<T> {
  from?: T;
  to?: T;
}

/**
 * Defines an enum SortDirection
 */
export enum SortDirection {
  asc = "asc",
  desc = "desc",
}

/**
 * Defines a generic search request interface with parameterized filter and options
 * for different types of searches
 *
 * Filter used for filtering results
 * Options used for providing search options
 */
export interface ISearchRequest<T, U> {
  filter?: T;
  options?: U;
}
