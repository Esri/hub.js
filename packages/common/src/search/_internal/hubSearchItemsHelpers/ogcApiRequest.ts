import { RemoteServerError } from "../../../request";
import { cloneObject } from "../../../util";
import { IOgcAggregationQueryParams } from "./getOgcAggregationQueryParams";
import { IOgcItemQueryParams } from "./getOgcItemQueryParams";
import { getQueryString } from "./getQueryString";
import { ISearchOgcItemsOptions } from "./interfaces";

/**
 * Wrapper over fetch for performing common operations when executing a request to an OGC API, such as:
 * - Creating the query string
 * - URL encoding query string values
 * - Checking whether the response is ok
 * - Returning the .json() of the response body
 *
 * @param url the OGC API endpoint that should actually be hit
 * @param queryParams query params that should be serialized with the request
 * @param options options to customize the search
 * @returns the JSON response from the endpoint
 */
export async function ogcApiRequest(
  url: string,
  queryParams: IOgcItemQueryParams | IOgcAggregationQueryParams,
  options: ISearchOgcItemsOptions
): Promise<unknown> {
  const updatedQueryParams = cloneObject(queryParams);
  const withQueryString = url + getQueryString(updatedQueryParams);

  // use fetch override if any
  const _fetch = options.requestOptions.fetch || fetch;
  const response = await _fetch(withQueryString, { method: "GET" });

  if (!response.ok) {
    throw new RemoteServerError(
      response.statusText,
      withQueryString,
      response.status
    );
  }

  return response.json();
}
