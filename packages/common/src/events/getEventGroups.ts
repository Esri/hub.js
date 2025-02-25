import { IGroup, ISearchResult, searchGroups } from "@esri/arcgis-rest-portal";
import { getEvent } from "./api/events";
import type { IArcGISContext } from "../IArcGISContext";

/**
 * Fetches the groups an event is shared with
 * @param eventId The ID of the event to fetch the groups for
 * @param context An IArcGISContext object
 * @returns
 */
export async function getEventGroups(
  eventId: string,
  context: IArcGISContext
): Promise<IGroup[]> {
  const { editGroups: editGroupIds, readGroups: readGroupIds } = await getEvent(
    {
      eventId,
      ...context.hubRequestOptions,
    }
  );
  const search = (ids: string[]): Promise<ISearchResult<IGroup>> =>
    ids.length
      ? searchGroups({
          q: `id:(${ids.join(" OR ")})`,
          num: ids.length,
          ...context.requestOptions,
        })
      : Promise.resolve({ results: [] } as ISearchResult<IGroup>);
  const [{ results: readGroups }, { results: editGroups }] = await Promise.all(
    [readGroupIds, editGroupIds].map(search)
  );
  return [...readGroups, ...editGroups];
}
