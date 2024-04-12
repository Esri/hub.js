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
 * @param {String} itemId Item Id to share to the groups
 * @param {Array} groupIds Array of group id's to which the item will be shared
 * @param {IRequestOptions} requestOptions
 * @param {String} owner optional Owner username to determine which endpoint to hit
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
    // We poll for the expected group results as newly created groups aren't immediately available in the
    // AGO group search index. Polling here eliminates the need for us to potentially implement this polling
    // in multiple places in our app where we create new groups from. In the majority of cases, this will only fire
    // a single request.
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
