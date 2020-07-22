interface IQueryParams {
  [key: string]: string;
}

export function urlBuilder (params: { host: string, route: string, query?: IQueryParams }): string {
  const { host, route, query } = params;
  const baseUrl = host.endsWith('/') ? host : `${host}/`
  const url = new URL(route, baseUrl)
  url.search = buildQueryString(query)
  return url.toString()
}

function buildQueryString (params: IQueryParams = {}): string {
  const queryParams = Object.keys(params).filter(key => {
    return params[key] !== undefined;
  }).reduce((acc:any, key:string) => {
    acc[key] = params[key];
    return acc;
  }, {})
  return (new URLSearchParams(queryParams)).toString()
}

export interface IDownloadIdParams {
  datasetId: string;
  format: string;
  spatialRefId?: string;
  geometry?: string;
  where?: string;
}

export function composeDownloadId (params: IDownloadIdParams): string {
  const {
    datasetId,
    format,
    spatialRefId,
    geometry,
    where,
  } = params;
  return `${datasetId}:${format}:${spatialRefId}:${geometry}:${where}`
}