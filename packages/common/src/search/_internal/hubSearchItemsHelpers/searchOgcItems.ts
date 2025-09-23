import { IQuery } from "../../types/IHubCatalog";
import { IHubSearchResponse } from "../../types/IHubSearchResponse";
import { IHubSearchResult } from "../../types/IHubSearchResult";
import { getOgcItemQueryParams } from "./getOgcItemQueryParams";
import { IOgcItemsResponse, ISearchOgcItemsOptions } from "./interfaces";
import { ogcApiRequest } from "./ogcApiRequest";
import { ogcItemToSearchResult } from "./ogcItemToSearchResult";
import { ogcItemToDiscussionPostResult } from "./ogcItemToDiscussionPostResult";

export const _INTERNAL_FNS = {
  searchOgcItems,
  formatOgcItemsResponse,
  formatDiscussionPostTargetEntityResponse,
  formatItemTargetEntityResponse,
  getNextOgcCallback,
};

export async function searchOgcItems(
  url: string,
  query: IQuery,
  options: ISearchOgcItemsOptions
): Promise<IHubSearchResponse<IHubSearchResult>> {
  const queryParams = getOgcItemQueryParams(query, options);

  const rawResponse = (await ogcApiRequest(
    url,
    queryParams,
    options
  )) as IOgcItemsResponse;

  return _INTERNAL_FNS.formatOgcItemsResponse(rawResponse, url, query, options);
}

export async function formatOgcItemsResponse(
  response: IOgcItemsResponse,
  url: string,
  originalQuery: IQuery,
  originalOptions: ISearchOgcItemsOptions
): Promise<IHubSearchResponse<IHubSearchResult>> {
  if (originalQuery.targetEntity === "discussionPost") {
    return _INTERNAL_FNS.formatDiscussionPostTargetEntityResponse(
      response,
      url,
      originalQuery,
      originalOptions
    );
  }

  return formatItemTargetEntityResponse(
    response,
    url,
    originalQuery,
    originalOptions
  );
}

export async function formatDiscussionPostTargetEntityResponse(
  response: IOgcItemsResponse,
  url: string,
  originalQuery: IQuery,
  originalOptions: ISearchOgcItemsOptions
): Promise<IHubSearchResponse<IHubSearchResult>> {
  const formattedResults = await Promise.all(
    response.features.map((f) => ogcItemToDiscussionPostResult(f))
  );
  const next = _INTERNAL_FNS.getNextOgcCallback(
    response,
    url,
    originalQuery,
    originalOptions
  );
  const nextLink = response.links.find((l) => l.rel === "next");

  return {
    total: response.numberMatched,
    results: formattedResults,
    hasNext: !!nextLink,
    next,
  };
}

export async function formatItemTargetEntityResponse(
  response: IOgcItemsResponse,
  url: string,
  originalQuery: IQuery,
  originalOptions: ISearchOgcItemsOptions
): Promise<IHubSearchResponse<IHubSearchResult>> {
  const formattedResults = await Promise.all(
    response.features.map((f) =>
      ogcItemToSearchResult(
        f,
        originalOptions.include,
        originalOptions.requestOptions
      )
    )
  );
  const next = _INTERNAL_FNS.getNextOgcCallback(
    response,
    url,
    originalQuery,
    originalOptions
  );
  const nextLink = response.links.find((l) => l.rel === "next");

  return {
    total: response.numberMatched,
    results: formattedResults,
    hasNext: !!nextLink,
    next,
  };
}

export function getNextOgcCallback(
  response: IOgcItemsResponse,
  url: string,
  originalQuery: IQuery,
  originalOptions: ISearchOgcItemsOptions
): (params?: any) => Promise<IHubSearchResponse<IHubSearchResult>> {
  const nextLink = response.links.find((l) => l.rel === "next");

  let callback = (): Promise<IHubSearchResponse<IHubSearchResult>> => null;
  if (nextLink) {
    callback = (): Promise<IHubSearchResponse<IHubSearchResult>> => {
      const nextUrl = new URL(nextLink.href);
      const start = +nextUrl.searchParams.get("startindex");
      const nextOptions: ISearchOgcItemsOptions = { ...originalOptions, start };
      return _INTERNAL_FNS.searchOgcItems(url, originalQuery, nextOptions);
    };
  }

  return callback;
}
