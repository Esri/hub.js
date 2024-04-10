import { IGroup, ISearchResult, searchGroups } from "@esri/arcgis-rest-portal";
import { IArcGISContext } from "../../ArcGISContext";
import { IHubEvent } from "../../core/types/IHubEvent";
import { unique } from "../../util";
import { updateEvent } from "../api/events";
import { poll } from "../../utils/poll";
import { IHubItemEntity } from "../../core/types/IHubItemEntity";

export async function shareEventWithGroups(
  groupIds: string[],
  entity: IHubEvent,
  context: IArcGISContext
): Promise<IHubItemEntity> {
  const fn: () => Promise<ISearchResult<IGroup>> = searchGroups.bind(
    undefined,
    {
      q: `id:(${groupIds.join(",")})`,
      num: groupIds.length,
      ...context.requestOptions,
    }
  );
  const validate = (resp: ISearchResult<IGroup>) =>
    resp?.results?.length === groupIds.length;
  try {
    const { results: groups } = groupIds.length
      ? await poll<ISearchResult<IGroup>>(fn, validate, {
          timeBetweenRequests: 300,
        })
      : ({ results: [] } as ISearchResult<IGroup>);
    const { readGroupIds, editGroupIds } = groups.reduce<{
      readGroupIds: string[];
      editGroupIds: string[];
    }>(
      (acc, group) => {
        const key = group.capabilities?.includes("updateitemcontrol")
          ? "editGroupIds"
          : "readGroupIds";
        return { ...acc, [key]: [...acc[key], group.id] };
      },
      { readGroupIds: [], editGroupIds: [] }
    );
    await updateEvent({
      eventId: entity.id,
      data: {
        readGroups: [...entity.readGroupIds, ...readGroupIds].filter(unique),
        editGroups: [...entity.editGroupIds, ...editGroupIds].filter(unique),
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
      `Entity: ${entity.id} could not be shared with groups: ${groupIds.join(
        ", "
      )}`
    );
  }
}
