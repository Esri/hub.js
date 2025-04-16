import { IQuery } from "../../types/IHubCatalog";
import { IHubSearchOptions } from "../../types/IHubSearchOptions";
import { IHubSearchResponse } from "../../types/IHubSearchResponse";
import { IHubSearchResult } from "../../types/IHubSearchResult";
import { formatOgcItemsResponse } from "./formatOgcItemsResponse";
import { getOgcItemQueryParams } from "./getOgcItemQueryParams";
import { IOgcItemsResponse } from "./interfaces";
import { ogcApiRequest } from "./ogcApiRequest";

export async function searchOgcItems(
  url: string,
  query: IQuery,
  options: IHubSearchOptions
): Promise<IHubSearchResponse<IHubSearchResult>> {
  const queryParams = getOgcItemQueryParams(query, options);

  const rawResponse: IOgcItemsResponse = await ogcApiRequest(
    url,
    queryParams,
    options
  );

  return formatOgcItemsResponse(rawResponse, url, query, options);
}
