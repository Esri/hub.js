import { IQuery } from "../../types/IHubCatalog";
import { IHubSearchResponse } from "../../types/IHubSearchResponse";
import { IHubSearchResult } from "../../types/IHubSearchResult";
import { IOgcItemsResponse, ISearchOgcItemsOptions } from "./interfaces";
import { searchOgcItems } from "./searchOgcItems";

export function getNextOgcCallback(
  response: IOgcItemsResponse,
  url: string,
  originalQuery: IQuery,
  originalOptions: ISearchOgcItemsOptions
): (params?: any) => Promise<IHubSearchResponse<IHubSearchResult>> {
  const nextLink = response.links.find((l) => l.rel === "next");

  let callback = (): Promise<IHubSearchResponse<IHubSearchResult>> => null;
  if (nextLink) {
    callback = () => {
      const nextUrl = new URL(nextLink.href);
      const start = +nextUrl.searchParams.get("startindex");
      const nextOptions: ISearchOgcItemsOptions = { ...originalOptions, start };
      return searchOgcItems(url, originalQuery, nextOptions);
    };
  }

  return callback;
}
