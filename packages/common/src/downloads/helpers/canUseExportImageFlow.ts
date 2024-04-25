import { IHubEditableContent } from "../../core/types/IHubEditableContent";

/**
 * @private
 * Determines if the export image flow can be used for the given entity.
 * @param entity entity to check if export image flow can be used
 * @returns whether the export image flow can be used
 */
export function canUseExportImageFlow(entity: IHubEditableContent): boolean {
  return entity.type === "Image Service";
}
