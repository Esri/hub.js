import { setItemAccess } from "@esri/arcgis-rest-portal";
import { IArcGISContext } from "../ArcGISContext";
import { SettableAccessLevel } from "./types/types";
import { IHubItemEntity } from "./types/IHubItemEntity";
import { getTypeFromEntity } from "./getTypeFromEntity";
import { EventAccess } from "../events/api/orval/api/orval-events";
import { updateEvent } from "../events/api/events";

export async function setEntityAccess(
  entity: IHubItemEntity,
  access: SettableAccessLevel,
  context: IArcGISContext
): Promise<void> {
  const type = getTypeFromEntity(entity);
  switch (type) {
    case "event":
      await updateEvent({
        eventId: entity.id,
        data: {
          access: access.toLowerCase() as EventAccess,
        },
        ...context.hubRequestOptions,
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
