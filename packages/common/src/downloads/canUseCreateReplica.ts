import { isAGOFeatureServiceUrl } from "../content/hostedServiceUtils";
import { IHubEditableContent } from "../core/types/IHubEditableContent";

/**
 * Determines whether Hub can perform the /createReplica operation on a given service entity.
 * @param entity entity to check
 * @returns whether the /createReplica operation can be used
 */
export function canUseCreateReplica(entity: IHubEditableContent): boolean {
  // NOTE: We currently do not allow Hub to perform the /createReplica operation on enterprise / self-hosted
  // feature services due to known limitations with the enterprise implementation of /createReplica.
  // This is a temporary restriction until the enterprise implementation is improved.
  return isAGOFeatureServiceUrl(entity.url) && !!entity.serverExtractCapability;
}
