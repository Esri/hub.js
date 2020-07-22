import { hubRequestDownloadMetadata, IHubDownloadMetadataRequestParams } from "./hub-request-download-metadata";
import * as EventEmitter from 'eventemitter3';

/**
 * @private
 */
export interface IHubDownloadMetadataPollParameters extends IHubDownloadMetadataRequestParams {
  downloadId: string;
  eventEmitter: EventEmitter;
  pollingInterval: number;
}

/**
 * @private
 */
export function hubPollDownloadMetadata (params:IHubDownloadMetadataPollParameters): void {
  const {
    downloadId,
    eventEmitter,
    pollingInterval
  } = params;

  hubRequestDownloadMetadata(params)
    .then(metadata => {
      if (isUpToDate(metadata)) {
        return eventEmitter.emit(`${downloadId}ExportComplete`, { detail: { metadata } });
      }
      if (exportDatasetFailed(metadata)) {
        return eventEmitter.emit(`${downloadId}ExportError`, { detail: { metadata } });
      }
      return setTimeout(() => {
        hubPollDownloadMetadata(params);
      }, pollingInterval);
    }).catch(error => {
      return eventEmitter.emit(`${downloadId}PollingError`, { detail: { error } });
    });
}

function isUpToDate (metadata: any) {
  return metadata && (metadata.status === 'ready');
}

function exportDatasetFailed (metadata: any) {
  return metadata && (metadata.status === 'error_updating' || metadata.status === 'error_creating');
}
