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
): Promise<void> {
  const type = getTypeFromEntity(entity);
  switch (type) {
    case "event":
      await shareEventWithGroups(groupIds, entity as IHubEvent, context);
      break;
    default:
      // await shareItemEntityWithGroups(groupIds, entity, context);
      await shareItemToGroups(
        entity.id,
        groupIds,
        context.requestOptions,
        entity.owner
      );
      break;
  }
}
