import { RemoteServerError } from "../../../request";
import { IHubSearchOptions } from "../../types/IHubSearchOptions";
import { getQueryString } from "./getQueryString";

/**
 * Wrapper for making a request to a site's OGC API
 *
 * @param url fully qualified OGC API endpoint to hit
 * @param queryParams query params to be appended
 * @param options options to be included with the request
 * @returns
 */
export async function ogcApiRequest(
  url: string,
  queryParams: Record<string, any>,
  options: IHubSearchOptions
) {
  // use fetch override if any
  const _fetch = options.requestOptions?.fetch || fetch;
  const withQueryString = url + getQueryString(queryParams);
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
