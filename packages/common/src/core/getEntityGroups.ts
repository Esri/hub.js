import { IGroup } from "@esri/arcgis-rest-portal";
import type { IArcGISContext } from "../IArcGISContext";
import { getEventGroups } from "../events/getEventGroups";
import { sharedWith } from "./_internal/sharedWith";
import { getTypeFromEntity } from "./getTypeFromEntity";
import { IHubItemEntity } from "./types/IHubItemEntity";

/**
 * Fetches an array of groups the entity is shared with
 * @param entity An IHubItemEntity
 * @param context An IArcGISContext
 * @returns a promise that resolves an array of groups the entity is shared with
 */
export async function getEntityGroups(
  entity: IHubItemEntity,
  context: IArcGISContext
): Promise<IGroup[]> {
  const type = getTypeFromEntity(entity);
  let groups;
  switch (type) {
    case "event":
      groups = await getEventGroups(entity.id, context);
      break;
    default:
      groups = await sharedWith(entity.id, context.requestOptions);
      break;
  }
  return groups;
}
