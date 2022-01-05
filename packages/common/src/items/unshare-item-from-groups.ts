import {
  unshareItemWithGroup,
  IGroupSharingOptions,
  ISharingResponse,
} from "@esri/arcgis-rest-portal";
import { IRequestOptions } from "@esri/arcgis-rest-request";

/**
 * Unshare an item from a set of groups
 * @param {String} itemId Item Id to unshare from groups
 * @param {Array} groups Array of group id's from which the item will be unshared
 * @param {String} owner optional Owner username to determine which endpoint to hit
 * @param {IRequestOptions} requestOptions
 */
export function unshareItemFromGroups(
  itemId: string,
  groups: string[],
  requestOptions: IRequestOptions,
  owner?: string
): Promise<ISharingResponse[]> {
  return Promise.all(
    groups.map((groupId) => {
      const opt = Object.assign(
        {},
        { id: itemId, groupId },
        requestOptions
      ) as IGroupSharingOptions;
      if (owner) {
        opt.owner = owner;
      }
      return unshareItemWithGroup(opt);
    })
  );
}
