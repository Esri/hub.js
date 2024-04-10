import { IArcGISContext } from "../ArcGISContext";
import { shareEventWithGroups } from "../events/_internal/shareEventWithGroups";
import { IHubEvent } from "./types/IHubEvent";
import { IHubItemEntity } from "./types/IHubItemEntity";
import { getTypeFromEntity } from "./getTypeFromEntity";
import { shareItemToGroups } from "../items/share-item-to-groups";

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
