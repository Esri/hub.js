import { getItem } from "@esri/arcgis-rest-portal";
import { composeContent } from "./compose";
import {
  ItemOrServerEnrichment,
  fetchItemEnrichments,
} from "../items/_enrichments";
import { IHubRequestOptions } from "../types";
import { isNil } from "../util";
import { addContextToSlug, isSlug, parseDatasetId } from "./slugs";
import {
  IDatasetEnrichments,
  fetchHubEnrichmentsById,
  fetchHubEnrichmentsBySlug,
  getContentEnrichments,
} from "./_fetch";
import { canUseHubApiForItem } from "./_internal";

interface IFetchItemAndEnrichmentsOptions extends IHubRequestOptions {
  enrichments?: ItemOrServerEnrichment[];
}

export interface IFetchContentOptions extends IFetchItemAndEnrichmentsOptions {
  layerId?: number;
  siteOrgKey?: string;
}

const fetchItemAndEnrichments = async (
  itemId: string,
  options?: IFetchItemAndEnrichmentsOptions
) => {
  // TODO: add error handling
  const item = await getItem(itemId, options);
  // TODO: allow override enrichments
  const enrichmentsToFetch =
    options?.enrichments || getContentEnrichments(item);
  const enrichments = await fetchItemEnrichments(
    item,
    enrichmentsToFetch,
    options
  );
  return { ...enrichments, item };
};

const fetchContentById = async (
  hubId: string,
  options?: IFetchContentOptions
) => {
  // start by fetching the item and item enrichments
  const { itemId } = parseDatasetId(hubId);
  const { item, ...itemEnrichments } = await fetchItemAndEnrichments(
    itemId,
    options
  );
  // did the caller request a specific layer
  const specifiedLayerId =
    options && !isNil(options.layerId) && options.layerId;
  // if this is a public item and we're not in enterprise
  // fetch the slug and remaining enrichments from the Hub API
  const { slug, layerId, boundary, extent, searchDescription, statistics } =
    canUseHubApiForItem(item, options)
      ? await fetchHubEnrichmentsById(hubId, options)
      : ({} as IDatasetEnrichments);
  // return a new content object composed from the item and enrichments we fetched
  return composeContent(item, {
    requestOptions: options,
    ...itemEnrichments,
    slug,
    layerId: specifiedLayerId || layerId,
    boundary,
    extent,
    searchDescription,
    statistics,
  });
};

const fetchContentBySlug = async (
  fullyQualifiedSlug: string,
  options?: IFetchContentOptions
) => {
  // we only have a slug, not an item id, so we start by
  // fetching the item id (and enrichments) from the Hub API
  // NOTE: if we are in enterprise this will throw an error
  let hubEnrichments = await fetchHubEnrichmentsBySlug(
    fullyQualifiedSlug,
    options
  );
  const { itemId } = hubEnrichments;
  let { layerId } = hubEnrichments;
  // now we can fetch the item and item enrichments
  const { item, ...itemEnrichments } = await fetchItemAndEnrichments(
    itemId,
    options
  );
  // did the caller request a specific layer
  const specifiedLayerId =
    options && !isNil(options.layerId) && options.layerId;
  if (specifiedLayerId && specifiedLayerId !== layerId) {
    // we fetched Hub enrichments by slug for another dataset,
    // most likely for the parent service of this layer,
    // we need to fetch them for the specified layer instead
    layerId = specifiedLayerId;
    hubEnrichments = await fetchHubEnrichmentsById(
      `${itemId}_${layerId}`,
      options
    );
  }
  const { slug, boundary, extent, searchDescription, statistics } =
    hubEnrichments;
  // return a new content object composed from the item and enrichments we fetched
  return composeContent(item, {
    requestOptions: options,
    ...itemEnrichments,
    layerId,
    slug,
    boundary,
    extent,
    searchDescription,
    statistics,
  });
};

export const fetchContent = (
  identifier: string,
  options?: IFetchContentOptions
) => {
  return isSlug(identifier)
    ? fetchContentBySlug(
        addContextToSlug(identifier, options?.siteOrgKey),
        options
      )
    : fetchContentById(identifier, options);
};
