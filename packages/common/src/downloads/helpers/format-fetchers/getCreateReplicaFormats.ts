import { IHubEditableContent } from "../../../core/types/IHubEditableContent";
import { CreateReplicaFormat, IDynamicDownloadFormat } from "../types";

export function getCreateReplicaFormats(
  entity: IHubEditableContent
): IDynamicDownloadFormat[] {
  return (entity.serverExtractFormats || []).map((format: string) => ({
    type: "dynamic",
    format: format as CreateReplicaFormat,
  }));
}
