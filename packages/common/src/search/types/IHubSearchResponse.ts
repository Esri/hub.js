import { IMessage } from "../../types/IMessage";
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
  /**
   * Total number of matches for the query
   */
  total: number;
  /**
   * Array if results
   */
  results: T[];
  /**
   * Can more results be fetched?
   */
  hasNext: boolean;
  /**
   * Function that fetches the next page of results
   */
  next: (params?: any) => Promise<IHubSearchResponse<T>>;
  /**
   * Array of requested aggregations
   */
  aggregations?: IHubAggregation[];

  /**
   * Array of messages / warnings
   */
  messages?: IMessage[];
}
