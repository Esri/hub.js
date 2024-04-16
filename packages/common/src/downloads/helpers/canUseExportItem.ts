import { IHubEditableContent } from "../../core/types/IHubEditableContent";

export function canUseExportItem(entity: IHubEditableContent): boolean {
  return ["feature service", "map service"].includes(entity.type.toLowerCase());
}
