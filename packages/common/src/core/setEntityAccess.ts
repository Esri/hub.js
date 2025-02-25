import { setItemAccess, updateGroup } from "@esri/arcgis-rest-portal";
import type { IArcGISContext } from "../IArcGISContext";
import { SettableAccessLevel } from "./types/types";
import { getTypeFromEntity } from "./getTypeFromEntity";
import { EventAccess } from "../events/api/orval/api/orval-events";
import { updateEvent } from "../events/api/events";
import { HubEntity } from "./types/HubEntity";

/**
 * Sets an entity's access to the given access
 * @param entity A HubEntity object
 * @param access The access to set the entity to
 * @param context An IArcGISContext object
 * @returns a promise
 */
export async function setEntityAccess(
  entity: HubEntity,
  access: SettableAccessLevel,
  context: IArcGISContext
): Promise<void> {
  const type = getTypeFromEntity(entity);
  switch (type) {
    case "event":
      await updateEvent({
        eventId: entity.id,
        data: {
          access: access.toUpperCase() as EventAccess,
        },
        ...context.hubRequestOptions,
      });
      break;
    case "group":
      await updateGroup({
        group: {
          id: entity.id,
          access,
        },
        authentication: context.session,
      });
      break;
    default:
      await setItemAccess({
        id: entity.id,
        access,
        owner: entity.owner,
        authentication: context.session,
      });
      break;
  }
}
