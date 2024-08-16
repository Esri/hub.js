import { FlowType, IHubEditableContent } from "../../core";
import { canUseCreateReplica } from "../canUseCreateReplica";
import { canUseHubDownloadSystem } from "../canUseHubDownloadSystem";
import { canUseExportImageFlow } from "./canUseExportImageFlow";

export function getDownloadFlow(
  entity: IHubEditableContent,
  isEnterprise?: boolean
) {
  let downloadFlow: FlowType;
  if (canUseCreateReplica(entity)) {
    downloadFlow = "createReplica";
  } else if (canUseHubDownloadSystem(entity) && !isEnterprise) {
    downloadFlow = "paging";
  } else if (canUseExportImageFlow(entity)) {
    downloadFlow = "exportImage";
  }
  return downloadFlow;
}
