import * as EventEmitter from 'eventemitter3';
import { UserSession } from '@esri/arcgis-rest-auth';
import { hubPollDownloadMetadata } from './hub/hub-poll-download-metadata';
import { portalPollExportJobStatus } from './portal/portal-poll-export-job-status';
import { DownloadFormat } from "./download-format";

export interface IPollDownloadMetadataParams {
  /* Identifier for the download.  Used to emit events for success or failure */
  downloadId: string,
  eventEmitter: EventEmitter;
  pollingInterval: number;
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
  /* Identifier for the export job. Portal downloads only. */
  jobId?: string;
  /* Time-stamp for export start. Portal downloads only. */
  exportCreated?: number;
}

/**
 *
 * Poll the status of a download job / portal export. Emit event when completed
 * (with download link) or failed (with error)
 * @param params - parameters defining a dataset export job
 */
export function pollDownloadMetadata (params: IPollDownloadMetadataParams): void {
  const {
    target,
    downloadId,
    datasetId,
    jobId,
    format,
    authentication,
    exportCreated,
    eventEmitter,
    pollingInterval,
    spatialRefId,
    geometry,
    where,
    host
  } = params;

  if (target === 'portal') {
    return portalPollExportJobStatus({
      downloadId,
      datasetId,
      jobId,
      authentication,
      exportCreated,
      format,
      eventEmitter,
      pollingInterval,
      spatialRefId,
      geometry,
      where
    });
  }

  return hubPollDownloadMetadata({
    host,
    downloadId,
    datasetId,
    format,
    eventEmitter,
    pollingInterval,
    spatialRefId,
    geometry,
    where
  })
}
