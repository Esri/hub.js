import { IQuery } from "../../types/IHubCatalog";
import { IHubSearchOptions } from "../../types/IHubSearchOptions";
import { IHubSearchResponse } from "../../types/IHubSearchResponse";
import { IHubSearchResult } from "../../types/IHubSearchResult";
import { IApiDefinition } from "../../types/types";
import { formatOgcItemsResponse } from "./formatOgcItemsResponse";
import { getOgcItemQueryParams } from "./getOgcItemQueryParams";
import { IOgcItemsResponse } from "./interfaces";
import { ogcApiRequest } from "./ogcApiRequest";

/**
 * Searchs for items within a specific collection in the OGC API
 *
 * @param query query to serialize
 * @param options options for the search
 * @returns
 */
export async function searchOgcItems(
  query: IQuery,
  options: IHubSearchOptions
): Promise<IHubSearchResponse<IHubSearchResult>> {
  const apiDefinition = options.api as IApiDefinition;
  const url = `${apiDefinition.url}/items`;
  const queryParams = getOgcItemQueryParams(query, options);

  const rawResponse: IOgcItemsResponse = await ogcApiRequest(
    url,
    queryParams,
    options
  );

  return formatOgcItemsResponse(rawResponse, query, options);
}
