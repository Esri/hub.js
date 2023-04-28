import { IApiDefinition } from "../../types";
import { IQuery } from "../../types/IHubCatalog";
import { IHubSearchOptions } from "../../types/IHubSearchOptions";
import { IHubSearchResponse } from "../../types/IHubSearchResponse";
import { IHubSearchResult } from "../../types/IHubSearchResult";
import { formatOgcItemsResponse } from "./formatOgcItemsResponse";
import { getOgcCollectionUrl } from "./getOgcCollectionUrl";
import { getOgcItemQueryParams } from "./getOgcItemQueryParams";
import { IOgcItemsResponse } from "./interfaces";
import { ogcApiRequest } from "./ogcApiRequest";

export async function searchOgcItems(
  query: IQuery,
  options: IHubSearchOptions,
  api: IApiDefinition
): Promise<IHubSearchResponse<IHubSearchResult>> {
  const url = `${getOgcCollectionUrl(query, api)}/items`;
  const queryParams = getOgcItemQueryParams(query, options);

  const rawResponse: IOgcItemsResponse = await ogcApiRequest(
    url,
    queryParams,
    options
  );

  return formatOgcItemsResponse(rawResponse, query, options, api);
}
