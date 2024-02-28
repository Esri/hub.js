import { HubOgcSearchResultType } from "../../types/HubOgcSearchResultType";
import { IQuery } from "../../types/IHubCatalog";
import { IHubSearchOptions } from "../../types/IHubSearchOptions";
import { IHubSearchResponse } from "../../types/IHubSearchResponse";
import { IOgcItemsResponse } from "./interfaces";
import { searchOgcItems } from "./searchOgcItems";

export function getNextOgcCallback(
  response: IOgcItemsResponse,
  originalQuery: IQuery,
  originalOptions: IHubSearchOptions
): (params?: any) => Promise<IHubSearchResponse<HubOgcSearchResultType>> {
  const nextLink = response.links.find((l) => l.rel === "next");

  let callback = (): Promise<IHubSearchResponse<HubOgcSearchResultType>> =>
    null;
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
