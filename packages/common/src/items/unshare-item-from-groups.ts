import {
  unshareItemWithGroup,
  IGroupSharingOptions,
  ISharingResponse
} from "@esri/arcgis-rest-portal";
import { IRequestOptions } from "@esri/arcgis-rest-request";

/**
 * Unshare an item from a set of groups
 * @param {String} itemId Item Id to unshare from groups
 * @param {Array} groups Array of group id's from which the item will be unshared
 * @param {IRequestOptions} requestOptions
 */
export function unshareItemFromGroups(
  itemId: string,
  groups: string[],
  requestOptions: IRequestOptions
): Promise<ISharingResponse[]> {
  return Promise.all(
    groups.map(groupId => {
      const opt = Object.assign(
        {},
        { id: itemId, groupId },
        requestOptions
      ) as IGroupSharingOptions;
      return unshareItemWithGroup(opt);
    })
  );
}
