import { IFilter } from "./IFilter";

/**
 * Group of Filters along with the operation used to "connect" them.
 * This allows for complex queries to be constructed.
 */
export interface IFilterGroup {
  /**
   * This is still needed so we can direct the
   * search to the correct api
   */
  filterType: "item" | "group" | "user" | "event";
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
