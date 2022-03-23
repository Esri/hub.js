import { IRequestOptions } from "@esri/arcgis-rest-request";
import { registerBrowserApp as implementation } from "@esri/hub-common";

/**
 * Register an Item as an application, enabling oAuth flows at custom
 * domains. Only item types with "Application" in the name are valid
 * with this API call.
 * @param {string} itemId Item Id of item to create an application for
 * @param {Array} redirectUris Array of valid redirect uris for the app
 * @param {string} appType Defaults to "browser"
 * @param {IRequestOptions} requestOptions
 */
/* istanbul ignore next */
export function registerBrowserApp(
  itemId: string,
  redirectUris: string[],
  requestOptions: IRequestOptions
) {
  // tslint:disable-next-line
  console.warn(
    `@esri/hub-sites::registerBrowserApp is deprecated. Please use @esri/hub-common::registerBrowserApp instead`
  );
  return implementation(itemId, redirectUris, requestOptions);
}
