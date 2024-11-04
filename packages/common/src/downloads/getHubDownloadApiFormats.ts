import { getCreateReplicaFormats } from "./_internal/format-fetchers/getCreateReplicaFormats";
import { getPagingJobFormats } from "./_internal/format-fetchers/getPagingJobFormats";
import { IDynamicDownloadFormat } from "./types";
import {
  IHubEditableContent,
  IServiceExtendedProps,
} from "../core/types/IHubEditableContent";
import { canUseCreateReplica } from "./canUseCreateReplica";
import { canUseHubDownloadSystem } from "./canUseHubDownloadSystem";
import { getFgdbJobFormats } from "./_internal/format-fetchers/getFgdbJobFormats";
import { getProp } from "../objects/get-prop";

/**
 * Returns all the formats that are available for download via the Hub Download API for a given entity.
 * Formats will vary from entity to entity depending on actual operation that the Hub Download API will
 * perform under the hood (e.g., hitting /createReplica or paging through the service's features).
 *
 * @param entity Service entity to return download formats for
 * @returns available download formats for the entity
 */
export function getHubDownloadApiFormats(
  entity: IHubEditableContent
): IDynamicDownloadFormat[] {
  let result: IDynamicDownloadFormat[] = [];
  if (canUseCreateReplica(entity)) {
    result = getCreateReplicaFormats(entity);
  } else if (canUseHubDownloadSystem(entity)) {
    const isExtractEnabled = !!getProp(
      entity,
      "extendedProps.serverExtractCapability"
    );
    result = isExtractEnabled ? getFgdbJobFormats() : getPagingJobFormats();
  }
  return result;
}
