import { ResourceObject } from "jsonapi-typescript";
import { IItem } from "@esri/arcgis-rest-portal";
import {
  IHubContent,
  IHubRequestOptions,
  buildUrl,
  hubRequest
} from "@esri/hub-common";
import { itemToContent, withPortalUrls } from "./portal";

/**
 * Parse item ID and layer ID (if any) from dataset record ID
 *
 * @param datasetId Hub API dataset record id ({itemId}_{layerId} or {itemId})
 * @returns A hash with the `itemId` and `layerId` (if any)
 */
export function parseDatasetId(
  datasetId: string
): { itemId: string; layerId?: string } {
  const [itemId, layerId] = datasetId ? datasetId.split("_") : [];
  return { itemId, layerId };
}

/**
 * JSONAPI dataset resource returned by the Hub API
 */
export type DatasetResource = ResourceObject<
  "dataset",
  {
    // TODO: actually define the attributes?
    // what is the syntax? adding the following causes errors
    // owner: string;
    [k: string]: any;
  }
>;

/**
 * Fetch a dataset resource with the given ID from the Hub API
 *
 * @param id Hub API ID
 * @param requestOptions
 * @export
 */
export function getContentFromHub(
  id: string,
  requestOptions?: IHubRequestOptions
): Promise<IHubContent> {
  const host = requestOptions && requestOptions.hubApiUrl;
  // TODO: what if no host? reject?
  const url = buildUrl({
    host,
    path: `/datasets/${id}`
  });
  return hubRequest(url, requestOptions).then(resp => {
    const dataset = resp && resp.data;
    return dataset && withPortalUrls(datasetToContent(dataset), requestOptions);
  });
}

/**
 * Convert a Hub API dataset resource to Hub Content
 *
 * @param {DatasetResource} Dataset resource
 * @returns {IHubContent} Hub content object
 * @export
 */
export function datasetToContent(dataset: DatasetResource): IHubContent {
  // extract item from dataset and create content
  const item = datasetToItem(dataset);
  const content = itemToContent(item);

  // overwrite hubId
  content.hubId = dataset.id;
  // overwrite or add enrichments from Hub API
  const attributes = dataset.attributes;
  const {
    // common enrichments
    boundary,
    modifiedProvenance,
    slug,
    searchDescription
    // dataset enrichments
    // recordCount
    // TODO: fields, geometryType, layer?, server?, as needed
  } = attributes;
  content.boundary = boundary;
  content.slug = slug;
  //
  if (searchDescription) {
    // overwrite default summary (from snippet) w/ search description
    content.summary = searchDescription;
  }
  if (modifiedProvenance) {
    // overwrite default updated source
    content.updatedDateSource = modifiedProvenance;
  }
  // type-specific enrichments
  // TODO: should this be based on existence of attributes instead of hubType?
  // TODO: if the latter, should we return a different subtype of IHubContent for this?
  // if (content.hubType === "dataset") {
  //   content.recordCount = recordCount;
  //   // TODO: fields, geometryType, etc
  // }
  // TODO: any remaining enrichments
  return content;
}

/**
 * Convert a Hub API dataset resource to a portal item
 *
 * @param {DatasetResource} Dataset resource
 * @returns {IItem} portal item
 * @export
 */
export function datasetToItem(dataset: DatasetResource): IItem {
  if (!dataset) {
    return;
  }
  const { id, attributes } = dataset;
  if (!attributes) {
    return;
  }

  // parse item id
  const { itemId } = parseDatasetId(id);

  // read item properties from attributes
  // NOTE: we attempt to read all item properties
  // even though some may not be currently returned
  const {
    // start w/ item properties from
    // https://developers.arcgis.com/rest/users-groups-and-items/item.htm
    owner,
    orgId,
    created,
    modified,
    // NOTE: we use attributes.name to store the title or the service/layer name
    // but in Portal name is only used for file types to store the file name (read only)
    name,
    title,
    type,
    typeKeywords,
    description,
    snippet,
    tags,
    thumbnail,
    extent,
    categories,
    // the Hub API doesn't currently return spatialReference
    spatialReference,
    // the Hub API doesn't currently return accessInformation
    accessInformation,
    licenseInfo,
    culture,
    url,
    access,
    // the Hub API doesn't currently return proxyFilter
    proxyFilter,
    properties,
    // the Hub API doesn't currently return appCategories, industries,
    // languages, largeThumbnail, banner, screenshots, listed, ownerFolder
    appCategories,
    industries,
    languages,
    largeThumbnail,
    banner,
    screenshots,
    listed,
    ownerFolder,
    size,
    // the Hub API doesn't currently return protected
    protected: isProtected,
    commentsEnabled,
    // the Hub API doesn't currently return numComments, numRatings,
    // avgRating, numViews, itemControl, scoreCompleteness
    numComments,
    numRatings,
    avgRating,
    numViews,
    itemControl,
    scoreCompleteness,
    // additional attributes we'll need as fallbacks
    createdAt,
    updatedAt,
    serviceSpatialReference
  } = attributes;

  // build and return an item from properties
  // NOTE: we currently do NOT provide default values
  // (i.e. null for scalar attributes, [] for arrays, etc)
  // for attributes that are not returned by the Hub API
  // this helps distinguish an item that comes from the API
  // but forces all consumers to do handle missing properties
  return {
    id: itemId,
    owner: owner as string,
    orgId,
    created: (created || createdAt) as number,
    modified: (modified || updatedAt) as number,
    title: (title || name) as string,
    type,
    typeKeywords,
    description,
    tags,
    snippet,
    thumbnail,
    // we store item.extent in attributes.extent.coordinates
    extent: extent && extent.coordinates,
    categories,
    spatialReference: spatialReference || serviceSpatialReference,
    accessInformation,
    licenseInfo,
    culture,
    url,
    access,
    size,
    protected: isProtected,
    proxyFilter,
    properties,
    appCategories,
    industries,
    languages,
    largeThumbnail,
    banner,
    screenshots,
    listed,
    ownerFolder,
    commentsEnabled,
    numComments,
    numRatings,
    avgRating,
    numViews,
    itemControl,
    scoreCompleteness
  };
}
