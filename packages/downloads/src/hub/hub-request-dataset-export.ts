import { RemoteServerError } from '../remote-server-error';
import { composeDownloadId } from '../utils';
import { DownloadFormat } from "../download-format";
import { convertToHubFormat } from "./format-converter";

export interface IHubDatasetExportRequestParams {
  host: string;
  datasetId: string;
  format: DownloadFormat;
  spatialRefId?: string;
  spatialRefWkt?: string;
  geometry?: string;
  where?: string;
}

/**
 * ```js
 * import { hubRequestDatasetExport } from "@esri/hub-downloads";
 * 
 * const params = {
 *   host: 'https://hub.arcgis.com,
 *   datasetId: 'abcdef0123456789abcdef0123456789_0',
 *   format: 'CSV'
 * };
 * hubRequestDatasetExport(params)
 *   .then(response => {
 *     // {
 *     //   downloadId: 'abcdef0123456789abcdef0123456789_0::csv',
 *     // }
 *   });
 * ```
 * Request an export of a dataset to a particular file format.
 * @param params - parameters defining a dataset export job
 */
export function hubRequestDatasetExport (params: IHubDatasetExportRequestParams) {
  const {
    host,
    datasetId,
    spatialRefId,
    geometry,
    where
  } = params;

  const body = {
    spatialRefId,
    format: convertToHubFormat(params.format),
    geometry,
    where
  };

  const url = requestBuilder(host, `/api/v3/datasets/${datasetId}/downloads`)

  return fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  }).then(resp => {
    const { ok, status, statusText } = resp;
    if (!ok) {
      throw new RemoteServerError(statusText, url, status);
    }
    return
  }).then(() => {
    return { downloadId: composeDownloadId(params) };
  });
}

function requestBuilder (host: string, route: string): string {
  const baseUrl = host.endsWith('/') ? host : `${host}/`
  const url = new URL(route, baseUrl)
  return url.toString()
}