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
): Poller {
  
  const poller = new HubPoller()
  poller.poll(params)
  return poller;
}



class HubPoller implements Poller {
  cancelPolling: boolean = false;

  poll (params: IHubDownloadMetadataPollParameters) {
    const { downloadId, eventEmitter, pollingInterval } = params;

    hubRequestDownloadMetadata(params)
    .then(metadata => {

      if (this.cancelPolling) {
        return;
      }

      if (isUpToDate(metadata)) {
        return eventEmitter.emit(`${downloadId}ExportComplete`, {
          detail: { metadata }
        });
      }

      if (exportDatasetFailed(metadata)) {
        return eventEmitter.emit(`${downloadId}ExportError`, {
          detail: { metadata }
        });
      }

      return setTimeout(() => {
        hubPollDownloadMetadata(params);
      }, pollingInterval);
    })
    .catch(error => {
      return eventEmitter.emit(`${downloadId}PollingError`, {
        detail: { error }
      });
    });
  }

  cancel () {
    this.cancelPolling = true;
  }
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