import { IHubEditableContent } from "../../core/types/IHubEditableContent";

export function canUseExportImageFlow(entity: IHubEditableContent): boolean {
  return entity.type === "Image Service";
}
