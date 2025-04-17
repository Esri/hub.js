import {
  IHubSearchOptions,
  IHubSearchResponse,
  IHubSearchResult,
  IQuery,
} from "../types";
import { getOgcCollectionUrl } from "./hubSearchItemsHelpers/getOgcCollectionUrl";
import { ISearchOgcItemsOptions } from "./hubSearchItemsHelpers/interfaces";
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
  return searchOgcItems(url, query, options as ISearchOgcItemsOptions);
}
