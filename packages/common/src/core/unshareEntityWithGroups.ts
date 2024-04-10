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
): Promise<IHubItemEntity> {
  const type = getTypeFromEntity(entity);
  let results: IHubItemEntity;
  switch (type) {
    case "event":
      results = await unshareEventWithGroups(
        groupIds,
        entity as IHubEvent,
        context
      );
      break;
    default:
      results = entity;
      await unshareItemFromGroups(
        entity.id,
        groupIds,
        context.requestOptions,
        entity.owner
      );
      break;
  }
  return results;
}
