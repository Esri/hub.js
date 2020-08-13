import { IHubRequestOptions, buildUrl } from "./index";

/**
 * remote server error
 */
export class RemoteServerError extends Error {
  status: number;
  url: string;

  constructor(message: string, url: string, status: number) {
    // Istanbul erroneously treats extended class constructors as an uncovered branch: https://github.com/gotwarlost/istanbul/issues/690
    /* istanbul ignore next */
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
    ...{
      hubApiUrl: "https://opendata.arcgis.com/api/v3/",
      httpMethod: "POST",
      fetch
    },
    ...requestOptions
  };
  // merge in default headers
  const headers = {
    ...{ "Content-Type": "application/json" },
    ...options.headers
  };
  // TODO: build query params/body based on requestOptions.params?
  // build Hub API URL
  const url = buildUrl({
    host: options.hubApiUrl,
    path: route
  });
  return options
    .fetch(url, {
      method: options.httpMethod,
      headers
      // body: JSON.stringify(body)
    })
    .then(resp => {
      if (resp.ok) {
        return resp.json();
      } else {
        throw new RemoteServerError(resp.statusText, url, resp.status);
      }
    });
}
