import { upgradeSiteSchema } from ".";
import { IHubRequestOptions, getModel } from "..";

/**
 * Get a Site Model by it's Item Id, and apply schema upgrades
 * @param {String} id Site Item Id
 * @param {IHubRequestOptions} hubRequestOptions
 */
export function getSiteById(id: string, hubRequestOptions: IHubRequestOptions) {
  return getModel(id, hubRequestOptions).then(upgradeSiteSchema);
}
