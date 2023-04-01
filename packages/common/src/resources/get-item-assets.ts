import { IHubRequestOptions, ITemplateAsset } from "../types";

import { getPortalApiUrl } from "../urls";
import { getItemThumbnailUrl } from "./get-item-thumbnail-url";
import { getItemResources, IItem } from "@esri/arcgis-rest-portal";

/**
 * Given an item, return an array of assets that includes
 * all the resources, as well as the thumbnail
 * @param {object} item Item
 * @param {IHubRequestOptions} IHubRequestOptions
 */
export function getItemAssets(
  item: IItem,
  hubRequestOptions: IHubRequestOptions
): Promise<ITemplateAsset[]> {
  const portalRestUrl = getPortalApiUrl(hubRequestOptions.portalSelf);
  const itemUrl = `${portalRestUrl}/content/items/${item.id}`;
  // if construct the asset for the thumbnail
  const thumbnailUrl = getItemThumbnailUrl(item, hubRequestOptions);
  const assets: ITemplateAsset[] = [];
  if (thumbnailUrl) {
    assets.push({
      name: item.thumbnail,
      url: thumbnailUrl,
      type: "thumbnail",
    });
  }
  // get all the other resources
  // TODO: see how this works w/ folders
  return getItemResources(item.id, hubRequestOptions).then((response) => {
    const resourceAssets = response.resources.map((e: any) => {
      return {
        name: e.resource,
        type: "resource",
        url: `${itemUrl}/resources/${e.resource}`,
      };
    });
    return assets.concat(resourceAssets);
  });
}
