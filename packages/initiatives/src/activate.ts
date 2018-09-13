/* Copyright (c) 2018 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

import { IRequestOptions, getSelf } from "@esri/arcgis-rest-request";
import { IInitiativeModel } from "@esri/hub-common";
import { fetchInitiative } from "./fetch";
import { getUniqueGroupName, createInitiativeGroup } from "./groups";
import {
  createInitiativeModelFromTemplate,
  IInitiativeTemplateOptions
} from "./templates";
import { addInitiative } from "./add";
import { copyImageResources } from "./util";
import { createId, camelize } from "@esri/hub-common";
import {
  shareItemWithGroup,
  IGroupSharingRequestOptions
} from "@esri/arcgis-rest-sharing";

const steps = [
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
 * @param {(string | any)} Initiative Template item or Id
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
  // Steps
  // Get the portal to we have access to
  //  - orgId
  //  - org extent
  //  - geometryServiceUrl
  return getSelf(ro)
    .then(portal => {
      state.portal = portal;
      // we may be handed a template...
      if (typeof template === "string") {
        return fetchInitiative(template, ro);
      } else {
        return Promise.resolve(template);
      }
    })
    .then(templateItemModel => {
      state.template = templateItemModel;
      const uniqueNames = [
        getUniqueGroupName(collaborationGroupName, state.portal.id, 0, ro),
        getUniqueGroupName(dataGroupName, state.portal.id, 0, ro)
      ];
      return Promise.all(uniqueNames);
    })
    .then((groupNames: any) => {
      progressCallback({
        processId,
        status: "working",
        activeStep: "copyTemplate"
      });
      state.uniqueCollaborationGroupName = groupNames[0];
      state.uniqueDataGroupName = groupNames[1];
      const createGroups = [
        createInitiativeGroup(
          state.uniqueCollaborationGroupName,
          state.uniqueCollaborationGroupName,
          { isSharedEditing: true },
          ro
        ),
        createInitiativeGroup(
          state.uniqueDataGroupName,
          state.uniqueDataGroupName,
          { isOpenData: true },
          ro
        )
      ];
      return Promise.all(createGroups);
    })
    .then((groupIds: any) => {
      progressCallback({
        processId,
        status: "working",
        activeStep: "createInitiative"
      });
      state.collaborationGroupId = groupIds[0];
      state.openDataGroupId = groupIds[1];
      // construct the options...
      const options = {
        collaborationGroupId: state.collaborationGroupId,
        openDataGroupId: state.openDataGroupId,
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
      const { itemId, owner } = newModel.item;
      const assets = ["detail-image.jpg", "icon-dark.png", "icon-light.png"];
      // now copy assets from the parent initiative...
      return copyImageResources(
        state.template.item.id,
        itemId,
        owner,
        assets,
        ro
      );
    })
    .then(() => {
      // share to the collabGroup...
      progressCallback({
        processId,
        status: "working",
        activeStep: "shareInitiative"
      });
      // create the sharing options...
      const shareOptions = {
        id: state.initiativeModel.item.id,
        groupId: state.collaborationGroupId,
        confirmItemControl: true,
        ...requestOptions
      } as IGroupSharingRequestOptions;

      return shareItemWithGroup(shareOptions);
    })
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
