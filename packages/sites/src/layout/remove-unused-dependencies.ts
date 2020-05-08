import { failSafe } from '@esri/hub-common';

import { IHubRequestOptions } from "@esri/hub-common";

import {
  getItemResources,
  removeItemResource
} from '@esri/arcgis-rest-portal';

import { _getImageCropIdsFromLayout } from "./_get-image-crop-ids-from-layout";
import { ILayout, IEntry } from "./types";

/**
 * Removes any image "crop" versions that are no longer
 * used in the site layout.
 * TODO: Move to a module that is shared with Pages and then
 * also wire into the Page update cycle.
 * @param {String} id Id of the site or page item
 * @param {Object} layout Layout
 * @param {IHubRequestOptions} hubRequestOptions
 */
export function removeUnusedResources (id: string, layout: ILayout, hubRequestOptions : IHubRequestOptions) {
  let imageCropIds = _getImageCropIdsFromLayout(layout);
  // get the resources for the item
  return getItemResources(id, hubRequestOptions)
  .then((response) => {
    // getItemResources mutates the options, adding a params hash
    delete hubRequestOptions.params;
    let resources = response.resources || [];
    let cropMap = imageCropIds.map(cropId => `-crop-${cropId}.png$`).join('|');
    let cropRegex = new RegExp(`(${cropMap})`);
    let cropFormat = new RegExp(/^hub-image-card-crop-/);
    // find resources that match the image source prefix
    // BUT don't match a current cropId (presumably because they're old crops and we don't need them)
    let oldCroppings = resources.filter((entry : IEntry) => {
      // if there aren't any image cards in saved layout, delete all crops
      if (imageCropIds.length === 0) {
        return entry.resource.match(cropFormat);
      } else {
        // else delete crops for image cards that do not contain a current cropId
        return (entry.resource.match(cropFormat) && !entry.resource.match(cropRegex));
      }
    }).map((entry : IEntry) => entry.resource);
    // failSafe these calls b/c this is not critical
    let failSaveRemoveItemResources = failSafe(removeItemResource, { success: true });
    return Promise.all(oldCroppings.map(resource => {
      return failSaveRemoveItemResources({
        id,
        resource,
        authentication: hubRequestOptions.authentication
      });
    }));
  })
  .catch((err) => {
    console.error(`removeUnusedResources: Error removing resources: ${err}`);
    throw err;
  });
}
