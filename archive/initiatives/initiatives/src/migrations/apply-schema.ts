/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* Copyright (c) 2018 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

import { IInitiativeModel } from "@esri/hub-common";
import { getProp, cloneObject } from "@esri/hub-common";
/**
 * Applies the initial version of the Initiaive schema to the model.
 * If `model.item.properties.schemaVersion >= 1` the original object
 * will be returned. Otherwise a new object with the updated schema
 * is returned.
 *
 * @protected
 * @param {IInitiativeModel} model Initiative Model
 * @param {string} [portalUrl] Url to the Portal. Defauls to `www.arcgis.com`
 * @returns {IInitiativeModel}
 */
export function applyInitialSchema(
  model: IInitiativeModel,
  _portalUrl?: string
): IInitiativeModel {
  const curVersion = getProp(model, "item.properties.schemaVersion");
  // if no current version or it's below 1
  if (!curVersion || curVersion < 1) {
    // clone the model because we play by immutable rules
    const clone = cloneObject(model);
    // console.debug(`------- CLONE ---------`);
    // console.debug(JSON.stringify(clone, null, 2));
    // console.debug(`------- CLONE ---------`);
    // ensure some properties exist...
    if (!clone.data.values) {
      clone.data.values = {};
    }
    if (!clone.item.properties) {
      clone.item.properties = {};
    }

    // set the schema version...
    clone.item.properties.schemaVersion = 1.0;

    let isTemplate = false;
    if (clone.item.typeKeywords) {
      isTemplate =
        clone.item.typeKeywords.indexOf("hubInitiativeTemplate") >= 0;
    }

    // ensure source is in item.properties if it has a parent...
    const hasParent = !!clone.data.source;
    if (hasParent && clone.item.properties.source !== clone.data.source) {
      clone.item.properties.source = clone.data.source;
    }
    // convert configuratinSettings to steps array...
    // NOTE: this is only for 'templates', or Custom Initiatives
    if (clone.data.configurationSettings) {
      const config = cloneObject(clone.data.configurationSettings);
      delete clone.data.configurationSettings;
      // get the steps entry...
      const stepCategory = config.find((el: any) => {
        return el.category === "Steps";
      });

      // hoist step names into an array
      clone.data.values.steps = stepCategory.fields.map(
        (entry: { fieldName: string }) => {
          return entry.fieldName;
        }
      );

      // move the label and tooltip to title and description, in the values.<fieldName> prop
      stepCategory.fields.forEach((entry: any) => {
        // ensure values prop exists...
        if (!clone.data.values[entry.fieldName]) {
          clone.data.values[entry.fieldName] = {};
        }
        // assign in values
        clone.data.values[entry.fieldName].title = entry.label;
        clone.data.values[entry.fieldName].description = entry.tooltip;
        clone.data.values[entry.fieldName].id = entry.fieldName;
        // if a .items array exists, rename that to .templates
        if (clone.data.values[entry.fieldName].items) {
          // if this is a template, then move items to templates...
          if (isTemplate) {
            clone.data.values[entry.fieldName].templates =
              clone.data.values[entry.fieldName].items;
            delete clone.data.values[entry.fieldName].items;
          }
        } else {
          // ensure empty arrays
          clone.data.values[entry.fieldName].items = [];
          clone.data.values[entry.fieldName].templates = [];
        }
      });
    }
    return clone;
  } else {
    return model;
  }
}
