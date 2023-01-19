import { getHubApiUrl } from "./api";
import { IHubRequestOptions } from "./types";
import { buildUrl } from "./urls/build-url";

/**
 * remote server error
 */
export class RemoteServerError extends Error {
  status: number;
  url: string;

  constructor(message: string, url: string, status: number) {
    super(message);
    this.status = status;
    this.url = url;
  }
}

/**
 * ```js
 * import { hubApiRequest } from "@esri/hub-common";
 * //
 * hubApiRequest(
 *   "/datasets",
 *   requestOptions
 * })
 *   .then(response);
 * ```
 * make a request to the Hub API
 * @param route API route
 * @param requestOptions request options
 */
export function hubApiRequest(
  route: string,
  requestOptions?: IHubRequestOptions
) {
  // merge in default request options
  const options: IHubRequestOptions = {
    // why do we default to GET w/ our API?
    httpMethod: "GET",
    ...requestOptions,
  };
  // use fetch override if any
  const _fetch = options.fetch || fetch;
  // merge in default headers
  const headers = {
    "Content-Type": "application/json",
    ...options.headers,
  };
  // build query params/body based on requestOptions.params
  let query;
  let body;
  if (options.httpMethod === "GET") {
    // pass params in query string
    query = options.params;
  } else {
    // pass params in request body
    body = JSON.stringify(options.params);
  }
  // build Hub API URL
  const url = buildUrl({
    host: getHubApiUrl(options),
    path: `/api/v3/${route}`.replace(/\/\//g, "/"),
    query,
  });
  return _fetch(url, {
    method: options.httpMethod,
    headers,
    body,
  }).then((resp) => {
    if (resp.ok) {
      return resp.json();
    } else {
      throw new RemoteServerError(resp.statusText, url, resp.status);
    }
  });
}
