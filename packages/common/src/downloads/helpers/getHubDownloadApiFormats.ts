import { IArcGISContext } from "../../ArcGISContext";
import { isHostedFeatureServiceEntity } from "../../content";
import { IHubEditableContent } from "../../core/types/IHubEditableContent";
import { getCreateReplicaFormats } from "./getCreateReplicaFormats";
import { getPagingJobFormats } from "./getPagingJobFormats";
import { IDynamicDownloadFormat } from "./types";

export function getHubDownloadApiFormats(
  entity: IHubEditableContent
): IDynamicDownloadFormat[] {
  return isHostedFeatureServiceEntity(entity) && entity.serverExtractCapability
    ? getCreateReplicaFormats(entity)
    : getPagingJobFormats();
}
