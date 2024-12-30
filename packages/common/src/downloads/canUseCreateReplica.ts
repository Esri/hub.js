import {
  isAGOFeatureServiceUrl,
  isHostedFeatureServiceMainEntity,
} from "../content/hostedServiceUtils";
import { IHubEditableContent } from "../core/types/IHubEditableContent";
import { getProp } from "../objects/get-prop";

/**
 * Determines whether Hub can perform the /createReplica operation on a given service entity.
 * @param entity entity to check
 * @returns whether the /createReplica operation can be used
 */
export function canUseCreateReplica(entity: IHubEditableContent): boolean {
  // All AGO feature services can use the /createReplica operation
  // TODO: Note why only some enterprise services can use the /createReplica operation
  const isEligibleService =
    isAGOFeatureServiceUrl(entity.url) ||
    isHostedFeatureServiceMainEntity(entity);
  const hasExtractCapability = !!getProp(
    entity,
    "extendedProps.serverExtractCapability"
  );
  return isEligibleService && hasExtractCapability;
}
