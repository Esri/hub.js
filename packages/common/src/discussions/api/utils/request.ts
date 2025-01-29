import { buildUrl } from "../../../urls";
import { RemoteServerError as _RemoteServerError } from "../../../request";
import { IDiscussionsRequestOptions, SearchPostsFormat } from "../types";

export class RemoteServerError extends _RemoteServerError {
  error: string;

  constructor(message: string, url: string, status: number, error: string) {
    super(message, url, status);
    this.error = error;
  }
}

/**
 * returns Promise that resolves token to use in Discussions API requests
 *
 * @export
 * @param {IDiscussionsRequestOptions} options
 * @return {*}  {Promise<string>}
 */
export function authenticateRequest(
  options: IDiscussionsRequestOptions
): Promise<string> {
  const { token, authentication } = options;

  let tokenPromise = () => {
    return Promise.resolve(token);
  };

  if (authentication) {
    tokenPromise = authentication.getToken.bind(
      authentication,
      authentication.portal
    );
  }

  return tokenPromise();
}

/**
 * parses IDiscussionsRequestOptions and makes request against Discussions API
 *
 * @export
 * @template T
 * @param {string} route
 * @param {IDiscussionsRequestOptions} options
 * @param {string} [token]
 * @return {*}  {Promise<T>}
 */
export function apiRequest<T>(
  route: string,
  options: IDiscussionsRequestOptions,
  token?: string
): Promise<T> {
  let routeWithParams = route;
  const headers = new Headers(options.headers);
  headers.append("Content-Type", "application/json");
  if (token) {
    headers.append("Authorization", `Bearer ${token}`);
  }

  const opts: RequestInit = {
    headers,
    method: options.httpMethod || "GET",
    mode: options.mode,
    cache: options.cache,
    credentials: options.credentials,
  };

  const apiBase = buildUrl({
    // TODO: we _want_ to use getHubApiUrl(),
    // but have to deal w/ the fact that this package overwrites IHubRequestOptions
    host: options.hubApiUrl || "https://hub.arcgis.com",
    path: "/api/discussions/v1",
  });

  if (options.data) {
    if (options.httpMethod === "GET") {
      const queryParams = new URLSearchParams(options.data).toString();
      routeWithParams += `?${queryParams}`;
    } else {
      opts.body = JSON.stringify(options.data);
    }
  }

  // this currently only applies to the search post route. we should rework things in the future such that we don't need
  // to do this sort of evaluation in common logic.
  const isCSV =
    ["/posts", "/posts/search"].includes(route) &&
    (options.data?.f === SearchPostsFormat.CSV ||
      headers.get("Accept") === "text/csv");

  const url = [
    apiBase.replace(/\/$/, ""),
    routeWithParams.replace(/^\//, ""),
  ].join("/");
  return fetch(url, opts).then((res) => {
    if (res.ok) {
      return isCSV ? res.text() : res.json();
    } else {
      const { statusText, status } = res;
      return res.json().then((err) => {
        throw new RemoteServerError(
          statusText,
          url,
          status,
          JSON.stringify(err.message)
        );
      });
    }
  });
}
