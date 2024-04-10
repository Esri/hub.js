import { IArcGISContext } from "../ArcGISContext";
import { unshareEventWithGroups } from "../events/_internal/unshareEventWithGroups";
import { IHubEvent } from "./types/IHubEvent";
import { IHubItemEntity } from "./types/IHubItemEntity";
import { getTypeFromEntity } from "./getTypeFromEntity";
import { unshareItemFromGroups } from "../items/unshare-item-from-groups";

export async function unshareEntityWithGroups(
  entity: IHubItemEntity,
  groupIds: string[],
  context: IArcGISContext
): Promise<void> {
  const type = getTypeFromEntity(entity);
  switch (type) {
    case "event":
      await unshareEventWithGroups(groupIds, entity as IHubEvent, context);
      break;
    default:
      await unshareItemFromGroups(
        entity.id,
        groupIds,
        context.requestOptions,
        entity.owner
      );
      break;
  }
}
