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
  // if you are updating this file, remove this comment and address the lint error
  // eslint-disable-next-line @typescript-eslint/no-unused-expressions
  actionsByFlow[downloadFlow] && actionsByFlow[downloadFlow]();
  return downloadFormats;
}
