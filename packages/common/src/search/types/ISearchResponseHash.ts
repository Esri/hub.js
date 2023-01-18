import { IHubSearchResponse, IHubSearchResult } from ".";

/**
 * Response from a Catalog search operation where the responses for different collections
 * or entities are grouped into a single object.
 */

export interface ISearchResponseHash
  extends Record<string, IHubSearchResponse<IHubSearchResult>> {}
