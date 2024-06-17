import { IHubEditableContent } from "../../../core/types/IHubEditableContent";
import { IDynamicDownloadFormat, ServiceDownloadFormat } from "../../types";
import { CreateReplicaFormat, CREATE_REPLICA_FORMATS } from "../_types";

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
  const allFormats = entity.serverExtractFormats || [];

  // List recognized formats in the order they are defined in CREATE_REPLICA_FORMATS
  const recognizedFormats: CreateReplicaFormat[] =
    CREATE_REPLICA_FORMATS.filter((format) => allFormats.includes(format));

  // List any unrecognized formats (we'll append these to the end of the final array)
  const unrecognizedFormats = allFormats.filter(
    (format) =>
      !CREATE_REPLICA_FORMATS.includes(format as CreateReplicaFormat) &&
      // KML is a valid createReplica format in QA and Dev, but not Prod.
      // Once it's enabled in Prod, we can add KML to CREATE_REPLICA_FORMATS
      // and remove this check.
      format !== ServiceDownloadFormat.KML
  );

  return [...recognizedFormats, ...unrecognizedFormats].map(
    (format: string) => ({
      type: "dynamic",
      format: format as CreateReplicaFormat,
    })
  );
}
