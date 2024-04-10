import { IArcGISContext } from "../../ArcGISContext";
import HubError from "../../HubError";
import { IHubEvent } from "../../core/types/IHubEvent";
import { hubSearch } from "../../search/hubSearch";
import { EntityType } from "../../search/types";
import { unique } from "../../util";
import { updateEvent } from "../api/events";

export async function unshareEventWithGroups(
  groupIds: string[],
  entity: IHubEvent,
  context: IArcGISContext
) {
  if (!context.currentUser) {
    throw new HubError(
      "Unshare Event With Group",
      "Cannot unshare event with group when no user is logged in."
    );
  }
  try {
    await updateEvent({
      eventId: entity.id,
      data: {
        readGroups: entity.readGroupIds.filter(
          (groupId) => !groupIds.includes(groupId)
        ),
        editGroups: entity.editGroupIds.filter(
          (groupId) => !groupIds.includes(groupId)
        ),
      },
      ...context.hubRequestOptions,
    });
  } catch (e) {
    throw new Error(
      `Entity: ${entity.id} could not be unshared with groups: ${groupIds.join(
        ", "
      )}`
    );
  }
}
