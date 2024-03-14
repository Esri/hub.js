/**
 * Generated and copied from the [hub engagement repo](https://github.com/ArcGIS/hub-newsletters/blob/master/orval/custom-client.ts)
 * Do not edit manually
 */
export interface IOrvalParams {
  url: string;
  method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  headers?: HeadersInit;
  params?: Record<string, any>; // query params
  data?: Record<string, any>; // request body
}

export interface ICustomParams {
  hubApiUrl?: string;
  token?: string;
  headers?: HeadersInit;
  params?: Record<string, any>; // query params
  data?: Record<string, any>; // request body
  mode?: RequestMode;
  cache?: RequestCache;
  credentials?: RequestCredentials;
}

export async function customClient<T>(
  orvalParams: IOrvalParams,
  customParams: ICustomParams
): Promise<T> {
  const { url, method, data } = orvalParams;
  const { mode, cache, credentials } = customParams;
  const { headers, params } = combineParams(orvalParams, customParams);

  const baseUrl = removeTrailingSlash(customParams.hubApiUrl);
  const requestUrl = `${baseUrl}${url}?${new URLSearchParams(params)}`;

  const requestOptions: RequestInit = {
    headers,
    method,
    cache,
    credentials,
    mode,
  };
  if (data) {
    requestOptions.body = JSON.stringify(data);
  }

  const res = await fetch(requestUrl, requestOptions);
  const { statusText, status } = res;

  if (res.ok) {
    return res.json();
  }

  const error = await res.json();
  throw new RemoteServerError(
    statusText,
    requestUrl,
    status,
    JSON.stringify(error.message)
  );
}

function removeTrailingSlash(hubApiUrl = "https://hub.arcgis.com") {
  return hubApiUrl.replace(/\/$/, "");
}

function combineParams(orvalParams: IOrvalParams, options: ICustomParams) {
  const headers = new Headers({
    ...orvalParams.headers,
    ...options.headers,
  });
  if (options.token) {
    headers.set("Authorization", options.token);
  }

  const params = {
    ...orvalParams.params,
    ...options.params,
  };

  return { headers, params };
}

class RemoteServerError extends Error {
  status: number;
  url: string;
  error: string;

  constructor(message: string, url: string, status: number, error: string) {
    super(message);
    this.status = status;
    this.url = url;
    this.error = error;
  }
}
