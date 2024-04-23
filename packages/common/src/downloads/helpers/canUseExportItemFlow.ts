import { isHostedFeatureServiceEntity } from "../../content";
import { IHubEditableContent } from "../../core/types/IHubEditableContent";

export function canUseExportItemFlow(entity: IHubEditableContent): boolean {
  return isHostedFeatureServiceEntity(entity);
}
