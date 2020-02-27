/* Copyright (c) 2020 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */
import { getProp, cloneObject } from "@esri/hub-common";
import { IInitiativeModel } from "@esri/hub-common";

/**
 * Apply the 2.1 --> 2.2 Migration to an Initiative Model
 *
 * @param model
 * @protected
 */
export function upgradeToTwoDotTwo(model: IInitiativeModel): IInitiativeModel {
  const currVersion = getProp(model, "item.properties.schemaVersion");
  if (currVersion < 2.2) {
    const clone = cloneObject(model) as IInitiativeModel;
    // store the schemaVersion
    clone.item.properties.schemaVersion = 2.2;
    const steps = getProp(clone, "data.steps");
    clone.data.recommendedTemplates = getTemplateIdsFromSteps(steps);
    return clone;
  } else {
    return model;
  }
}

function getTemplateIdsFromSteps(steps: any): string[] {
  let templateIds: string[] = [];
  if (Array.isArray(steps)) {
    templateIds = steps.reduce((acc: string[], step: any) => {
      if (getProp(step, "templateIds.length")) {
        return acc.concat(step.templateIds);
      }
      return acc;
    }, []);
  }
  return templateIds;
}
