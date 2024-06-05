import { IArcGISContext } from "../ArcGISContext";
import { IHubEditableContent } from "../core/types/IHubEditableContent";
import { canUseCreateReplica } from "./canUseCreateReplica";
import { canUseHubDownloadSystem } from "./canUseHubDownloadSystem";

/**
 * Determines if the Hub Download API can be used for the given entity.
 * @param entity entity to check if Hub Download API can be used
 * @param context ArcGIS context
 * @returns whether the Hub Download API can be used
 */
export function canUseHubDownloadApi(
  entity: IHubEditableContent,
  context: IArcGISContext
): boolean {
  const isDownloadApiAvailable =
    context.serviceStatus?.["hub-downloads"] === "online";

  return (
    isDownloadApiAvailable &&
    (canUseHubDownloadSystem(entity) || canUseCreateReplica(entity))
  );
}
