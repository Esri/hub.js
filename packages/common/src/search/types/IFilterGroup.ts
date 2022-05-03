import { IFilter } from "./IFilter";

/**
 * Group of Filters along with the operation used to "connect" them.
 * This allows for complex queries to be constructed.
 */
export interface IFilterGroup {
  /**
   * Operation defining how to "connect" the individual filters
   * when constructing the API level queries
   */
  operation?: "AND" | "OR";
  /**
   * Array of individual filters
   */
  filters: IFilter[];
}
