import {
  IHubSearchOptions,
  IHubSearchResponse,
  IHubSearchResult,
  IQuery,
} from "../types";
import { expandPortalQuery } from "../utils";
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
  const expanded = expandPortalQuery(query);
  delete expanded.collection;
  if (options.aggFields?.length) {
    return searchOgcAggregations(expanded, options);
  }
  const url = `${getOgcCollectionUrl(expanded, options)}/items`;
  return searchOgcItems(url, expanded, options as ISearchOgcItemsOptions);
}
