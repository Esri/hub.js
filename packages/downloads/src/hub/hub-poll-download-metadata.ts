import {
  hubRequestDownloadMetadata,
  IHubDownloadMetadataRequestParams
} from "./hub-request-download-metadata";
import * as EventEmitter from "eventemitter3";
import { IPoller } from "../poller";
/**
 * @private
 */
export interface IHubDownloadMetadataPollParameters
  extends IHubDownloadMetadataRequestParams {
  downloadId: string;
  eventEmitter: EventEmitter;
  pollingInterval: number;
  existingFileDate?: string;
}

class HubPoller implements IPoller {
  pollTimer: any;

  disablePoll() {
    clearInterval(this.pollTimer);
    this.pollTimer = null;
  }

  activatePoll(params: IHubDownloadMetadataPollParameters) {
    const {
      downloadId,
      eventEmitter,
      pollingInterval,
      existingFileDate = new Date(0).toISOString()
    } = params;

    const existingFileTimestamp = new Date(existingFileDate).getTime();

    this.pollTimer = setInterval(() => {
      hubRequestDownloadMetadata(params)
        .then(metadata => {
          if (isReady(metadata, existingFileTimestamp)) {
            eventEmitter.emit(`${downloadId}ExportComplete`, {
              detail: { metadata }
            });
            return this.disablePoll();
          }

          if (exportDatasetFailed(metadata)) {
            const {
              errors: [error]
            } = metadata;
            eventEmitter.emit(`${downloadId}ExportError`, {
              detail: { error, metadata }
            });
            return this.disablePoll();
          }
        })
        .catch(error => {
          eventEmitter.emit(`${downloadId}PollingError`, {
            detail: { error, metadata: { status: "error" } }
          });
          return this.disablePoll();
        });
    }, pollingInterval);
  }
}

/**
 * @private
 */
export function hubPollDownloadMetadata(
  params: IHubDownloadMetadataPollParameters
): HubPoller {
  const poller = new HubPoller();
  poller.activatePoll(params);
  return poller;
}

function isReady(metadata: any, preExportFileTimestamp: number) {
  const { status, lastModified } = metadata;
  const currentFileDate = new Date(lastModified).getTime();
  return (
    status === "ready" ||
    (status === "ready_unknown" && currentFileDate > preExportFileTimestamp)
  );
}

function exportDatasetFailed(metadata: any) {
  return (
    metadata &&
    (metadata.status === "error_updating" ||
      metadata.status === "error_creating")
  );
}
