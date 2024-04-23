import { getCreateReplicaFormats } from "./getCreateReplicaFormats";
import { getPagingJobFormats } from "./getPagingJobFormats";
import { IDynamicDownloadFormat } from "../types";
import { IHubEditableContent } from "../../../core/types/IHubEditableContent";
import { isHostedFeatureServiceEntity } from "../../../content/hostedServiceUtils";

export function getHubDownloadApiFormats(
  entity: IHubEditableContent
): IDynamicDownloadFormat[] {
  return isHostedFeatureServiceEntity(entity) && entity.serverExtractCapability
    ? getCreateReplicaFormats(entity)
    : getPagingJobFormats();
}
