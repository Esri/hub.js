import { failSafe } from "@esri/hub-common";

import { IHubRequestOptions } from "@esri/hub-common";
import { UserSession } from "@esri/arcgis-rest-auth";

import { getItemResources, removeItemResource } from "@esri/arcgis-rest-portal";

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
export function removeUnusedResources(
  id: string,
  layout: ILayout,
  hubRequestOptions: IHubRequestOptions
) {
  const layoutImageCropIds = _getImageCropIdsFromLayout(layout);

  return getItemResources(id, hubRequestOptions).then(response => {
    const itemResourcesOnAGO = (response.resources || []).map(
      extractResourceProperty
    );

    const imageItemResourcesOnAGO = itemResourcesOnAGO.filter(
      resourceStartsWithImageSource
    );

    // getItemResources mutates the options, adding a params hash
    delete hubRequestOptions.params;

    const itemResourcesToRemove = getUnusedItemCrops(
      layoutImageCropIds,
      imageItemResourcesOnAGO
    );

    return removeUnusedResourcesFromAGO(
      id,
      itemResourcesToRemove,
      hubRequestOptions.authentication
    );
  });
}

function extractResourceProperty(entry: IEntry) {
  return entry.resource;
}

function getUnusedItemCrops(
  layoutImageCropIds: string[],
  itemImageResources: string[]
) {
  if (!layoutContainsImageCards(layoutImageCropIds)) {
    // if there aren't any image cards in saved layout, delete all crops
    return itemImageResources;
  }

  // otherwise find crops for image cards that do not contain a current cropId
  return itemImageResources.filter(
    isNotACurrentImageCropId(layoutImageCropIds)
  );
}

function layoutContainsImageCards(layoutImageCropIds: string[]) {
  return layoutImageCropIds.length > 0;
}

function resourceStartsWithImageSource(agoResource: string) {
  return agoResource.indexOf("hub-image-card-crop-") === 0;
}

function isNotACurrentImageCropId(imageCropIds: string[]) {
  const cropRegex = new RegExp(`-crop-(${imageCropIds.join("|")}).png$`);

  return (resource: string) => !resource.match(cropRegex);
}

function removeUnusedResourcesFromAGO(
  id: string,
  unusedCrops: string[],
  authentication: UserSession
) {
  // failSafe these calls b/c this is not critical
  const failSaveRemoveItemResources = failSafe(removeItemResource, {
    success: true
  });

  return Promise.all(
    unusedCrops.map((resource: string) =>
      failSaveRemoveItemResources({
        id,
        resource,
        authentication
      })
    )
  );
}
