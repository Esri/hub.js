import { IHubRequestOptions } from "../hub-types";
import { getModel } from "../models/getModel";
import { upgradeSiteSchema } from "./upgrade-site-schema";

/**
 * Get a Site Model by it's Item Id, and apply schema upgrades
 * @param {String} id Site Item Id
 * @param {IHubRequestOptions} hubRequestOptions
 */
export function getSiteById(id: string, hubRequestOptions: IHubRequestOptions) {
  return getModel(id, hubRequestOptions).then(upgradeSiteSchema);
}
