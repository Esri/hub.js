import { IGroup, ISearchResult, searchGroups } from "@esri/arcgis-rest-portal";
import type { IArcGISContext } from "../../IArcGISContext";
import { IHubEvent } from "../../core/types/IHubEvent";
import { unique } from "../../util";
import { updateEvent } from "../api/events";
import { poll } from "../../utils/poll";

/**
 * Shares an event with one or more groups
 * @param groupIds An array of group IDs to share the event with
 * @param entity An IHubEvent object
 * @param context An IArcGISContext object
 * @returns a promise that resolves IHubItemEntity
 */
export async function shareEventWithGroups(
  groupIds: string[],
  entity: IHubEvent,
  context: IArcGISContext
): Promise<IHubEvent> {
  const fn: () => Promise<ISearchResult<IGroup>> = searchGroups.bind(
    undefined,
    {
      q: `id:(${groupIds.join(" OR ")})`,
      num: groupIds.length,
      ...context.requestOptions,
    }
  );
  const validate = (resp: ISearchResult<IGroup>) =>
    resp.results.length === groupIds.length;
  if (groupIds.length) {
    try {
      // We poll for the expected group results as newly created groups aren't immediately available in the
      // AGO group search index. Polling here eliminates the need for us to potentially implement this polling
      // in multiple places in our app where we create new groups from. In the majority of cases, this will only fire
      // a single request.
      const { results: groups } = await poll<ISearchResult<IGroup>>(
        fn,
        validate
      );
      const { readGroupIds, editGroupIds } = groups.reduce<{
        readGroupIds: string[];
        editGroupIds: string[];
      }>(
        (acc, group) => {
          const key = group.capabilities.includes("updateitemcontrol")
            ? "editGroupIds"
            : "readGroupIds";
          return { ...acc, [key]: [...acc[key], group.id] };
        },
        { readGroupIds: [], editGroupIds: [] }
      );
      const {
        readGroups: updatedReadGroupIds,
        editGroups: updatedEditGroupIds,
      } = await updateEvent({
        eventId: entity.id,
        data: {
          readGroups: [...entity.readGroupIds, ...readGroupIds].filter(unique),
          editGroups: [...entity.editGroupIds, ...editGroupIds].filter(unique),
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
        `Entity: ${entity.id} could not be shared with groups: ${groupIds.join(
          ", "
        )}`
      );
    }
  } else {
    return entity;
  }
}
