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
  desc = "desc"
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

/**
 * Defines a generic search response interface with parameterized result type
 * for different types of searches
 *
 * total - total number of results
 * results - potentially paginated list of results
 * hasNext - boolean flag for if there are any more pages ofresults
 * next - invokable function for obtaining next page of results
 */
export interface ISearchResponse<T> {
  total: number;
  results: T[];
  hasNext: boolean;
  next: (params?: any) => Promise<ISearchResponse<T>>;
}
