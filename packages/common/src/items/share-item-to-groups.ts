import { IRequestOptions } from "@esri/arcgis-rest-request";
import {
  shareItemWithGroup,
  IGroupSharingOptions,
  ISharingResponse,
  searchGroups,
  ISearchResult,
  IGroup,
} from "@esri/arcgis-rest-portal";
import { poll } from "../utils/poll";

/**
 * Share an item to a set of groups
 * @param {String} itemId Iten Id to share to the groups
 * @param {Array} groupIds Array of group id's to which the item will be shared
 * @param {String} owner optional Owner username to determine which endpoint to hit
 * @param {*} requestOptions
 */
export async function shareItemToGroups(
  itemId: string,
  groupIds: string[],
  requestOptions: IRequestOptions,
  owner?: string
): Promise<ISharingResponse[]> {
  const fn: () => Promise<ISearchResult<IGroup>> = searchGroups.bind(
    undefined,
    {
      q: `id:(${groupIds.join(" OR ")})`,
      num: groupIds.length,
      ...requestOptions,
    }
  );
  const validate = (resp: ISearchResult<IGroup>) =>
    resp.results.length === groupIds.length;
  let groups: IGroup[];
  try {
    ({ results: groups } = groupIds.length
      ? await poll<ISearchResult<IGroup>>(fn, validate, {
          timeBetweenRequests: 300,
        })
      : ({ results: [] } as ISearchResult<IGroup>));
  } catch (e) {
    throw new Error(
      `Error sharing item: ${itemId} with groups: ${groupIds.join(", ")}`
    );
  }
  return Promise.all(
    groups.map(async (group) => {
      const opt = {
        ...requestOptions,
        id: itemId,
        groupId: group.id,
        owner,
        confirmItemControl: group.capabilities.includes("updateitemcontrol"),
      } as IGroupSharingOptions;
      try {
        const res = await shareItemWithGroup(opt);
        return res;
      } catch (e) {
        throw new Error(
          `Error sharing item: ${itemId} with group: ${group.id}`
        );
      }
    })
  );
}
