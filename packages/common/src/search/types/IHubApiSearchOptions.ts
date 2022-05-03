/**
 * Search Options for the Hub API
 */
export interface IHubApiSearchOptions {
  /**
   * Maxmium number of results to return on a single request.
   */
  num: number;
  /**
   * Offset from the begining of a result set; used to implement paging of results
   */
  start: number;
  /**
   * Field to sort on
   */
  sortField?: string;
  /**
   * Direction of the sort
   */
  sortOrder?: "asc" | "desc";
}
