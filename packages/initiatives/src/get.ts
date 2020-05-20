/* Copyright (c) 2018 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

import { IRequestOptions } from "@esri/arcgis-rest-request";
import {
  getItem,
  getItemData,
  getPortalUrl,
  IItem
} from "@esri/arcgis-rest-portal";
import { IInitiativeModel, IInitiativeItem } from "@esri/hub-common";

import { migrateSchema } from "./migrator";
import { convertIndicatorsToDefinitions } from "./migrations/upgrade-two-dot-zero";
// re-export this one helper function that's needed for solutions
export { convertIndicatorsToDefinitions };
/**
 * ```js
 * getInitiative('3ef...')
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
 * @export
 */
export function getInitiative(
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
