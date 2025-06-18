import { IQuery } from "../../types/IHubCatalog";
import { IHubSearchOptions } from "../../types/IHubSearchOptions";
import { IHubSearchResponse } from "../../types/IHubSearchResponse";
import { IHubSearchResult } from "../../types/IHubSearchResult";
import { formatOgcAggregationsResponse } from "./formatOgcAggregationsResponse";
import { getOgcAggregationQueryParams } from "./getOgcAggregationQueryParams";
import { getOgcCollectionUrl } from "./getOgcCollectionUrl";
import { IOgcAggregationsResponse } from "./interfaces";
import { ogcApiRequest } from "./ogcApiRequest";

export async function searchOgcAggregations(
  query: IQuery,
  options: IHubSearchOptions
): Promise<IHubSearchResponse<IHubSearchResult>> {
  const url = `${getOgcCollectionUrl(query, options)}/aggregations`;
  const queryParams = getOgcAggregationQueryParams(query, options);

  const rawResponse = (await ogcApiRequest(
    url,
    queryParams,
    options
  )) as IOgcAggregationsResponse;

  return formatOgcAggregationsResponse(rawResponse);
}
