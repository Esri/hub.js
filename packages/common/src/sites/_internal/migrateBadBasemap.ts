import { getProp } from "../../objects";
import { IDraft, IModel } from "../../types";
import { cloneObject } from "../../util";

/**
 * During a period in late 2023 and early 2024, the python api
 * was writing a bad confirmation for basemaps as part of the site
 * cloning process. This migration will fix that.
 * @param {Object} model Site Model
 * @private
 */
export function migrateBadBasemap<T extends IModel | IDraft>(model: T) {
  // Unlike other migrations, this is not based on a version
  // rather it checks for a bad confirmation and fixes it.

  // Early exit if the bad confirmation is not present
  if (getProp(model, "data.values.map.basemaps")) return model;

  // Check for the bad confirmation
  if (getProp(model, "data.values.map.baseMapLayers")) {
    // create a clone...
    const clone = cloneObject(model);
    // get the values we need
    const baseMapLayers = getProp(model, "data.values.map.baseMapLayers");
    const title = getProp(model, "data.values.map.title");
    // remove the bad props
    delete clone.data.values.map.baseMapLayers;
    delete clone.data.values.map.title;
    // assign the new structure
    clone.data.values.map.basemaps = {
      primary: {
        baseMapLayers,
        title,
      },
    };
    return clone;
  } else {
    // This should not happen, but if it does, just return the model
    return model;
  }
}
