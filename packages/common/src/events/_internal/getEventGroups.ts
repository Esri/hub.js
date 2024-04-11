import { IRequestOptions } from "@esri/arcgis-rest-request";
import { IGroup, ISearchResult, searchGroups } from "@esri/arcgis-rest-portal";
import { IHubEvent } from "../../core/types/IHubEvent";

export async function getEventGroups(
  entity: IHubEvent,
  requestOptions: IRequestOptions
) {
  const { readGroupIds, editGroupIds } = entity;
  const search = (ids: string[]): Promise<ISearchResult<IGroup>> =>
    ids.length
      ? searchGroups({
          q: `id:(${ids.join(" OR ")})`,
          num: ids.length,
          ...requestOptions,
        })
      : Promise.resolve({ results: [] } as ISearchResult<IGroup>);
  const [{ results: readGroups }, { results: editGroups }] = await Promise.all(
    [readGroupIds, editGroupIds].map(search)
  );
  return [...readGroups, ...editGroups];
}
