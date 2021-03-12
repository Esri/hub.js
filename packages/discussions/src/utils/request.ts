import { IRequestOptions } from "../types";

/**
 * returns Promise that resolves token to use in Discussions API requests
 *
 * @export
 * @param {IRequestOptions} options
 * @return {*}  {Promise<string>}
 */
export function authenticateRequest(options: IRequestOptions): Promise<string> {
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
 * parses IRequestOptions and makes request against Discussions API
 *
 * @export
 * @param {string} url
 * @param {IRequestOptions} options
 * @param {string} [token]
 * @return {*}  {Promise<any>}
 */
export function apiRequest(
  url: string,
  options: IRequestOptions,
  token?: string
): Promise<any> {
  const headers = new Headers();
  headers.append("Content-Type", "application/json");
  if (token) {
    headers.append("Authorization", `Bearer ${token}`);
  }

  const opts: RequestInit = {
    headers,
    method: options.method || "GET",
    mode: options.mode || "cors",
    cache: options.cache || "no-cache",
    credentials: options.credentials || "include"
  };

  const apiBase = options.apiBaseUrl || "http://localhost/api/v1";

  if (options.params) {
    const { query, body } = options.params;

    if (query) {
      const queryParams = new URLSearchParams(query).toString();
      url += `?${queryParams}`;
    }

    if (body) {
      opts.body = JSON.stringify(body);
    }
  }

  return fetch([apiBase, url.replace(/^\//, "")].join("/"), opts).then(res =>
    res.json()
  );
}
