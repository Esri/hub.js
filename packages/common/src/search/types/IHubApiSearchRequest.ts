import { IFilter } from "./IFilter";
import { IFilterGroup } from "./IFilterGroup";
import { IHubApiSearchOptions } from "./IHubApiSearchOptions";

/**
 * Structure for making Hub API Search Requests
 */
export interface IHubApiSearchRequest {
  /**
   * Can be a string like `term:"water"`, a single filter like `{term: "water"}`
   * or an array of IFilterGroups, which allows for complex queries.
   */
  q: string | IFilter | IFilterGroup[];
  /**
   * Search options like the number of results to return, sorting, aggregations etc
   */
  options: IHubApiSearchOptions;
}
