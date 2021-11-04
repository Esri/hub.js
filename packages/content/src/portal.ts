/* Copyright (c) 2018 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

import { IItem, getItem } from "@esri/arcgis-rest-portal";
import {
  IHubContent,
  IHubRequestOptions,
  itemToContent,
} from "@esri/hub-common";
import {
  IEnrichContentOptions,
  enrichContent,
  getPortalUrls,
} from "./enrichments";
import { parseDatasetId } from "./slugs";
// DEPRECATED: remove this at next breaking change
export {
  itemToContent,
  parseItemCategories,
  getItemHubType,
  getFamily,
} from "@esri/hub-common";

/**
 * Return a new content with portal URL (home, API, and data) properties
 * DEPRECATED: Use getPortalUrls() instead. withPortalUrls will be removed at v10.0.0
 *
 * @param content Hub content
 * @param requestOptions Request options
 * @returns Hub content
 * @export
 */
/* istanbul ignore next */
export function withPortalUrls(
  content: IHubContent,
  requestOptions: IHubRequestOptions
): IHubContent {
  /* tslint:disable no-console */
  console.warn(
    "DEPRECATED: Use getPortalUrls() instead. withPortalUrls will be removed at v10.0.0"
  );
  const portalUrls = getPortalUrls(content, requestOptions);
  return { ...content, ...portalUrls };
}

/**
 * Fetch content using the ArcGIS REST API
 * @param item id
 * @param options - request options that may include authentication
 */
export function getContentFromPortal(
  idOrItem: string | IItem,
  requestOptions?: IEnrichContentOptions
): Promise<IHubContent> {
  let getItemPromise;
  let enrichContentOptions = requestOptions;
  if (typeof idOrItem === "string") {
    // parse item and layer id and fetch the item by id
    const { itemId, layerId: layerIdString } = parseDatasetId(idOrItem);
    getItemPromise = getItem(itemId, requestOptions);
    if (layerIdString) {
      // we want to return the content for the layer, not the service
      const layerId = parseInt(layerIdString, 10);
      enrichContentOptions = { layerId, ...requestOptions };
    }
  } else {
    // an item was passed in, just roll w/ that
    getItemPromise = Promise.resolve(idOrItem);
  }
  return getItemPromise.then((item) => {
    return enrichContent(itemToContent(item), enrichContentOptions);
  });
}
