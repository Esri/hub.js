import { IArcGISContext } from "../../ArcGISContext";
import { SettableAccessLevel } from "../../core/types/types";
import { IHubItemEntity } from "../../core/types/IHubItemEntity";
import HubError from "../../HubError";
import { updateEvent } from "../api/events";
import { EventAccess } from "../api";

export async function setEventAccess(
  access: SettableAccessLevel,
  entity: IHubItemEntity,
  context: IArcGISContext
) {
  if (!context.currentUser) {
    throw new HubError(
      "Change event access",
      "Cannot change event access when no user is logged in."
    );
  }
  await updateEvent({
    eventId: entity.id,
    data: {
      access: access.toLowerCase() as EventAccess,
    },
    ...context.hubRequestOptions,
  });
}
