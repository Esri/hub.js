import type { IArcGISContext } from "../IArcGISContext";
import { shareEventWithGroups } from "../events/_internal/shareEventWithGroups";
import { IHubEvent } from "./types/IHubEvent";
import { IHubItemEntity } from "./types/IHubItemEntity";
import { getTypeFromEntity } from "./getTypeFromEntity";
import { shareItemToGroups } from "../items/share-item-to-groups";

/**
 * Shares an entity to one or more groups
 * @param entity An IHubItemEntity object
 * @param groupIds An array of group IDs to share the entity to
 * @param context An IArcGISContext object
 * @returns a promise that resolves the updated entity
 */
export async function shareEntityWithGroups(
  entity: IHubItemEntity,
  groupIds: string[],
  context: IArcGISContext
): Promise<IHubItemEntity> {
  const type = getTypeFromEntity(entity);
  let results: IHubItemEntity;
  switch (type) {
    case "event":
      results = await shareEventWithGroups(
        groupIds,
        entity as IHubEvent,
        context
      );
      break;
    default:
      results = entity;
      await shareItemToGroups(
        entity.id,
        groupIds,
        context.requestOptions,
        entity.owner
      );
      break;
  }
  return results;
}
