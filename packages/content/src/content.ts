/* Copyright (c) 2018 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

import { IHubContent, IModel } from "@esri/hub-common";
import { IGetContentOptions, getContentFromHub } from "./hub";
import { getContentFromPortal, itemToContent } from "./portal";
import { enrichContent } from "./enrichments";
import { isSlug, parseDatasetId } from "./slugs";

/**
 * Fetch content by ID using either the Hub API or the ArcGIS REST API
 * @param identifier - Hub API slug ({orgKey}::{title-as-slug} or {title-as-slug})
 * or record id ((itemId}_{layerId} or {itemId})
 * @param options - request options that may include authentication
 */
function getContentById(
  identifier: string,
  options?: IGetContentOptions
): Promise<IHubContent> {
  let getContentPromise: Promise<IHubContent>;
  // first fetch and format the content from the Hub or portal API
  if (options && options.isPortal) {
    const { itemId } = parseDatasetId(identifier);
    getContentPromise = getContentFromPortal(itemId, options);
  } else {
    getContentPromise = getContentFromHub(identifier, options).catch(e => {
      // dataset is not in index (i.e. might be a private item)
      if (!isSlug(identifier)) {
        // try fetching from portal instead
        return getContentFromPortal(identifier, options);
      }
      return Promise.reject(e);
    });
  }
  return getContentPromise;
}

/**
 * Get content either from an IModel or an ID.
 * @param idOrModel - An IModel (with our without data), or Hub API slug ({orgKey}::{title-as-slug} or {title-as-slug})
 * or record id ((itemId}_{layerId} or {itemId})
 * @param options - request options that may include authentication
 */
export function getContent(
  idOrModel: string | IModel,
  options?: IGetContentOptions
): Promise<IHubContent> {
  let getContentPromise: Promise<IHubContent>;

  if (typeof idOrModel === "string") {
    getContentPromise = getContentById(idOrModel, options);
  } else {
    // no need to fetch item and maybe not data
    const { item, data } = idOrModel;
    const content = itemToContent(item);
    content.data = data;
    // just fetch and add any missing or desired enrichments
    getContentPromise = enrichContent(content, options);
  }

  return getContentPromise;
}
