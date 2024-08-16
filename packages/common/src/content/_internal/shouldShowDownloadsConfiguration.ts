import { IHubEditableContent } from "../../core/types/IHubEditableContent";
import { canUseExportImageFlow } from "../../downloads/_internal/canUseExportImageFlow";
import { getProp } from "../../objects/get-prop";

export function shouldShowDownloadsConfiguration(
  entity: IHubEditableContent
): boolean {
  const isReferenceLayerEntity =
    ["Feature Service", "Map Service"].includes(entity.type) &&
    /\/\d+$/.test((entity as IHubEditableContent).url);
  const isSingleLayerEntity =
    getProp(entity, "extendedProps.server.layers.length") === 1;
  const isDownloadableImageService = canUseExportImageFlow(entity);

  return (
    isReferenceLayerEntity || isSingleLayerEntity || isDownloadableImageService
  );
}
