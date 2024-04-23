import { IArcGISContext } from "../../ArcGISContext";
import { IHubEditableContent } from "../../core/types/IHubEditableContent";
import { isHostedFeatureServiceEntity } from "../../content/hostedServiceUtils";
import { isMapOrFeatureServiceEntity } from "./isMapOrFeatureServiceEntity";

export function canUseHubDownloadApi(
  entity: IHubEditableContent,
  context: IArcGISContext
): boolean {
  // TODO: use permission instead.
  const isPublicMapOrFeatureService =
    isMapOrFeatureServiceEntity(entity) && entity.access === "public";
  const isPrivateHostedFeatureServiceWithExtractEnabled =
    isHostedFeatureServiceEntity(entity) &&
    entity.serverExtractCapability &&
    entity.access !== "public";
  return (
    !context.isPortal &&
    (isPublicMapOrFeatureService ||
      isPrivateHostedFeatureServiceWithExtractEnabled)
  );
}
