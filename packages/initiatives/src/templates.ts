/* Copyright (c) 2018 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */
import { cloneObject, without } from "@esri/hub-common";
import { IInitiativeModel, IInitiativeItem } from "@esri/hub-common";

import { CURRENT_SCHEMA_VERSION } from "./migrator";
import { INITIATIVE_TYPE_NAME } from "./add";

/**
 * Properties required to generate an Initiative Model from a Template
 *
 * @export
 * @interface IInitiativeTemplateOptions
 */
export interface IInitiativeTemplateOptions {
  title: string;
  collaborationGroupId?: string;
  dataGroupId?: string;
  initiativeKey: string;
}

/**
 * Given an Initiative Template model, create a new Initiative model
 * Note: this does not save the model. It just sets up the new model.
 *
 * @export
 * @param {IInitiativeModel} template
 * @param {*} options
 * @param {IRequestOptions} requestOptions
 * @returns {Promise<IInitiativeModel>}
 */
export function createInitiativeModelFromTemplate(
  template: IInitiativeModel,
  options: IInitiativeTemplateOptions
): IInitiativeModel {
  // start by making deep clone of the template...
  const model = {
    item: cloneObject(template.item) as IInitiativeItem,
    data: {}
  } as IInitiativeModel;

  model.item.title = options.title;
  model.item.tags = ["Hub Initiative"];
  // ensure we use the current type
  model.item.type = INITIATIVE_TYPE_NAME;

  // Assign the typeKeywords: remove hubInitiativeTemplate and add hubInitiative
  model.item.typeKeywords = without(
    model.item.typeKeywords,
    "hubInitiativeTemplate"
  );
  model.item.typeKeywords.push("hubInitiative");

  // remove things that are irrelevant or are set server-side
  ["id", "owner", "created_at", "modified_at"].forEach(
    prop => delete model.item[prop]
  );
  // we store a bunch of Ids in here so we can avoid fetching /data for common interactions
  model.item.properties = {
    source: template.item.id,
    schemaVersion: CURRENT_SCHEMA_VERSION,
    initialParent: template.item.id
  };
  if (options.collaborationGroupId) {
    model.item.properties.groupId = options.collaborationGroupId;
  }
  if (options.dataGroupId) {
    model.item.properties.openDataGroupId = options.dataGroupId;
  }
  // we create a new .data node so we're cleaning rogue properties as we go
  model.data = {
    assets: cloneObject(template.data.assets),
    steps: cloneObject(template.data.steps),
    indicators: [],
    source: template.item.id,
    values: {
      followerGroups: [],
      initiativeKey: options.initiativeKey,
      bannerImage: cloneObject(template.data.values.bannerImage)
    }
  };
  if (options.collaborationGroupId) {
    model.data.values.collaborationGroupId = options.collaborationGroupId;
  }
  if (options.dataGroupId) {
    model.data.values.openDataGroupId = options.dataGroupId;
  }
  // just in case the template does not have a banner image defined...
  if (!model.data.values.bannerImage) {
    model.data.values.bannerImage = {
      source: "bannerImage",
      display: {
        position: { x: "50%", y: "10%" }
      }
    };
  }
  return model;
}
