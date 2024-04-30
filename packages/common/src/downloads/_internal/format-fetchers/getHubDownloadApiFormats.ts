import { getCreateReplicaFormats } from "./getCreateReplicaFormats";
import { getPagingJobFormats } from "./getPagingJobFormats";
import { IDynamicDownloadFormat } from "../../types";
import { IHubEditableContent } from "../../../core/types/IHubEditableContent";
import { canUseCreateReplica } from "../../canUseCreateReplica";

/**
 * @private
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
  return canUseCreateReplica(entity)
    ? getCreateReplicaFormats(entity)
    : getPagingJobFormats();
}
