import { RemoteServerError } from "../../../request";
import { cloneObject } from "../../../util";
import { IHubSearchOptions } from "../../types/IHubSearchOptions";
import { getQueryString } from "./getQueryString";

/**
 * Wrapper over fetch for performing common operations when executing a request to an OGC API, such as:
 * - Creating the query string
 * - URL encoding query string values
 * - Appending the ?target query param if needed
 * - Checking whether the response is ok
 * - Returning the .json() of the response body
 *
 * Note: the ?target query param is only appended if the target site (options.site) is _different_ from the
 * the site that will have its OGC API hit (url). This allows us to use the environment-level OGC API's url while
 * actually targeting a specific Hub Site's catalog. It's a powerful capability that significantly eases local development.
 *
 * Example: https://hubqa.arcgis.com/api/search/v1?target="my-actual-hub.hub.arcgis.com"
 *
 * We omit the ?target query when the site and url are the same because it would be redundant.
 *
 * Bad example: https://hubqa.arcgis.com/api/search/v1?target="hubqa.arcgis.com"
 * Good example: https://hubqa.arcgis.com/api/search/v1
 *
 * @param url the OGC API endpoint that should actually be hit
 * @param queryParams query params that should be serialized with the request (excluding `target`)
 * @param options options to customize the search, such as the site whose catalogs we're targeting
 * @returns the JSON response from the endpoint
 */
export async function ogcApiRequest(
  url: string,
  queryParams: Record<string, any>,
  options: IHubSearchOptions
) {
  const updatedQueryParams = cloneObject(queryParams);

  const targetDomain = new URL(options.site).hostname;
  const urlDomain = new URL(url).hostname;
  if (targetDomain !== urlDomain) {
    updatedQueryParams.target = targetDomain;
  }

  const withQueryString = url + getQueryString(updatedQueryParams);

  // use fetch override if any
  const _fetch = options.requestOptions?.fetch || fetch;
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
