import {
  IHubRequestOptions,
  IModel,
  registerSiteAsApplication as implementation,
} from "@esri/hub-common";

/* istanbul ignore next */
/**
 * Register the Site item as an application so we can oauth against it
 * @param {string} siteId Item Id of the site
 * @param {Array} uris Arrayf valid uris for the site
 * @param {IHubRequestOptions} hubRequestOptions
 */
export function registerSiteAsApplication(
  model: IModel,
  hubRequestOptions: IHubRequestOptions
) {
  // eslint-disable-next-line no-console
  console.warn(
    `@esri/hub-sites::registerSiteAsApplication is deprecated. Please use @esri/hub-common::registerSiteAsApplication instead`
  );
  return implementation(model, hubRequestOptions);
}
