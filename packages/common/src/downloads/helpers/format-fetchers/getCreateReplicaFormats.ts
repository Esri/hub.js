import { IHubEditableContent } from "../../../core/types/IHubEditableContent";
import { IDynamicDownloadFormat } from "../types";

export function getCreateReplicaFormats(
  entity: IHubEditableContent
): IDynamicDownloadFormat[] {
  return (entity.serverExtractFormats || []).map((format) => ({
    type: "dynamic",
    format,
  }));
}
