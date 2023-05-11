import { RemoteServerError } from "../../../request";
import { cloneObject } from "../../../util";
import { IHubSearchOptions } from "../../types/IHubSearchOptions";
import { getQueryString } from "./getQueryString";

export async function ogcApiRequest(
  url: string,
  queryParams: Record<string, any>,
  options: IHubSearchOptions
) {
  const updatedQueryParams = cloneObject(queryParams);

  const targetDomain = new URL(options.site).hostname;
  const umbrellaDomain = new URL(options.requestOptions.hubApiUrl).hostname;
  if (targetDomain !== umbrellaDomain) {
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
