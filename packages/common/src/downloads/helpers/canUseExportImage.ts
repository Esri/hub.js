import { IHubEditableContent } from "../../core/types/IHubEditableContent";

export function canUseExportImage(entity: IHubEditableContent): boolean {
  return entity.type.toLowerCase() === "image service";
}
