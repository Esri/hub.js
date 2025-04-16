import {
  IHubSearchOptions,
  IHubSearchResponse,
  IHubSearchResult,
  IQuery,
} from "../types";
import { getOgcCollectionUrl } from "./hubSearchItemsHelpers/getOgcCollectionUrl";
import { searchOgcAggregations } from "./hubSearchItemsHelpers/searchOgcAggregations";
import { searchOgcItems } from "./hubSearchItemsHelpers/searchOgcItems";

/**
 * @private
 * Execute item search against the Hub API
 * @param query
 * @param options
 * @returns
 */
export async function hubSearchItems(
  query: IQuery,
  options: IHubSearchOptions
): Promise<IHubSearchResponse<IHubSearchResult>> {
  if (options.aggFields?.length) {
    return searchOgcAggregations(query, options);
  }
  const url = `${getOgcCollectionUrl(query, options)}/items`;
  // TODO: refactor searchOgcItems() to respect the url that is passed in
  // also, create a new options object that can be passed in since we don't need IHubSearchOptions
  // Then make sure that searchAssociatedContent() just delegates to searchOgcItems()
  return searchOgcItems(url, query, options);
}
