/* Copyright (c) 2018 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

import { IRequestOptions } from "@esri/arcgis-rest-request";
import { IInitiativeModel, camelize } from "@esri/hub-common";
import { getInitiative } from "./get";
import {
  createInitiativeModelFromTemplate,
  IInitiativeGroupIds,
  IInitiativeTemplateOptions
} from "./templates";
import { addInitiative } from "./add";
import { copyImageResources, copyEmbeddedImageResources } from "./util";
import {
  shareItemWithGroup,
  IGroupSharingOptions
} from "@esri/arcgis-rest-portal";
import { getProp } from "@esri/hub-common";

/**
 * Activate an Initiative
 * Creates an instance of an Initiative, based on an Initiative Template.
 *
 * @export
 * @param {string | any} template Initiative Template item or Id
 * @param {string} title
 * @param {any} groupIds hash of group props and ids
 * @param {IRequestOptions} requestOptions
 * @returns {Promise<IInitiativeModel>}
 */
export function activateInitiative(
  template: string | any,
  title: string,
  groupIds: IInitiativeGroupIds,
  requestOptions: IRequestOptions
): Promise<IInitiativeModel> {
  // make a copy of the request options so we can mutate things if needed...
  const ro = { ...requestOptions } as IRequestOptions;
  // create a state container to hold things we accumulate through the various promises
  const state = {
    initiativeKey: camelize(title)
  } as any;
  let promise;
  if (typeof template === "string") {
    promise = getInitiative(template, ro);
  } else {
    promise = Promise.resolve(template);
  }
  return promise
    .then(async (templateItemModel: any) => {
      state.template = templateItemModel;
      // construct the options...
      const options = {
        title,
        description: title,
        initiativeKey: state.initiativeKey,
        groupIds
      } as IInitiativeTemplateOptions;
      // cook the template...
      state.initiativeModel = createInitiativeModelFromTemplate(
        state.template,
        options
      );
      // now save it...
      return addInitiative(state.initiativeModel, ro);
    })
    .then((newModel: IInitiativeModel) => {
      state.initiativeModel = newModel;
      const assets = getProp(state, "template.assets");
      if (assets) {
        return copyEmbeddedImageResources(
          newModel.item.id,
          newModel.item.owner,
          assets,
          ro
        );
      } else {
        const { id, owner } = newModel.item;
        const wellKnownAssets = [
          "detail-image.jpg",
          "icon-dark.png",
          "icon-light.png"
        ];
        // now copy assets from the parent initiative...
        return copyImageResources(
          state.template.item.id,
          id,
          owner,
          wellKnownAssets,
          ro
        );
      }
    })
    .then(
      (): Promise<any> => {
        const collaborationGroupId = getProp(
          state,
          "initiativeModel.item.properties.collaborationGroupId"
        );
        if (collaborationGroupId) {
          // create sharing options and share to the core team
          const shareOptions = {
            id: state.initiativeModel.item.id,
            groupId: collaborationGroupId,
            confirmItemControl: true,
            ...requestOptions
          } as IGroupSharingOptions;
          return shareItemWithGroup(shareOptions);
        } else {
          return Promise.resolve({ success: true });
        }
      }
    )
    .then(() => {
      return state.initiativeModel;
    });
}
