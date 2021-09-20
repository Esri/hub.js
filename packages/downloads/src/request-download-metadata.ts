import { portalRequestDownloadMetadata } from "./portal/portal-request-download-metadata";
import { hubRequestDownloadMetadata } from "./hub/hub-request-download-metadata";
import { DownloadFormat } from "./download-format";
import { DownloadTarget } from "./download-target";
import { DownloadStatuses } from "./download-status";
import { UserSession } from "@esri/arcgis-rest-auth";

export interface IDownloadMetadataRequestParams {
  /* API target for downloads: 'hub' (default), 'portal', 'enterprise' */
  target?: DownloadTarget;
  /* Hub API host name. */
  host: string;
  /* ID for the downloads source dataset; e.g. "abcdef0123456789abcdef0123456789_0" */
  datasetId: string;
  /* Download format/file-type. */
  format: DownloadFormat;
  /* Spatial reference well-known ID (WKID) for the download data. Applicable to Hub API exports only. Must be "4326" (WGS) or the WKID for the spatial reference of the service */
  spatialRefId?: string;
  /* A geometry envelope for filtering the data. Applicable to Hub API exports only. */
  geometry?: string;
  /* A SQL-style WHERE filter for attribute values.  Applicable to Hub API exports only. */
  where?: string;
  /* Required for Portal downloads only. */
  authentication?: UserSession;
}

export interface IDownloadMetadataResults {
  /* Identifier for the download */
  downloadId: string;

  /* ready, not_ready, creating, updating, failed */
  status: DownloadStatuses;

  /* array of any errors related to exporting*/
  errors?: Error[];

  /* ISO date of the service's last edit date */
  lastEditDate?: string;

  /* ISO date of the download file's data - the last edit date of the service when the download export started */
  contentLastModified?: string;

  /* File timestamp */
  lastModified?: string;

  /* URL for downloading the file */
  downloadUrl?: string;

  /* File size */
  contentLength?: number;

  /* Time (milliseconds) it took to export and cache the download file */
  cacheTime?: number;
}

/**
 * ```js
 * import { requestDownloadMetadata } from "@esri/hub-downloads";
 * const params = {
 *   host: 'https://opendata.arcgis.com,
 *   datasetId: 'abcdef0123456789abcdef0123456789_0',
 *   format: 'CSV',
 *   target: 'hub'
 * };
 * requestDownloadMetadata(params)
 *   .then(response => {
 *     // {
 *     //   downloadId: 'abcdef0123456789abcdef0123456789_0::csv',
 *     //   contentLastModified: '2020-06-17T01:16:01.933Z',
 *     //   lastEditDate: '2020-06-18T01:17:31.492Z',
 *     //   lastModified: '2020-06-17T13:04:28.000Z',
 *     //   status: 'stale',
 *     //   downloadUrl: 'https://dev-hub-indexer.s3.amazonaws.com/files/dd4580c810204019a7b8eb3e0b329dd6/0/full/4326/dd4580c810204019a7b8eb3e0b329dd6_0_full_4326.csv',
 *     //   contentLength: 1391454,
 *     //   cacheTime: 13121
 *     // }
 *   });
 * ```
 * Fetch metadata for a Hub download.
 * @param {IDownloadMetadataRequestParams} params
 * @returns {Promise<ISearchResult>}
 */
export function requestDownloadMetadata(
  params: IDownloadMetadataRequestParams
): Promise<IDownloadMetadataResults> {
  const {
    host,
    datasetId,
    spatialRefId,
    format,
    geometry,
    where,
    target,
    authentication,
  } = params;

  if (!target || target === "hub") {
    return hubRequestDownloadMetadata({
      host,
      datasetId,
      format,
      spatialRefId,
      geometry,
      where,
    });
  }

  return portalRequestDownloadMetadata({
    portal: `${host}/sharing/rest`,
    datasetId,
    format,
    authentication,
    spatialRefId,
    target,
  });
}
