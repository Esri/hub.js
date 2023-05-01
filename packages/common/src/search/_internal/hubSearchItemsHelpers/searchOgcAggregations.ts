import { IApiDefinition } from "../../types";
import { IQuery } from "../../types/IHubCatalog";
import { IHubSearchOptions } from "../../types/IHubSearchOptions";
import { IHubSearchResponse } from "../../types/IHubSearchResponse";
import { IHubSearchResult } from "../../types/IHubSearchResult";
import { formatOgcAggregationsResponse } from "./formatOgcAggregationsResponse";
import { getOgcAggregationQueryParams } from "./getOgcAggregationQueryParams";
import { getOgcCollectionUrl } from "./getOgcCollectionUrl";
import { ogcApiRequest } from "./ogcApiRequest";

export async function searchOgcAggregations(
  query: IQuery,
  options: IHubSearchOptions,
  api: IApiDefinition
): Promise<IHubSearchResponse<IHubSearchResult>> {
  const url = `${getOgcCollectionUrl(query, api)}/aggregations`;
  const queryParams = getOgcAggregationQueryParams(query, options);

  const rawResponse = await ogcApiRequest(url, queryParams, options);

  return formatOgcAggregationsResponse(rawResponse);
}
