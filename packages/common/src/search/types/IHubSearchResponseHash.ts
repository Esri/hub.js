import { IHubSearchResponse } from "./IHubSearchResponse";
import { IHubSearchResult } from "./IHubSearchResult";

/**
 * Response from a Catalog search operation where the responses for different collections
 * or entities are grouped into a single object.
 */

export type ISearchResponseHash = Record<
  string,
  IHubSearchResponse<IHubSearchResult>
>;
