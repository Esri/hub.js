import { IArcGISContext } from "../ArcGISContext";
import { IHubEditableContent } from "../core/types/IHubEditableContent";
import { canUseCreateReplica } from "./canUseCreateReplica";

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
  const canUsePagingJobs =
    ["Feature Service", "Map Service"].includes(entity.type) &&
    entity.access === "public";

  return (
    isDownloadApiAvailable && (canUsePagingJobs || canUseCreateReplica(entity))
  );
}
