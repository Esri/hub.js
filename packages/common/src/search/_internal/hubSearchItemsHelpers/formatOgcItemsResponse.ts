import { IApiDefinition } from "../../types";
import { IQuery } from "../../types/IHubCatalog";
import { IHubSearchOptions } from "../../types/IHubSearchOptions";
import { IHubSearchResponse } from "../../types/IHubSearchResponse";
import { IHubSearchResult } from "../../types/IHubSearchResult";
import { getNextOgcCallback } from "./getNextOgcCallback";
import { IOgcItemsResponse } from "./interfaces";
import { ogcItemToSearchResult } from "./ogcItemToSearchResult";

export async function formatOgcItemsResponse(
  response: IOgcItemsResponse,
  originalQuery: IQuery,
  originalOptions: IHubSearchOptions,
  api: IApiDefinition
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
    originalQuery,
    originalOptions,
    api
  );
  const nextLink = response.links.find((l) => l.rel === "next");

  return {
    total: response.numberMatched,
    results: formattedResults,
    hasNext: !!nextLink,
    next,
  };
}
