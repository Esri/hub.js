import {
  DownloadFlowType,
  IHubEditableContent,
} from "../../core/types/IHubEditableContent";
import { IDynamicDownloadFormat } from "../types";
import { getCreateReplicaFormats } from "./format-fetchers/getCreateReplicaFormats";
import { getExportImageFormats } from "./format-fetchers/getExportImageFormats";
import { getPagingJobFormats } from "./format-fetchers/getPagingJobFormats";
import { getFgdbJobFormats } from "./format-fetchers/getFgdbJobFormats";

/**
 * @private
 * Get the download formats for a given download flow and entity.
 *
 * @param downloadFlow DownloadFlowType
 * @param entity IHubEditableContent
 * @returns IDynamicDownloadFormat[]
 */
export function getDownloadFormatsByFlow(
  downloadFlow: DownloadFlowType,
  entity: IHubEditableContent
): IDynamicDownloadFormat[] {
  let downloadFormats: IDynamicDownloadFormat[] = [];
  const actionsByFlow: Record<DownloadFlowType, () => void> = {
    createReplica: () => {
      downloadFormats = getCreateReplicaFormats(entity);
    },
    paging: () => {
      downloadFormats = getPagingJobFormats();
    },
    fgdb: () => {
      downloadFormats = getFgdbJobFormats();
    },
    exportImage: () => {
      downloadFormats = getExportImageFormats(entity);
    },
  };
  actionsByFlow[downloadFlow] && actionsByFlow[downloadFlow]();
  return downloadFormats;
}
