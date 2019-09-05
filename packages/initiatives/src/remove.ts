/* Copyright (c) 2018 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */
import { IRequestOptions } from "@esri/arcgis-rest-request";
import { removeInitiativeGroup } from "./groups";
import { getInitiative } from "./get";
import { detachSiteFromInitiative } from "./detach-site";
import {
  getItem,
  removeItem,
  unprotectItem,
  getSelf,
  IUserItemOptions
} from "@esri/arcgis-rest-portal";
import { getProp, createId } from "@esri/hub-common";

/**
 * Remove an Initiative, and its associated groups.
 * If the initiative has a site, it will be shared to
 * the organization's main collaboration group
 * @export
 * @param {string} id
 * @param {IRequestOptions} requestOptions
 * @returns {Promise<any>}
 */
export function removeInitiative(
  id: string,
  requestOptions: IRequestOptions
): Promise<any> {
  const state = {
    id
  } as any;
  const processId = createId("remove-");
  const startTS = new Date().getTime();
  // first get the item, because we need to also remove the
  // collaboration and open data groups...
  // and the Portal because w need the org's default
  // collaboration group id
  return Promise.all([
    getInitiative(id, requestOptions),
    getSelf(requestOptions)
  ])
    .then(async results => {
      const model = results[0];
      const portal = results[1];
      const siteId = model.item.properties.siteId;
      if (siteId) {
        try {
          await getItem(siteId, requestOptions);
          state.hasSite = true;
          state.siteId = siteId;
        } catch (e) {
          state.hasSite = false;
        }
      } else {
        state.hasSite = false;
      }
      state.initiativeOwner = model.item.owner;
      state.collaborationGroupId = getProp(
        portal,
        "properties.openData.settings.groupId"
      );
      // remove the groups...
      const prms = [] as any[];
      ["collaborationGroupId", "contentGroupId", "followersGroupId"].forEach(
        prop => {
          if (model.item.properties[prop]) {
            prms.push(
              removeInitiativeGroup(
                model.item.properties[prop],
                requestOptions
              ).catch(() => Promise.resolve(true)) // swallow group delete failures
            );
          }
        }
      );
      // if the item is protected, un-protect it...
      if (model.item.protected) {
        const opts = {
          id,
          ...requestOptions
        } as IUserItemOptions;
        prms.push(unprotectItem(opts));
      }
      return Promise.all(prms);
    })
    .then(() => {
      const prms = [];
      const opts = {
        id,
        owner: state.initiativeOwner,
        ...requestOptions
      } as IUserItemOptions;
      prms.push(removeItem(opts));
      // if we have a site, let's detach it from the initiative
      if (state.hasSite) {
        prms.push(
          detachSiteFromInitiative(
            state.siteId,
            state.collaborationGroupId,
            requestOptions
          )
        );
      }
      return Promise.all(prms);
    })
    .then(() => {
      return { success: true };
    });
}
