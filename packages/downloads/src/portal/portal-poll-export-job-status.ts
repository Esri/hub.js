import {
  getItemStatus,
  IGetItemStatusResponse
} from "@esri/arcgis-rest-portal";
import { DownloadFormat } from "../download-format";
import * as EventEmitter from "eventemitter3";
import { UserSession } from "@esri/arcgis-rest-auth";
import { IPoller } from "../poller";
import { exportSuccessHandler } from "./portal-export-success-handler";
import { DownloadStatus } from "../download-status";
import ExportCompletionError from "./portal-export-completion-error";

/**
 * @private
 */
interface IPortalPollExportJobStatusParams {
  downloadId: string;
  datasetId: string;
  format: DownloadFormat;
  authentication: UserSession;
  jobId: string;
  exportCreated: number;
  eventEmitter: EventEmitter;
  pollingInterval: number;
  spatialRefId?: string;
  geometry?: string;
  where?: string;
}

class PortalPoller implements IPoller {
  pollTimer: any;

  disablePoll() {
    clearInterval(this.pollTimer);
    this.pollTimer = null;
  }

  activatePoll(params: IPortalPollExportJobStatusParams) {
    const {
      downloadId,
      datasetId,
      format,
      spatialRefId,
      jobId,
      authentication,
      exportCreated,
      eventEmitter,
      pollingInterval
    } = params;

    this.pollTimer = setInterval(() => {
      getItemStatus({
        id: downloadId,
        jobId,
        jobType: "export",
        authentication
      })
        .then((metadata: IGetItemStatusResponse) => {
          if (metadata.status === "completed") {
            return exportSuccessHandler({
              datasetId,
              format,
              authentication,
              downloadId,
              spatialRefId,
              exportCreated,
              eventEmitter
            }).then(() => {
              this.disablePoll();
            });
          }

          if (metadata.status === "failed") {
            eventEmitter.emit(`${downloadId}ExportError`, {
              detail: {
                error: new Error(metadata.statusMessage),
                metadata: {
                  status: DownloadStatus.ERROR,
                  errors: [new Error(metadata.statusMessage)]
                }
              }
            });
            return this.disablePoll();
          }
        })
        .catch((error: any) => {
          if (error instanceof ExportCompletionError) {
            eventEmitter.emit(`${downloadId}ExportError`, {
              detail: {
                error,
                metadata: {
                  status: DownloadStatus.ERROR,
                  errors: [error]
                }
              }
            });
          } else {
            eventEmitter.emit(`${downloadId}PollingError`, {
              detail: {
                error,
                metadata: {
                  status: DownloadStatus.ERROR,
                  errors: [error]
                }
              }
            });
          }
          return this.disablePoll();
        });
    }, pollingInterval);
  }
}

/**
 * @private
 */
export function portalPollExportJobStatus(
  params: IPortalPollExportJobStatusParams
): PortalPoller {
  const poller = new PortalPoller();
  poller.activatePoll(params);
  return poller;
}
