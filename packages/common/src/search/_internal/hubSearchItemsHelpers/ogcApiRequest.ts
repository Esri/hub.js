import { RemoteServerError } from "../../../request";
import { IHubSearchOptions } from "../../types/IHubSearchOptions";
import { getQueryString } from "./getQueryString";

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
