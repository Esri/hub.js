import {
  hubRequestDownloadMetadata,
  IHubDownloadMetadataRequestParams
} from "./hub-request-download-metadata";
import * as EventEmitter from "eventemitter3";
import { Poller } from "../poller";
/**
 * @private
 */
export interface IHubDownloadMetadataPollParameters
  extends IHubDownloadMetadataRequestParams {
  downloadId: string;
  eventEmitter: EventEmitter;
  pollingInterval: number;
}

/**
 * @private
 */
export function hubPollDownloadMetadata(
  params: IHubDownloadMetadataPollParameters
): HubPoller {
  
  const poller = new HubPoller()
  poller.activatePoll(params)
  return poller;
}

class HubPoller implements Poller {
  pollTimer: any;

  disablePoll () {
    clearInterval(this.pollTimer); 
    this.pollTimer = null;
  }

  activatePoll (params: IHubDownloadMetadataPollParameters) {
    const { downloadId, eventEmitter, pollingInterval } = params;
    this.pollTimer = setInterval(() => {
      hubRequestDownloadMetadata(params)
      .then(metadata => {
  
        if (isUpToDate(metadata)) {
          eventEmitter.emit(`${downloadId}ExportComplete`, {
            detail: { metadata }
          });
          return this.disablePoll();
        }
  
        if (exportDatasetFailed(metadata)) {
          eventEmitter.emit(`${downloadId}ExportError`, {
            detail: { metadata }
          });
          return this.disablePoll();
        }
      })
      .catch(error => {
        eventEmitter.emit(`${downloadId}PollingError`, {
          detail: { error }
        });
        return this.disablePoll();
      });
    }, pollingInterval);
  };
}

function isUpToDate(metadata: any) {
  return metadata && metadata.status === "ready";
}

function exportDatasetFailed(metadata: any) {
  return (
    metadata &&
    (metadata.status === "error_updating" ||
      metadata.status === "error_creating")
  );
}