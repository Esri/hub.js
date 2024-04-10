import { IArcGISContext } from "../../ArcGISContext";
import { IHubEvent } from "../../core/types/IHubEvent";
import { IHubItemEntity } from "../../core/types/IHubItemEntity";
import { updateEvent } from "../api/events";

export async function unshareEventWithGroups(
  groupIds: string[],
  entity: IHubEvent,
  context: IArcGISContext
): Promise<IHubItemEntity> {
  try {
    const { readGroups: readGroupIds, editGroups: editGroupIds } =
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
    return {
      ...entity,
      readGroupIds,
      editGroupIds,
    };
  } catch (e) {
    throw new Error(
      `Entity: ${entity.id} could not be unshared with groups: ${groupIds.join(
        ", "
      )}`
    );
  }
}
