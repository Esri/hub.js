import { IArcGISContext } from "../ArcGISContext";
import { getEventGroups } from "../events/_internal/getEventGroups";
import { sharedWith } from "./_internal/sharedWith";
import { getTypeFromEntity } from "./getTypeFromEntity";
import { IHubEvent } from "./types/IHubEvent";
import { IHubItemEntity } from "./types/IHubItemEntity";

export async function getEntityGroups(
  entity: IHubItemEntity,
  context: IArcGISContext
) {
  const type = getTypeFromEntity(entity);
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
