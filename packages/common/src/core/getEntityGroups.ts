import { IArcGISContext } from "../ArcGISContext";
import { getEventGroups } from "../events/_internal/getEventGroups";
import { sharedWith } from "./_internal/sharedWith";
import { HubEntityType } from "./types/HubEntityType";
import { IHubEvent } from "./types/IHubEvent";
import { IHubItemEntity } from "./types/IHubItemEntity";

export async function getEntityGroups(
  type: HubEntityType,
  entity: IHubItemEntity,
  context: IArcGISContext
) {
  let groups;
  switch (type) {
    case "event":
      groups = await getEventGroups(
        entity as IHubEvent,
        context.requestOptions
      );
      break;
    default:
      groups = await sharedWith(entity.id, context.requestOptions);
      break;
  }
  return groups;
}
