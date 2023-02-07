import { IQuery } from "../../types/IHubCatalog";
import { IHubSearchOptions } from "../../types/IHubSearchOptions";
import { IHubSearchResponse } from "../../types/IHubSearchResponse";
import { IHubSearchResult } from "../../types/IHubSearchResult";
import { getNextOgcCallback } from "./getNextOgcCallback";
import { IOgcItemsResponse } from "./interfaces";
import { ogcItemToSearchResult } from "./ogcItemToSearchResult";

/**
 * Transforms a search response from the OGC API into a
 * valid format IHubSearch response
 *
 * @param response search response from the OGC API
 * @returns a valid IHubSearch response
 */
export async function formatOgcItemsResponse(
  response: IOgcItemsResponse,
  originalQuery: IQuery,
  originalOptions: IHubSearchOptions
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
  const next = getNextOgcCallback(response, originalQuery, originalOptions);
  const nextLink = response.links.find((l) => l.rel === "next");

  return {
    total: response.numberMatched,
    results: formattedResults,
    hasNext: !!nextLink,
    next,
  };
}
