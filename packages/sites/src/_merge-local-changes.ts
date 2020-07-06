import { IModel, getProp, deepSet } from "@esri/hub-common";

/**
 * Apply a specified set of changes to the upstream model, from the local model
 * Allows for partial updates of items.
 * @param {Object} localModel The local model with changes
 * @param {Object} upstreamModel The model just fetched from API
 * @param {Array} allowList Array of property paths
 * @private
 */
export function _mergeLocalChanges(
  localModel: IModel,
  upstreamModel: IModel,
  allowList: string[]
) {
  if (Array.isArray(allowList) && allowList.length) {
    // we iterate the allowList, applying changes to the upstreamModel from localModel
    allowList.forEach(prop => {
      if (getProp(localModel, prop) !== undefined) {
        deepSet(upstreamModel, prop, getProp(localModel, prop));
      }
    });
    // return the modified upstream model
    return upstreamModel;
  } else {
    // if no property paths were passed in, that means replace everything
    // which is the same as returning the local model.
    return localModel;
  }
}
