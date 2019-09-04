/* Copyright (c) 2019 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */
import { getProp, cloneObject } from "@esri/hub-common";
import { IInitiativeModel } from "@esri/hub-common";

/**
 * Apply the 2.0 --> 2.1 Migration to an Initiative Model
 *
 * @param model
 * @protected
 */
export function upgradeToTwoDotOne(model: IInitiativeModel): IInitiativeModel {
  const currVersion = getProp(model, "item.properties.schemaVersion");
  if (currVersion < 2.1) {
    const clone = cloneObject(model) as IInitiativeModel;
    // store the schemaVersion
    clone.item.properties.schemaVersion = 2.1;
    const collaborationGroupId = getProp(model, "item.properties.groupId");
    if (collaborationGroupId) {
      clone.item.properties.collaborationGroupId = collaborationGroupId;
      delete clone.item.properties.groupId;
    }
    return clone;
  } else {
    return model;
  }
}
