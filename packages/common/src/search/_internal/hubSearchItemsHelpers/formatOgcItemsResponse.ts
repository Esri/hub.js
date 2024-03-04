import { IQuery } from "../../types/IHubCatalog";
import { IHubSearchOptions } from "../../types/IHubSearchOptions";
import { IHubSearchResponse } from "../../types/IHubSearchResponse";
import { getNextOgcCallback } from "./getNextOgcCallback";
import { IOgcItemsResponse } from "./interfaces";
import { ogcItemToSearchResult } from "./ogcItemToSearchResult";
import { ogcItemToDiscussionPostResult } from "./ogcItemToDiscussionPostResult";
import { HubOgcSearchResultType } from "../../types/HubOgcSearchResultType";

export async function formatOgcItemsResponse(
  response: IOgcItemsResponse,
  originalQuery: IQuery,
  originalOptions: IHubSearchOptions
): Promise<IHubSearchResponse<HubOgcSearchResultType>> {
  if (originalQuery.targetEntity === "discussionPost") {
    return formatDiscussionPostTargetEntityResponse(
      response,
      originalQuery,
      originalOptions
    );
  }

  return formatItemTargetEntityResponse(
    response,
    originalQuery,
    originalOptions
  );
}

async function formatDiscussionPostTargetEntityResponse(
  response: IOgcItemsResponse,
  originalQuery: IQuery,
  originalOptions: IHubSearchOptions
): Promise<IHubSearchResponse<HubOgcSearchResultType>> {
  const formattedResults = await Promise.all(
    response.features.map((f) => ogcItemToDiscussionPostResult(f))
  );
  const next = getNextOgcCallback(response, originalQuery, originalOptions);
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
  originalQuery: IQuery,
  originalOptions: IHubSearchOptions
): Promise<IHubSearchResponse<HubOgcSearchResultType>> {
  const formattedResults = await Promise.all(
    response.features.map((f) =>
      ogcItemToSearchResult(
        f,
        originalOptions.include,
        originalOptions.requestOptions
      )
    )
  );
  const next = getNextOgcCallback(response, originalQuery, originalOptions);
  const nextLink = response.links.find((l) => l.rel === "next");

  return {
    total: response.numberMatched,
    results: formattedResults,
    hasNext: !!nextLink,
    next,
  };
}
