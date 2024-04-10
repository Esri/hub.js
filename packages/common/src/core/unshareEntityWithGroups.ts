import { HubEntityType } from "./types/HubEntityType";
import { IArcGISContext } from "../ArcGISContext";
import { unshareItemEntityWithGroups } from "./_internal/unshareItemEntityWithGroups";
import { IHubItemEntity } from "./types/IHubItemEntity";
import { unshareEventWithGroups } from "../events/_internal/unshareEventWithGroups";
import { IHubEvent } from "./types/IHubEvent";

export async function unshareEntityWithGroups(
  type: HubEntityType,
  entity: IHubItemEntity,
  groupIds: string[],
  context: IArcGISContext
): Promise<void> {
  switch (type) {
    case "event":
      await unshareEventWithGroups(groupIds, entity as IHubEvent, context);
      break;
    default:
      await unshareItemEntityWithGroups(groupIds, entity, context);
      break;
  }
}
