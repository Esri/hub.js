import { IModel, cloneObject, includes } from "@esri/hub-common";
import { getSiteItemType } from "./get-site-item-type";

/**
 * Enture that the site model has the correct type and tags
 * Mutates the Model
 * @param {Object} model Site Model
 * @param {Object} currentUser Current User
 * @param {Boolean} isPortal Is this running in ArcGIS Enterprise
 */
export function _ensureTypeAndTags(model: IModel, isPortal: boolean) {
  model = cloneObject(model);
  model.item.type = getSiteItemType(isPortal);
  // ensure typekeywords array
  if (!Array.isArray(model.item.typeKeywords)) {
    model.item.typeKeywords = [];
  }
  if (!includes(model.item.typeKeywords, "hubSite")) {
    model.item.typeKeywords.push("hubSite");
  }
  return model;
}
