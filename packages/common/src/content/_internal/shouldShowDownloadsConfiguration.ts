import { IHubEditableContent } from "../../core/types/IHubEditableContent";
import { canUseExportImageFlow } from "../../downloads/_internal/canUseExportImageFlow";
import { IHubRequestOptions } from "../../hub-types";
import { getProp } from "../../objects/get-prop";

/**
 * @private
 * Determines if the downloads configuration should be shown for an entity.
 *
 * NOTE: product has asked that the download configuration be shown for entities that _can_
 * be downloaded, as well as certain entities that _cannot_ be downloaded currently, but
 * could be downloaded with a change in item / service settings.
 *
 * @param entity entity to check
 * @param hubRequestOptions hub request options (temporarily to ensure not portal)
 * @returns whether downloads configuration should be shown
 */
export function shouldShowDownloadsConfiguration(
  entity: IHubEditableContent,
  hubRequestOptions: IHubRequestOptions
): boolean {
  // Enterprise can't support download configuration at this time
  if (hubRequestOptions.isPortal) {
    return false;
  }

  // NOTE: At this time, product has asked that we hide the downloads configuration
  // for multi-layer service entities.
  const isReferenceLayerEntity =
    ["Feature Service", "Map Service"].includes(entity.type) &&
    /\/\d+$/.test(entity.url);
  const isSingleLayerEntity =
    getProp(entity, "extendedProps.server.layers.length") === 1;
  const isDownloadableImageService = canUseExportImageFlow(entity);

  return (
    isReferenceLayerEntity || isSingleLayerEntity || isDownloadableImageService
  );
}
