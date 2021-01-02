/**
 * Interface for returning a page state for paginated search results,
 * using a cursor string to denote pagination
 *
 * Note: This is subject to change or be extended as work continues for unified search interface
 * for content, users, etc.
 *
 * @param cursor - string representation of page state, should be used to get next page
 * @param total - total number of results
 * @param hasNextPage - boolean used to check if more results exist
 */
export interface IPageResponse {
  cursor: string;
  total: number;
  hasNextPage: boolean;
}
