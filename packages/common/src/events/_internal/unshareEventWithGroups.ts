import type { IArcGISContext } from "../../IArcGISContext";
import { IHubEvent } from "../../core/types/IHubEvent";
import { updateEvent } from "../api/events";

/**
 * Unshares an event with one or more groups
 * @param groupIds An array of group IDs to unshare the group from
 * @param entity An IHubEvent object
 * @param context An IArcGISContext object
 * @returns An updated IHubEvent object
 */
export async function unshareEventWithGroups(
  groupIds: string[],
  entity: IHubEvent,
  context: IArcGISContext
): Promise<IHubEvent> {
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
