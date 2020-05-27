import { ensureRequiredSiteProperties } from "./ensure-required-site-properties";
import { IModel } from "@esri/hub-common";

/**
 * Enture that the site model has all the required properties
 * and force them to be bumped to all the current values.
 * Returns a clone of the model
 * @param {Object} model Site Model
 * @param {Object} currentUser Current User
 * @param {Boolean} isPortal Is this running in ArcGIS Enterprise
 */
/* istanbul ignore next */
export function ensureRequiredProperties(
  model: IModel,
  username: string,
  isPortal: boolean
) {
  /* istanbul ignore next */
  return ensureRequiredSiteProperties(model, username, isPortal);
}
