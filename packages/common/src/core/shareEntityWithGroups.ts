import { HubEntityType } from "./types/HubEntityType";
import { IArcGISContext } from "../ArcGISContext";
import { shareItemEntityWithGroups } from "./_internal/shareItemEntityWithGroups";
import { IHubItemEntity } from "./types/IHubItemEntity";
import { shareEventWithGroups } from "../events/_internal/shareEventWithGroups";
import { IHubEvent } from "./types/IHubEvent";

export async function shareEntityWithGroups(
  type: HubEntityType,
  entity: IHubItemEntity,
  groupIds: string[],
  context: IArcGISContext
): Promise<void> {
  switch (type) {
    case "event":
      await shareEventWithGroups(groupIds, entity as IHubEvent, context);
      break;
    default:
      await shareItemEntityWithGroups(groupIds, entity, context);
      break;
  }
}
