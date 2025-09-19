import { IQuery } from "../../types/IHubCatalog";
import { IHubSearchResponse } from "../../types/IHubSearchResponse";
import { getNextOgcCallback } from "./getNextOgcCallback";
import { IOgcItemsResponse, ISearchOgcItemsOptions } from "./interfaces";
import { ogcItemToSearchResult } from "./ogcItemToSearchResult";
import { ogcItemToDiscussionPostResult } from "./ogcItemToDiscussionPostResult";
import { IHubSearchResult } from "../../types/IHubSearchResult";

export async function formatOgcItemsResponse(
  response: IOgcItemsResponse,
  url: string,
  originalQuery: IQuery,
  originalOptions: ISearchOgcItemsOptions
): Promise<IHubSearchResponse<IHubSearchResult>> {
  if (originalQuery.targetEntity === "discussionPost") {
    return formatDiscussionPostTargetEntityResponse(
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

async function formatDiscussionPostTargetEntityResponse(
  response: IOgcItemsResponse,
  url: string,
  originalQuery: IQuery,
  originalOptions: ISearchOgcItemsOptions
): Promise<IHubSearchResponse<IHubSearchResult>> {
  const formattedResults = await Promise.all(
    response.features.map((f) => ogcItemToDiscussionPostResult(f))
  );
  const next = getNextOgcCallback(
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

async function formatItemTargetEntityResponse(
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
  const next = getNextOgcCallback(
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
