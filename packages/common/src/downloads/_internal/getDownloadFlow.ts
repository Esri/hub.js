import { DownloadFlowType, IHubEditableContent } from "../../core";
import { canUseCreateReplica } from "../canUseCreateReplica";
import { canUseHubDownloadSystem } from "../canUseHubDownloadSystem";
import { canUseExportImageFlow } from "./canUseExportImageFlow";

/**
 * @private
 * Determines the download flow that will be used for the current entity.
 * If the entity cannot be downloaded, returns null.
 *
 * @param entity the entity to get the download flow for
 * @param isEnterprise whether the the download will be executed in an enterprise environment
 * @returns the download flow that will be used for the current entity
 */
export function getDownloadFlow(
  entity: IHubEditableContent,
  isEnterprise?: boolean
) {
  let downloadFlow: DownloadFlowType = null;
  if (canUseCreateReplica(entity)) {
    downloadFlow = "createReplica";
  } else if (canUseHubDownloadSystem(entity) && !isEnterprise) {
    downloadFlow = "paging";
  } else if (canUseExportImageFlow(entity)) {
    downloadFlow = "exportImage";
  }
  return downloadFlow;
}
