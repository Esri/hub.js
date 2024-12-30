import { DownloadFlowType, IHubEditableContent } from "../../core";
import { getProp } from "../../objects/get-prop";
import { canUseCreateReplica } from "../canUseCreateReplica";
import { canUseHubDownloadSystem } from "../canUseHubDownloadSystem";
import { IDownloadFlowFlags } from "../getAvailableDownloadFlows";
import { canUseExportImageFlow } from "./canUseExportImageFlow";

/**
 * @private
 * Determines the download flow that will be used for the current entity.
 * If the entity cannot be downloaded, returns null.
 *
 * @param entity the entity to get the download flow for
 * @param isEnterprise NOTE: Change this
 * @returns the download flow that will be used for the current entity
 */
export function getDownloadFlow(
  entity: IHubEditableContent,
  availableDownloadFlows: IDownloadFlowFlags
) {
  let downloadFlow: DownloadFlowType = null;

  const canEntityUseCreateReplica = canUseCreateReplica(entity);
  const canEntityUseHubDownloadSystem = canUseHubDownloadSystem(entity);
  const doesEntityHaveServerExtractCapability = !!getProp(
    entity,
    "extendedProps.serverExtractCapability"
  );
  const canEntityUseExportImageFlow = canUseExportImageFlow(entity);

  // Prefer createReplica via Hub API
  if (canEntityUseCreateReplica && availableDownloadFlows.hubCreateReplica) {
    downloadFlow = "hubCreateReplica";
  }
  // Then prefer createReplica via Portal API
  else if (
    canEntityUseCreateReplica &&
    availableDownloadFlows.portalCreateReplica
  ) {
    downloadFlow = "portalCreateReplica";
  }
  // Then prefer FGDB Job
  else if (
    canEntityUseHubDownloadSystem &&
    doesEntityHaveServerExtractCapability &&
    availableDownloadFlows.fgdb
  ) {
    downloadFlow = "fgdb";
  }
  // Then prefer Paging Job
  else if (canEntityUseHubDownloadSystem && availableDownloadFlows.paging) {
    downloadFlow = "paging";
  }
  // Finally, prefer exportImage
  else if (canEntityUseExportImageFlow && availableDownloadFlows.exportImage) {
    downloadFlow = "exportImage";
  }

  return downloadFlow;
}
