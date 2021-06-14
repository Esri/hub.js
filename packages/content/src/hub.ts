import { ResourceObject } from "jsonapi-typescript";
import { IItem, getItem } from "@esri/arcgis-rest-portal";
import {
  IHubContent,
  hubApiRequest,
  cloneObject,
  mergeObjects
} from "@esri/hub-common";
import { itemToContent } from "./portal";
import { isSlug, addContextToSlug, parseDatasetId } from "./slugs";
import { enrichContent, IFetchEnrichmentOptions } from "./enrichments";

export interface IGetContentOptions extends IFetchEnrichmentOptions {
  siteOrgKey?: string;
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

// properties to overwrite on the hub api response with the value from the ago api response
const itemOverrides = [
  "contentStatus",
  "spatialReference",
  "accessInformation",
  "proxyFilter",
  "appCategories",
  "industries",
  "languages",
  "largeThumbnail",
  "banner",
  "screenshots",
  "listed",
  "ownerFolder",
  "protected",
  "commentsEnabled",
  "numComments",
  "numRatings",
  "avgRating",
  "numViews",
  "itemControl",
  "scoreCompleteness"
];

/**
 * Fetch a dataset resource with the given ID from the Hub API
 *
 * @param identifier Hub API slug ({orgKey}::{title-as-slug} or {title-as-slug})
 * or record id ((itemId}_{layerId} or {itemId})
 * @param options - request options that may include authentication
 * @export
 */
export function getContentFromHub(
  identifier: string,
  options?: IGetContentOptions
): Promise<IHubContent> {
  let request;
  if (isSlug(identifier)) {
    const slug = addContextToSlug(identifier, options && options.siteOrgKey);
    const opts = cloneObject(options);
    opts.params = { ...opts.params, "filter[slug]": slug };
    request = hubApiRequest(`/datasets`, opts).then(
      resp => resp && resp.data[0]
    );
  } else {
    request = hubApiRequest(`/datasets/${identifier}`, options).then(
      resp => resp && resp.data
    );
  }
  return request
    .then((dataset: any) => {
      // only if authed
      if (dataset && options.authentication) {
        // we fetch the item - this is because if an item is contentStatus: org_authoritative
        // we do not get that info unless we are authed in the org
        // see https://devtopia.esri.com/dc/hub/issues/53#issuecomment-2769965
        return getItem(parseDatasetId(dataset.id).itemId, options).then(
          item => {
            dataset.attributes = mergeObjects(
              item,
              dataset.attributes,
              itemOverrides
            );
            return dataset;
          }
        );
      } else {
        return dataset;
      }
    })
    .then((dataset: any) => {
      const content = dataset && datasetToContent(dataset);
      return content && enrichContent(content, options);
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
  // extract item from dataset, create content, & store a reference to the item
  const item = datasetToItem(dataset);
  const content = itemToContent(item);
  content.item = item;

  // We remove these because the indexer doesn't actually
  // preserve the original item categories so this attribute is invalid
  delete content.itemCategories;

  // overwrite hubId
  content.hubId = dataset.id;
  // overwrite or add enrichments from Hub API
  const attributes = dataset.attributes;
  const {
    // common enrichments
    errors,
    boundary,
    extent,
    metadata,
    modified,
    modifiedProvenance,
    slug,
    searchDescription,
    groupIds,
    structuredLicense,
    // map and feature server enrichments
    server,
    // TODO: layers, etc
    // feature and raster layer enrichments
    layer
    // TODO: recordCount, fields, geometryType, etc
  } = attributes;
  content.errors = errors;
  content.boundary = boundary;
  // setting this to null signals to enrichMetadata to skip this
  content.metadata = metadata || null;
  content.slug = slug;
  content.groupIds = groupIds;
  content.structuredLicense = structuredLicense;
  content.layer = layer;
  content.server = server;
  if (!item.extent.length && extent && extent.coordinates) {
    // we fall back to the extent derived by the API
    // which prefers layer or service extents and ultimately
    // falls back to the org's extent
    content.extent = extent.coordinates;
  }
  if (searchDescription) {
    // overwrite default summary (from snippet) w/ search description
    content.summary = searchDescription;
  }
  if (content.modified !== modified) {
    // capture the enriched modified date
    // NOTE: the item modified date is still available on content.item.modified
    content.modified = modified;
    content.updatedDate = new Date(modified);
    content.updatedDateSource = modifiedProvenance;
  }
  // TODO: any remaining enrichments?
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
    // the Hub API returns item.modified in attributes.itemModified (below)
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
    // the Hub API returns item.extent in attributes.itemExtent (below)
    // extent,
    categories,
    contentStatus,
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
    // additional attributes we'll need
    // to derive the above values when missing
    itemExtent,
    itemModified,
    modifiedProvenance,
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
    created: created as number,
    // for feature layers, modified will usually come from the layer so
    // we prefer itemModified, but fall back to modified if it came from the item
    modified: (itemModified ||
      (modifiedProvenance === "item.modified"
        ? modified
        : undefined)) as number,
    title: (title || name) as string,
    type,
    typeKeywords,
    description,
    tags,
    snippet,
    thumbnail,
    extent:
      itemExtent ||
      /* istanbul ignore next: API should always return itemExtent, but we default to [] just in case */ [],
    categories,
    contentStatus,
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
