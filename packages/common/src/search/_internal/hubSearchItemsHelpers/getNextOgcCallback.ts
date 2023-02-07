import { IQuery } from "../../types/IHubCatalog";
import { IHubSearchOptions } from "../../types/IHubSearchOptions";
import { IHubSearchResponse } from "../../types/IHubSearchResponse";
import { IHubSearchResult } from "../../types/IHubSearchResult";
import { IOgcItemsResponse } from "./interfaces";
import { searchOgcItems } from "./searchOgcItems";

/**
 * Returns a callback function with pre-bound arguments for fetching the next page of results.
 * If there is no next page, the callback will resolve to null
 *
 * @param response The response to generate the callback for
 * @param originalQuery  the query that will be modified / bound to the next callback
 * @param originalOptions the options that will be modified / bound to the next callback
 * @returns the callback with pre-bound arguments
 */
export function getNextOgcCallback(
  response: IOgcItemsResponse,
  originalQuery: IQuery,
  originalOptions: IHubSearchOptions
): (params?: any) => Promise<IHubSearchResponse<IHubSearchResult>> {
  const nextLink = response.links.find((l) => l.rel === "next");

  let callback = (): Promise<IHubSearchResponse<IHubSearchResult>> => null;
  if (nextLink) {
    callback = () => {
      const nextUrl = new URL(nextLink.href);
      const start = +nextUrl.searchParams.get("startindex");
      const nextOptions: IHubSearchOptions = { ...originalOptions, start };
      return searchOgcItems(originalQuery, nextOptions);
    };
  }

  return callback;
}
