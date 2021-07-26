import { IHubRequestOptions } from "../types";
import { RemoteServerError as _RemoteServerError } from "@esri/hub-common";

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
 * @param {IHubRequestOptions} options
 * @return {*}  {Promise<string>}
 */
export function authenticateRequest(
  options: IHubRequestOptions
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
 * parses IHubRequestOptions and makes request against Discussions API
 *
 * @export
 * @template T
 * @param {string} route
 * @param {IHubRequestOptions} options
 * @param {string} [token]
 * @return {*}  {Promise<T>}
 */
export function apiRequest<T>(
  route: string,
  options: IHubRequestOptions,
  token?: string
): Promise<T> {
  const headers = new Headers();
  headers.append("Content-Type", "application/json");
  if (token) {
    headers.append("Authorization", `Bearer ${token}`);
  }

  const opts: RequestInit = {
    headers,
    method: options.httpMethod || "GET",
    mode: options.mode,
    cache: options.cache,
    credentials: options.credentials
  };

  // NOTE: this should default to the prod url once deployed and microservice root URLs
  // are normalized: https://github.com/Esri/hub.js/pull/479#discussion_r607866561
  const apiBase =
    options.hubApiUrl || "https://hub.arcgis.com/api/discussions/v1";

  if (options.params) {
    if (options.httpMethod === "GET") {
      const queryParams = new URLSearchParams(options.params).toString();
      route += `?${queryParams}`;
    } else {
      opts.body = JSON.stringify(options.params);
    }
  }

  const url = [apiBase.replace(/\/$/, ""), route.replace(/^\//, "")].join("/");
  return fetch(url, opts).then(res => {
    if (res.ok) {
      return res.json();
    } else {
      const { statusText, status } = res;
      return res.json().then(err => {
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
