import { DownloadFlowType, IArcGISContext } from "..";

export type IDownloadFlowFlags = Record<DownloadFlowType, boolean>;

/**
 * TODO: Document me
 * @param context
 * @returns
 */
export function getAvailableDownloadFlows(
  context: IArcGISContext
): IDownloadFlowFlags {
  return context.serviceStatus?.["hub-downloads"] === "online"
    ? {
        hubCreateReplica: true,
        fgdb: true,
        paging: true,
        exportImage: true,
        portalCreateReplica: false,
      }
    : {
        hubCreateReplica: false,
        fgdb: false,
        paging: false,
        exportImage: true,
        portalCreateReplica: true,
      };
}
