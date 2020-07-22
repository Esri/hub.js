import { UserSession } from '@esri/arcgis-rest-auth';
import { hubRequestDatasetExport } from './hub/hub-request-dataset-export';
import { portalRequestDatasetExport } from './portal/portal-request-dataset-export';
import { DownloadFormat } from "./download-format";

export interface IDatasetExportRequestParams {
  /* API target for downloads: 'hub' (default) or 'portal' */
  target?: string;
  /* Hub API host name. Not required for Portal API downloads (stored in the authentication object) */
  host?: string;
  /* ID for the downloads source dataset; e.g. "abcdef0123456789abcdef0123456789_0" */
  datasetId: string;
  /* Download format/file-type. */
  format: DownloadFormat;
  /* Spatial reference well-known ID (WKID) for the download data.  Must be "4326" (WGS) or the WKID for the spatial reference of the service */
  spatialRefId?: string;
  /* A geometry envelope for filtering the data */
  geometry?: string;
  /* A SQL-style WHERE filter for attribute values */
  where?: string;
  /* Portal downloads only. */
  authentication?: UserSession;
  /* A title/filename for the download. Portal downloads only. */
  title?: string;
}

export interface IDatasetExportResult {
  /* Identifier for the download */
  downloadId: string;
  /* Identifier for the export job. Portal downloads only. */
  jobId?: string;
  /* Time-stamp for export start. Portal downloads only. */
  exportCreated?: number;

  size?: number;
}
/**
 * ```js
 * import { requestDatasetExport } from "@esri/hub-downloads";
 *
 * Request an export of a dataset to a particular file format.
 * @param params - parameters defining a dataset export job
 */
export function requestDatasetExport (params: IDatasetExportRequestParams): Promise<IDatasetExportResult> {
  const {
    host,
    datasetId,
    format,
    spatialRefId,
    geometry,
    where,
    title,
    target,
    authentication
  } = params;

  if (target === 'portal') {
      return portalRequestDatasetExport({ datasetId, format, title, authentication });
  }

  return hubRequestDatasetExport({
    host,
    datasetId,
    format,
    spatialRefId,
    geometry,
    where
  });
}