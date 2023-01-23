export interface IQueryParams {
  // TODO: Should I change this back?
  [key: string]: string | number;
}

/**
 * @private
 */
export function buildUrl(params: {
  host: string;
  path: string;
  query?: IQueryParams;
}): string {
  const { host, path, query } = params;
  const baseUrl = host.endsWith("/") ? host : `${host}/`;
  const url = new URL(path, baseUrl);
  url.search = buildQueryString(query);
  return url.toString();
}

function buildQueryString(params: IQueryParams = {}): string {
  const queryParams = Object.keys(params)
    .filter((key) => {
      return params[key] !== undefined;
    })
    .reduce((acc: any, key: string) => {
      acc[key] = params[key];
      return acc;
    }, {});
  return new URLSearchParams(queryParams).toString();
}
