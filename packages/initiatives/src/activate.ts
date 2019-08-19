/* Copyright (c) 2018 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

import { IRequestOptions } from "@esri/arcgis-rest-request";
import { IInitiativeModel, createId, camelize } from "@esri/hub-common";
import { getInitiative } from "./get";
import { createInitiativeGroups } from "./groups";
import {
  createInitiativeModelFromTemplate,
  IInitiativeTemplateOptions
} from "./templates";
import { addInitiative } from "./add";
import { copyImageResources, copyEmbeddedImageResources } from "./util";
import {
  shareItemWithGroup,
  IGroupSharingOptions
} from "@esri/arcgis-rest-portal";
import { getProp } from "@esri/hub-common";

export const steps = [
  {
    id: "createGroup",
    status: "not-started"
  },
  {
    id: "copyTemplate",
    status: "not-started"
  },
  {
    id: "createInitiative",
    status: "not-started"
  },
  {
    id: "shareInitiative",
    status: "not-started"
  }
];

/**
 * Activate an Initiative
 * Creates an instance of an Initiative, based on an Initiative Template.
 *
 * @export
 * @param {string | any} template Initiative Template item or Id
 * @param {string} title
 * @param {string} collaborationGroupName
 * @param {string} dataGroupName
 * @param {(n: any) => any} progressCallback
 * @param {IRequestOptions} requestOptions
 * @returns {Promise<IInitiativeModel>}
 */
export function activateInitiative(
  template: string | any,
  title: string,
  collaborationGroupName: string,
  dataGroupName: string,
  progressCallback: (n: any) => any,
  requestOptions: IRequestOptions
): Promise<IInitiativeModel> {
  // make a copy of the request options so we can mutate things if needed...
  const ro = { ...requestOptions } as IRequestOptions;
  const processId = createId("activation-");
  const startTS = new Date().getTime();
  // send the setup to the progress callback
  progressCallback({
    processId,
    steps
  });
  progressCallback({
    processId,
    status: "working",
    activeStep: "createGroup"
  });
  // create a state container to hold things we accumulate thru the
  // various promises
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
      progressCallback({
        processId,
        status: "working",
        activeStep: "copyTemplate"
      });
      state.template = templateItemModel;
      return createInitiativeGroups(collaborationGroupName, dataGroupName, ro);
    })
    .then(groupIds => {
      progressCallback({
        processId,
        status: "working",
        activeStep: "createInitiative"
      });
      state.collaborationGroupId = groupIds.collabGroupId;
      state.dataGroupId = groupIds.dataGroupId;
      // construct the options...
      const options = {
        collaborationGroupId: state.collaborationGroupId,
        dataGroupId: state.dataGroupId,
        title,
        description: title,
        initiativeKey: state.initiativeKey
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
        progressCallback({
          processId,
          status: "working",
          activeStep: "shareInitiative"
        });
        if (state.collaborationGroupId) {
          // share to the collabGroup...
          // create the sharing options...
          const shareOptions = {
            id: state.initiativeModel.item.id,
            groupId: state.collaborationGroupId,
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
      // compute the duration...
      const duration = new Date().getTime() - startTS;
      progressCallback({
        processId,
        duration,
        status: "complete"
      });
      return state.initiativeModel;
    });
}
