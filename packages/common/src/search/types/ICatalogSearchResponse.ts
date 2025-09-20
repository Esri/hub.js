import { ISearchResponseHash } from "./IHubSearchResponseHash";

/**
 * Response from a search operation on a Catalog
 */
export interface ICatalogSearchResponse {
  catalogTitle: string;
  collectionResults: ISearchResponseHash;
  scopeResults?: ISearchResponseHash;
}
