import { HubEntityType } from "./types/HubEntityType";
import { IArcGISContext } from "../ArcGISContext";
import { IHubItemEntity } from "./types/IHubItemEntity";
import { setEventAccess } from "../events/_internal/setEventAccess";
import { IHubEvent } from "./types/IHubEvent";
import { SettableAccessLevel } from "./types/types";
import { setItemAccess } from "./_internal/setItemAccess";

export async function setEntityAccess(
  type: HubEntityType,
  entity: IHubItemEntity,
  access: SettableAccessLevel,
  context: IArcGISContext
): Promise<void> {
  switch (type) {
    case "event":
      await setEventAccess(access, entity as IHubEvent, context);
      break;
    default:
      await setItemAccess(access, entity, context);
      break;
  }
}
