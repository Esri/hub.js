import { IArcGISContext } from "../../ArcGISContext";
import HubError from "../../HubError";
import { IHubEvent } from "../../core/types/IHubEvent";
import { hubSearch } from "../../search/hubSearch";
import { EntityType } from "../../search/types";
import { unique } from "../../util";
import { updateEvent } from "../api/events";

export async function shareEventWithGroups(
  groupIds: string[],
  entity: IHubEvent,
  context: IArcGISContext
) {
  if (!context.currentUser) {
    throw new HubError(
      "Share Event With Group",
      "Cannot share event with group when no user is logged in."
    );
  }
  const query = {
    targetEntity: "group" as EntityType,
    filters: [
      {
        predicates: [{ id: groupIds }],
      },
    ],
  };
  const { results: groups } = await hubSearch(query, {
    requestOptions: context.hubRequestOptions,
    num: 100,
  });
  const { readGroups, editGroups } = groups.reduce<{
    readGroups: string[];
    editGroups: string[];
  }>(
    (acc, group) => {
      const key = group.isSharedUpdate ? "editGroups" : "readGroups";
      return { ...acc, [key]: [...acc[key], group.id] };
    },
    { readGroups: [], editGroups: [] }
  );
  try {
    await updateEvent({
      eventId: entity.id,
      data: {
        readGroups: [...entity.readGroups, ...readGroups].filter(unique),
        editGroups: [...entity.editGroups, ...editGroups].filter(unique),
      },
      ...context.hubRequestOptions,
    });
  } catch (e) {
    throw new Error(
      `Entity: ${entity.id} could not be shared with groups: ${groupIds.join(
        ", "
      )}`
    );
  }
}
