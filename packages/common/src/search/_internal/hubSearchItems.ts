import {
  IHubSearchOptions,
  IHubSearchResponse,
  IHubSearchResult,
  IQuery,
} from "../types";
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
  return options.aggFields?.length
    ? searchOgcAggregations(query, options)
    : searchOgcItems(query, options);
}
