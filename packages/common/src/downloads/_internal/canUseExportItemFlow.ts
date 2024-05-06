import { isHostedFeatureServiceEntity } from "../../content/hostedServiceUtils";
import { IHubEditableContent } from "../../core/types/IHubEditableContent";

/**
 * @private
 * Determines if the export item flow can be used for the given entity.
 * @param entity entity to check if export item flow can be used
 * @returns whether the export item flow can be used
 */
export function canUseExportItemFlow(entity: IHubEditableContent): boolean {
  return isHostedFeatureServiceEntity(entity);
}
