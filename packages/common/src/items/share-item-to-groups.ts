import { IRequestOptions } from "@esri/arcgis-rest-request";
import {
  shareItemWithGroup,
  IGroupSharingOptions,
} from "@esri/arcgis-rest-portal";

/**
 * Share an item to a set of groups
 * @param {String} itemId Iten Id to share to the groups
 * @param {Array} groups Array of group id's to which the item will be shared
 * @param {String} owner Owner username to determine which endpoint to hit
 * @param {*} requestOptions
 */
export function shareItemToGroups(
  itemId: string,
  groups: string[],
  requestOptions: IRequestOptions,
  owner: string
) {
  return Promise.all(
    groups.map((groupId: string) => {
      const opt = Object.assign(
        {},
        { id: itemId, groupId, owner },
        requestOptions
      ) as IGroupSharingOptions;
      return shareItemWithGroup(opt);
    })
  );
}
