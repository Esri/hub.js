import { IRequestOptions } from "./types";

export function request(url: string, options: IRequestOptions) {
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

  const callback = apiRequest.bind(null, url, options);
  return tokenPromise().then(callback);
}

export function apiRequest(
  url: string,
  options: IRequestOptions,
  token: string
) {
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

  const apiBase = options.portalUrl || "http://localhost/api/v1";

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
