import { IHubEditableContent } from "../../../core/types/IHubEditableContent";
import { CreateReplicaFormat, IDynamicDownloadFormat } from "../types";

/**
 * @private
 * Returns all the download formats that are defined by the service's /createReplica endpoint.
 *
 * @param entity Hosted Feature Service entity to return download formats for
 * @returns available download formats for the entity
 */
export function getCreateReplicaFormats(
  entity: IHubEditableContent
): IDynamicDownloadFormat[] {
  return (entity.serverExtractFormats || []).map((format: string) => ({
    type: "dynamic",
    format: format as CreateReplicaFormat,
  }));
}
