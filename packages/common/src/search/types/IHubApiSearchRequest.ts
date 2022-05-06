import { Filter, IHubSearchOptions, IFilterGroup, FilterType } from "./types";

/**
 * Structure for making Hub API Search Requests
 */
export interface IHubApiSearchRequest {
  /**
   * Can be a string like `term:"water"`, a single filter like `{ filterType: "item", term: "water" }`
   * or an array of IFilterGroups, which allows for complex queries.
   */
  q: string | Filter<FilterType> | Array<IFilterGroup<FilterType>>;
  /**
   * Search options like the number of results to return, sorting, aggregations etc
   */
  options: IHubSearchOptions;
}
