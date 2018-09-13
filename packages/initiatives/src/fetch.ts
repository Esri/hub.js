/* Copyright (c) 2018 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

import { IRequestOptions, getPortalUrl } from "@esri/arcgis-rest-request";
import { getItem, getItemData } from "@esri/arcgis-rest-items";
import { IInitiativeModel, IInitiativeItem } from "@esri/hub-common";
import { fetchSiteDomain } from "@esri/hub-sites";
import { migrateSchema } from "./migrator";
import { convertIndicatorsToDefinitions } from "./migrations/upgrade-two-dot-zero";
// re-export this one helper function that's needed for solutions
export { convertIndicatorsToDefinitions };
/**
 * ```js
 * // fetch initiative by id, along with the data
 * fetchInitiative('3ef...')
 *  .then(initiativeModel => {
 *    // work with the initiative model
 *  })
 * ```
 * Get the initiative item + data in one call. This will also apply schema upgrades
 *
 *
 * @param id - Initiative Item Id
 * @param requestOptions - Initiative request options that may have authentication manager
 * @returns A Promise that will resolve with the Initiative item and data
 * @protected
 */
export function fetchInitiative(
  id: string,
  requestOptions?: IRequestOptions
): Promise<IInitiativeModel> {
  // if we have specifically requested the data...
  return Promise.all([
    getItem(id, requestOptions),
    getItemData(id, requestOptions)
  ])
    .then(result => {
      // shape this into a model
      return {
        item: result[0] as IInitiativeItem,
        data: result[1]
      };
    })
    .then(model => {
      return migrateSchema(model, getPortalUrl(requestOptions));
    });
}

/**
 * Get site url for Initiative
 * Get the initiative item. If it has a site, it will have item.properties.siteId
 * From there, we can use the domain service to lookup the domain using the siteId
 * @param id - Initiative Item Id
 * @param requestOptions - Request options that may have authentication manager
 * @returns A Promise that will resolve with the Initiative site's domain. Consumer needs to add the protocol
 * @protected
 */
export function lookupSiteUrlByInitiative(
  id: string,
  requestOptions?: IRequestOptions
): Promise<string> {
  return getItem(id, requestOptions).then(initiative => {
    if (initiative.properties.siteId) {
      return fetchSiteDomain(initiative.properties.siteId, requestOptions);
    } else {
      // reject
      return Promise.reject(
        new Error("Initiative does not have an associated site")
      );
    }
  });
}
