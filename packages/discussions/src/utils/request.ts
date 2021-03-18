import { IHubRequestOptions } from "../types";

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
 * @param {string} url
 * @param {IHubRequestOptions} options
 * @param {string} [token]
 * @return {*}  {Promise<T>}
 */
export function apiRequest<T>(
  url: string,
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
    mode: "cors",
    cache: "no-cache",
    credentials: "include"
  };

  const apiBase = options.hubApiUrl;

  if (options.params) {
    if (options.httpMethod === "GET") {
      const queryParams = new URLSearchParams(options.params).toString();
      url += `?${queryParams}`;
    } else {
      opts.body = JSON.stringify(options.params);
    }
  }

  return fetch([apiBase, url.replace(/^\//, "")].join("/"), opts).then(res =>
    res.json()
  );
}
