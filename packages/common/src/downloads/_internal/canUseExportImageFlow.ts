import { IHubEditableContent } from "../../core/types/IHubEditableContent";
import { ItemType } from "../../hub-types";

/**
 * @private
 * Determines if the export image flow can be used for the given entity.
 * @param entity entity to check if export image flow can be used
 * @returns whether the export image flow can be used
 */
export function canUseExportImageFlow(entity: IHubEditableContent): boolean {
  const { type, typeKeywords = [] } = entity;
  // Tiled Imagery services cannot be downloaded. This typeKeyword check
  // is one way to distinguish between tiled and non-tiled imagery services.
  // TODO: Consider checking item.url instead so reference items are also excluded.
  return (
    type === ItemType["Image Service"] &&
    !typeKeywords.includes("Tiled Imagery")
  );
}
