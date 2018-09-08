/* Copyright (c) 2018 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

import {
  IRequestOptions,
  getPortalUrl,
  getSelf,
  IPortal
} from "@esri/arcgis-rest-request";
import { IInitiativeModel } from "@esri/hub-common";
import { fetchInitiative } from "./fetch";
import { getUniqueGroupName, createInitiativeGroup } from "./groups";
import { createInitiativeModelFromTemplate } from "./templates";
import { addInitiative } from "./add";
import { copyImageResources } from "./util";
import {
  shareItemWithGroup,
  IGroupSharingRequestOptions
} from "@esri/arcgis-rest-sharing";

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

  // send the setup to the progress callback
  progressCallback({
    model: {
      status: "working",
      steps: [
        {
          id: "createGroup",
          i18nKey: "initiatives.editor.activateModal.step1",
          status: "not-started"
        },
        {
          id: "copyTemplate",
          i18nKey: "initiatives.editor.activateModal.step2",
          status: "not-started"
        },
        {
          id: "createInitiative",
          i18nKey: "initiatives.editor.activateModal.step3",
          status: "not-started"
        },
        {
          id: "shareInitiative",
          i18nKey: "initiatives.editor.activateModal.step4",
          status: "not-started"
        }
      ]
    }
  });
  progressCallback({ workingOn: "createGroup" });
  // create a state container to hold things we accumulate thru the
  // various promises
  const state = {} as any;
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
      progressCallback({ workingOn: "copyTemplate" });
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
      progressCallback({ workingOn: "createInitiative" });
      state.collaborationGroupId = groupIds[0];
      state.openDataGroupId = groupIds[1];
      const options = {
        collaborationGroupId: state.collaborationGroupId,
        openDataGroupId: state.openDataGroupId,
        title,
        description: title
      };
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

      const shareOptions = {
        id: state.initiativeModel.item.id,
        groupId: state.collaborationGroupId,
        confirmItemControl: true,
        ...requestOptions
      } as IGroupSharingRequestOptions;

      return shareItemWithGroup(shareOptions);
    })
    .then(() => {
      progressCallback({ complete: true });
      return state.initiativeModel;
    });
}
