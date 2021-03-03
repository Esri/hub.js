import { IRequestOptions } from "./types";

export function request(url: string, options: IRequestOptions) {
  const headers = new Headers();
  headers.append("Content-Type", "application/json");

  const token = options.token;
  // if (options.authentication) {
  //   token = options.authentication.getToken();
  // }
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

  return fetch([apiBase, url.replace(/^\//, "")].join("/"), opts);
}
