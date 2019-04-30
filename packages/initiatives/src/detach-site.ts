/* Copyright (c) 2018 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */
import { IRequestOptions } from "@esri/arcgis-rest-request";
import {
  getItem,
  updateItem,
  shareItemWithGroup,
  IItem,
  IUpdateItemOptions,
  IGroupSharingOptions
} from "@esri/arcgis-rest-portal";
/**
 * Remove the linkage between a site and an Initiative
 * Share the site to the Org's default Collaboration Group
 *
 * @export
 * @param {string} siteId
 * @param {*} collaborationGroupId
 * @param {IRequestOptions} requestOptions
 * @returns {Promise<any>}
 */
export function detachSiteFromInitiative(
  siteId: string,
  collaborationGroupId: any,
  requestOptions: IRequestOptions
): Promise<any> {
  // get the site item
  return getItem(siteId, requestOptions)
    .then((site: IItem) => {
      // remove the properties.parentInitiativeId property
      delete site.properties.parentInitiativeId;
      if (collaborationGroupId) {
        // reset the collaborationGroupId to the org's Open Data Group
        site.properties.collaborationGroupId = collaborationGroupId;
      }
      // update the site item
      const opts = {
        item: site,
        ...requestOptions
      } as any;
      return updateItem(opts as IUpdateItemOptions);
    })
    .then(() => {
      // share it with the group if we got a group...
      if (collaborationGroupId) {
        const opts = {
          id: siteId,
          groupId: collaborationGroupId,
          ...requestOptions
        } as IGroupSharingOptions;
        return shareItemWithGroup(opts) as Promise<any>;
      } else {
        return Promise.resolve({ success: true });
      }
    });
}
