import { IHubRequestOptions, IModel } from "@esri/hub-common";
import { addSiteDomains } from "@esri/hub-common";

/* istanbul ignore next */
/**
 * Given a Site Model, add the required domains.
 * This should only be called as part of the `createSite` flow
 * @param {Object} model site model
 * @param {IHubRequestOptions} hubRequestOptions
 * @private
 */
export function _addSiteDomains(
  model: IModel,
  hubRequestOptions: IHubRequestOptions
): Promise<any[]> {
  // eslint-disable-next-line no-console
  console.warn(
    `@esri/hub-sites::_addSiteDomains is deprecated. Please use @esri/hub-common::addSiteDomains instead`
  );
  return addSiteDomains(model, hubRequestOptions);
}
