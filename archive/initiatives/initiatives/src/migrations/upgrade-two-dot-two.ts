/* Copyright (c) 2020 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */
import { getProp, cloneObject } from "@esri/hub-common";
import { IInitiativeModel } from "@esri/hub-common";

/**
 * Apply the 2.1 --> 2.2 Migration to an Initiative Model
 * Note: we need this migration to run every time for now, so we
 * will always run it
 *
 * @param model
 * @protected
 */
export function upgradeToTwoDotTwo(model: IInitiativeModel): IInitiativeModel {
  // const currVersion = getProp(model, "item.properties.schemaVersion");
  // if (currVersion < 2.2) {
  const clone = cloneObject(model) as IInitiativeModel;
  // store the schemaVersion
  // clone.item.properties.schemaVersion = 2.2;
  const steps = getProp(clone, "data.steps");
  const templateIdsFromSteps = getTemplateIdsFromSteps(steps);
  const recommendedTemplates =
    getProp(clone, "data.recommendedTemplates") || [];
  const allTemplateIds = templateIdsFromSteps.concat(recommendedTemplates);
  // strip out duplicates
  clone.data.recommendedTemplates = allTemplateIds.reduce(
    (acc: string[], id: string) => {
      if (acc.indexOf(id) < 0) {
        acc.push(id);
      }
      return acc;
    },
    []
  );
  return clone;
  // } else {
  //   return model;
  // }
}

/**
 * Reduce the solution template ids out of the steps array
 * @param steps is the steps array from an initiative item model.data
 */
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
