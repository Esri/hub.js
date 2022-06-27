import { IFacet } from "./IFacet";
import { IHubAggregation } from "./IHubAggregation";

/**
 * Defines a generic search response interface with parameterized result type
 * for different types of searches
 *
 * total - total number of results
 * results - potentially paginated list of results
 * hasNext - boolean flag for if there are any more pages ofresults
 * next - invokable function for obtaining next page of results
 */
export interface IHubSearchResponse<T> {
  total: number;
  results: T[];
  hasNext: boolean;
  next: (params?: any) => Promise<IHubSearchResponse<T>>;
  aggregations?: IHubAggregation[];
  // DEPRECATED - hub.js no longer computes facets; consumers need to
  // construct them from aggregations
  facets?: IFacet[];
}
