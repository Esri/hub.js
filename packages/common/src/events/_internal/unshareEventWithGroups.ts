import { IArcGISContext } from "../../ArcGISContext";
import { IHubEvent } from "../../core/types/IHubEvent";
import { IHubItemEntity } from "../../core/types/IHubItemEntity";
import { updateEvent } from "../api/events";

export async function unshareEventWithGroups(
  groupIds: string[],
  entity: IHubEvent,
  context: IArcGISContext
): Promise<IHubItemEntity> {
  if (groupIds.length) {
    try {
      const {
        readGroups: updatedReadGroupIds,
        editGroups: updatedEditGroupIds,
      } = await updateEvent({
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
      return {
        ...entity,
        readGroupIds: updatedReadGroupIds,
        editGroupIds: updatedEditGroupIds,
      };
    } catch (e) {
      throw new Error(
        `Entity: ${
          entity.id
        } could not be unshared with groups: ${groupIds.join(", ")}`
      );
    }
  } else {
    return entity;
  }
}
