/* Copyright (c) 2019 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */
import { ResourceObject } from "jsonapi-typescript";
import { IItem } from "@esri/arcgis-rest-portal";
import { HubType, HubFamily } from "../types";
import { collections } from "../collections";
import { categories as allCategories, isDownloadable } from "../categories";
import { isBBox } from "../extent";
import { includes, isGuid } from "../utils";
import { IHubContent, IModel } from "../types";
import { getProp } from "../objects";
import { getStructuredLicense } from "../items/get-structured-license";
import { getServiceTypeFromUrl } from "../urls";
import { setContentExtent } from "./_internal";
import { camelize } from "../util";

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

function collectionToFamily(collection: string): string {
  const overrides: any = {
    other: "content",
    solution: "template",
  };
  return overrides[collection] || collection;
}

const cache: { [key: string]: string } = {};

// TODO: remove this at next breaking version
/**
 * ```js
 * import { getCategory } from "@esri/hub-common";
 * //
 * getCategory('Feature Layer')
 * > 'dataset'
 * ```
 * **DEPRECATED: Use getCollection() instead**
 * returns the Hub category for a given item type
 * @param itemType The ArcGIS [item type](https://developers.arcgis.com/rest/users-groups-and-items/items-and-item-types.htm).
 * @returns the category of a given item type.
 */
export function getCategory(itemType: string = ""): string {
  /* tslint:disable no-console */
  console.warn(
    "DEPRECATED: Use getCollection() instead. getCategory will be removed at v10.0.0"
  );
  /* tslint:enable no-console */
  const collection = getCollection(itemType);
  // for backwards compatibility
  return collection === "feedback" ? "app" : collection;
}

/**
 * ```js
 * import { getTypes } from "@esri/hub-common";
 * //
 * getTypes('site')
 * > [ 'hub site application' ]
 * ```
 * To do.
 * @param category The ArcGIS Hub category.
 * @returns all the item types for the given category.
 *
 */
export function getTypes(category: string = ""): string[] {
  return allCategories[category.toLowerCase()];
}

/**
 * ```js
 * import { normalizeItemType } from "@esri/hub-common";
 * //
 * normalizeItemType(item)
 * > [ 'Hub Site Application' ]
 * ```
 * @param item Item object.
 * @returns type of the input item.
 *
 */
export function normalizeItemType(item: any = {}): string {
  let ret = item.type;
  const typeKeywords = item.typeKeywords || [];
  if (
    item.type === "Site Application" ||
    (item.type === "Web Mapping Application" &&
      includes(typeKeywords, "hubSite"))
  ) {
    ret = "Hub Site Application";
  }
  if (
    item.type === "Site Page" ||
    (item.type === "Web Mapping Application" &&
      includes(typeKeywords, "hubPage"))
  ) {
    ret = "Hub Page";
  }
  if (
    item.type === "Hub Initiative" &&
    includes(typeKeywords, "hubInitiativeTemplate")
  ) {
    ret = "Hub Initiative Template";
  }
  if (
    item.type === "Web Mapping Application" &&
    includes(typeKeywords, "hubSolutionTemplate")
  ) {
    ret = "Solution";
  }
  return ret;
}

/**
 * ```js
 * import { getTypeCategories } from "@esri/hub-common";
 * //
 * getTypeCategories(item)
 * > [ 'Hub Site Application' ]
 * ```
 * @param item Item object.
 * @returns typeCategory of the input item.
 *
 */
export function getTypeCategories(item: any = {}): string[] {
  const type: string = normalizeItemType(item);
  const category: string = getCategory(type);
  if (category) {
    // upper case first letter and return as element in array for backwards compatibility
    const chars = Array.from(category);
    chars[0] = chars[0].toUpperCase();
    return [chars.join("")];
  } else {
    return ["Other"];
  }
}

/**
 * ```js
 * import { getCollection } from "@esri/hub-common";
 * //
 * getCollection('Feature Layer')
 * > 'dataset'
 * ```
 * Get the Hub collection for a given item type
 * @param itemType The ArcGIS [item type](https://developers.arcgis.com/rest/users-groups-and-items/items-and-item-types.htm).
 * @returns the Hub collection of a given item type.
 */
export function getCollection(itemType: string = ""): string {
  if (cache[itemType]) {
    return cache[itemType];
  }
  for (const collection of Object.keys(collections)) {
    for (const type of collections[collection]) {
      if (itemType.toLowerCase() === type.toLowerCase()) {
        cache[itemType] = collection;
        return collection;
      }
    }
  }
}

/**
 * Case-insensitive check if the type is "Feature Service"
 * @param {string} type - item's type
 * @returns {boolean}
 */
export const isFeatureService = (type: string) => {
  return type && type.toLowerCase() === "feature service";
};

/**
 * parse layer id from a service URL
 * @param {string} url
 * @returns {string} layer id
 */
export const getLayerIdFromUrl = (url: string) => {
  const endsWithNumberSegmentRegEx = /\/\d+$/;
  const matched = url && url.match(endsWithNumberSegmentRegEx);
  return matched && matched[0].slice(1);
};

/**
 * return the layerId if we can tell that item is a single layer service
 * @param {*} item from AGO
 * @returns {string} layer id
 */
export const getItemLayerId = (item: IItem) => {
  // try to parse it from the URL, but failing that we check for
  // the Singlelayer typeKeyword, which I think is set when you create the item in AGO
  // but have not verified that, nor that we should alway return '0' in that case
  return (
    getLayerIdFromUrl(item.url) ||
    (isFeatureService(item.type) &&
      includes(item.typeKeywords, "Singlelayer") &&
      "0")
  );
};

/**
 * given an item, get the id to use w/ the Hub API
 * @param item
 * @returns Hub API id (hubId)
 */
export const getItemHubId = (item: IItem) => {
  if (item.access !== "public") {
    // the hub only indexes public items
    return;
  }
  const id = item.id;
  const layerId = getItemLayerId(item);
  return layerId ? `${id}_${layerId}` : id;
};

/**
 * ```js
 * import { getContentIdentifier } from "@esri/hub-common";
 * //
 * getContentIdentifier(content, site)
 * > 'f12hhjk32' // id
 * // OR
 * > 'content-slug' // human-readable slug
 * ```
 * Returns the preferred identifier for a piece of content (determined by content type):
 * - Content from the 'template' and 'feedback' families return the standard id field
 * - Pages that are linked to the site parameter will return the slug defined by the site. Otherwise, the page id will be returned
 * - All other content will return the highest available item in the following hierarchy:
 *   1. slug - includes org prefix if the site parameter is a portal or has an orgKey different from the slug prefix
 *   2. hubId
 *   3. id
 * @param content The IHubContent item
 * @param site The site to compare content against
 * @returns the preferred id for the given content.
 */
export function getContentIdentifier(
  content: IHubContent,
  site?: IModel
): string {
  // We don't currently support slugs for hub initiative templates, solutions or surveys
  if (includes(["template", "feedback"], content.family)) {
    return content.id;
  }

  // If it is a hub page linked to a site, return the page slug at the
  // site data instead. Because this one is the original one that was used
  // to create the page url (not mutable once created) and the slug (below)
  // generated by the hub-indexer could simply change with page name.

  if (isPageContent(content)) {
    // check if the page is linked to the current site
    const pages: IHubContent[] = getProp(site, "data.values.pages") || [];
    // if so, return the page slug otherwise the page id
    const page = pages.find((p: any) => p.id === content.id);
    return page ? page.slug : content.id;
  }

  // If a slug is present, always return it
  if (content.slug) {
    let slug: string;
    const orgKey: string = getProp(site, "domainInfo.orgKey");
    // Use namespaced slug when on the umbrella site
    if (getProp(site, "data.values.isUmbrella")) {
      slug = content.slug;
    } else {
      // Use shortened slug if the slug's namespace is the same as the orgKey
      slug = removeContextFromSlug(content.slug, orgKey);
    }
    return slug;
  }

  return content.hubId || content.id;
}

//////////////////////
// Slug Helpers
//////////////////////

/**
 * Parse item ID and layer ID (if any) from dataset record ID
 *
 * @param datasetId Hub API dataset record id ({itemId}_{layerId} or {itemId})
 * @returns A hash with the `itemId` and `layerId` (if any)
 */
export function parseDatasetId(datasetId: string): {
  itemId: string;
  layerId?: string;
} {
  const [itemId, layerId] = datasetId ? datasetId.split("_") : [];
  return { itemId, layerId };
}

/**
 * Determine if an identifier is a Hub API slug
 *
 * @param identifier Hub API slug ({orgKey}::{title-as-slug} or {title-as-slug})
 * or record id ((itemId}_{layerId} or {itemId})
 * @returns true if the identifier is valid _and_ is **not** a record id
 */
export function isSlug(identifier: string): boolean {
  const { itemId } = parseDatasetId(identifier);
  if (!itemId || isGuid(itemId)) {
    // it's either invalid, or an item id, or a dataset id
    return false;
  }
  // otherwise assume it's a slug
  return true;
}

/**
 * Add a context (prefix) to slug if it doesn't already have one
 *
 * @param slug Hub API slug (with or without context)
 * @param context usually a portal's orgKey
 * @returns slug with context ({context}::{slug})
 */
export function addContextToSlug(slug: string, context: string): string {
  // the slug has an org key already e.g. dc::crime-incidents
  if (/.+::.+/.test(slug)) {
    return slug;
    // the slug belongs to the org that owns the site e.g. crime-incidents
  } else {
    return `${context}::${slug}`;
  }
}

/**
 * Remove context (prefix) from a slug
 *
 * @param slug Hub API slug with context
 * @param context usually a portal's orgKey
 * @returns slug without context
 */
export function removeContextFromSlug(slug: string, context: string): string {
  if (context && slug.match(`${context}::`)) {
    return slug.split(`${context}::`)[1];
  } else {
    return slug;
  }
}

/**
 * Splits item category strings at slashes and discards the "Categories" keyword
 *
 * ```
 * ["/Categories/Boundaries", "/Categories/Planning and cadastre/Property records", "/Categories/Structure"]
 * ```
 * Should end up being
 * ```
 * ["Boundaries", "Planning and cadastre", "Property records", "Structure"]
 * ```
 *
 * @param categories - an array of strings
 * @private
 */
export function parseItemCategories(categories: string[]) {
  if (!categories) return categories;

  const exclude = ["categories", ""];
  const parsed = categories.map((cat) => cat.split("/"));
  const flattened = parsed.reduce((acc, arr, _) => [...acc, ...arr], []);
  return flattened.filter((cat) => !includes(exclude, cat.toLowerCase()));
}

/**
 * return the Hub family given an item's type
 * @param type item type
 * @returns Hub family
 */
export function getFamily(type: string) {
  let family;
  // override default behavior for the rows that are highlighted in yellow here:
  // https://esriis.sharepoint.com/:x:/r/sites/ArcGISHub/_layouts/15/Doc.aspx?sourcedoc=%7BADA1C9DC-4F6C-4DE4-92C6-693EF9571CFA%7D&file=Hub%20Routes.xlsx&nav=MTBfe0VENEREQzI4LUZFMDctNEI0Ri04NjcyLThCQUE2MTA0MEZGRn1fezIwMTIwMEJFLTA4MEQtNEExRC05QzA4LTE5MTAzOUQwMEE1RH0&action=default&mobileredirect=true&cid=df1c874b-c367-4cea-bc13-7bebfad3f2ac
  switch ((type || "").toLowerCase()) {
    case "image service":
      family = "dataset";
      break;
    case "feature service":
    case "raster layer":
      // TODO: check if feature service has > 1 layer first?
      family = "map";
      break;
    case "microsoft excel":
      family = "document";
      break;
    case "cad drawing":
    case "feature collection template":
    case "report template":
      family = "content";
      break;
    default:
      // by default derive from collection
      family = collectionToFamily(getCollection(type));
  }
  return family as HubFamily;
}

/**
 * DEPRECATED: Use getFamily() instead.
 *
 * get the HubType for a given item or item type
 *
 * @param itemOrType an item or item.type
 */
export function getItemHubType(itemOrType: IItem | string): HubType {
  /* tslint:disable no-console */
  console.warn(
    "DEPRECATED: Use getFamily() instead. getItemHubType() will be removed at v10.0.0"
  );
  /* tslint:enable no-console */
  if (typeof itemOrType === "string") {
    itemOrType = { type: itemOrType } as IItem;
  }
  const itemType = normalizeItemType(itemOrType);
  // TODO: not all categories are Hub types, may need to validate
  return getCollection(itemType) as HubType;
}

/**
 * Convert a Portal item to Hub content
 *
 * @param item Portal Item
 * @returns Hub content
 * @export
 */
export function itemToContent(item: IItem): IHubContent {
  const createdDate = new Date(item.created);
  const createdDateSource = "item.created";
  const properties = item.properties;
  const content = Object.assign({}, item, {
    identifier: item.id,
    // no server errors when fetching the item directly
    errors: [],
    // store a reference to the item
    item,
    // NOTE: this will overwrite any existing item.name, which is
    // The file name of the item for file types. Read-only.
    // presumably there to use as the default file name when downloading
    // we don't store item.name in the Hub API and we use name for title
    name: item.title,
    // TODO: hubType is no longer used, remove it at next breaking change
    hubType: getItemHubType(item),
    categories: parseItemCategories(item.categories),
    itemCategories: item.categories,
    // can we strip HTML from description, and do we need to trim it to a X chars?
    summary: item.snippet || item.description,
    publisher: {
      name: item.owner,
      username: item.owner,
    },
    permissions: {
      visibility: item.access,
      control: item.itemControl || "view",
    },
    // Hub app configuration metadata from item properties
    actionLinks: properties && properties.links,
    hubActions: properties && properties.actions,
    metrics: properties && properties.metrics,
    isDownloadable: isDownloadable(item),
    // default boundary from item.extent
    license: { name: "Custom License", description: item.accessInformation },
    // dates and sources we will enrich these later...
    createdDate,
    createdDateSource,
    publishedDate: createdDate,
    publishedDateSource: createdDateSource,
    updatedDate: new Date(item.modified),
    updatedDateSource: "item.modified",
    structuredLicense: getStructuredLicense(item.licenseInfo),
  });
  return setContentExtent(setContentType(content, item.type), item.extent);
}

/**
 * Convert a Hub API dataset resource to Hub Content
 *
 * @param {DatasetResource} Dataset resource
 * @returns {IHubContent} Hub content object
 * @export
 */
export function datasetToContent(dataset: DatasetResource): IHubContent {
  // extract item from dataset, create content from the item
  const item = datasetToItem(dataset);
  const content = itemToContent(item);

  // We remove these because the indexer doesn't actually
  // preserve the original item categories so this attribute is invalid
  delete content.itemCategories;

  // overwrite or add enrichments from Hub API
  const { id: hubId, attributes } = dataset;
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
    // map and feature server enrichments
    server,
    layers,
    // NOTE: the Hub API also returns the following server properties
    // but we should be able to get them from the above server object
    // currentVersion, capabilities, tileInfo, serviceSpatialReference
    // maxRecordCount, supportedQueryFormats, etc
    // feature and raster layer enrichments
    layer,
    recordCount,
    statistics,
    // NOTE: the Hub API also returns the following layer properties
    // but we should be able to get them from the above layer object
    // supportedQueryFormats, supportsAdvancedQueries, advancedQueryCapabilities, useStandardizedQueries
    // geometryType, objectIdField, displayField, fields,
    // org properties?
    orgId,
    orgName,
    organization,
    orgExtent,
    // NOTE: for layers and tables the Hub API returns the layer type
    // ("Feature Layer", "Table", "Raster Layer") instead of the item type
    type,
  } = attributes;

  // NOTE: we could throw or return if there are errors
  // to prevent type errors trying to read properties below
  content.errors = errors;

  // common enrichments
  content.boundary = boundary;
  if (!isBBox(item.extent) && extent && isBBox(extent.coordinates)) {
    // we fall back to the extent derived by the API
    // which prefers layer or service extents and ultimately
    // falls back to the org's extent
    content.extent = extent.coordinates;
  }
  // setting this to null signals to enrichMetadata to skip this
  content.metadata = metadata || null;
  if (content.modified !== modified) {
    // capture the enriched modified date
    // NOTE: the item modified date is still available on content.item.modified
    content.modified = modified;
    content.updatedDate = new Date(modified);
    content.updatedDateSource = modifiedProvenance;
  }
  content.slug = slug;
  if (searchDescription) {
    // overwrite default summary (from snippet) w/ search description
    content.summary = searchDescription;
  }
  content.groupIds = groupIds;
  // server enrichments
  content.server = server;
  content.layers = layers;
  // layer enrichments
  content.layer = layer;
  content.recordCount = recordCount;
  content.statistics = statistics;
  // org enrichments
  if (orgId) {
    content.org = {
      id: orgId,
      name: orgName || organization,
      extent: orgExtent,
    };
  }
  // return a content with updated hubId and type
  // along w/ related properties like identifier, family, etc
  return setContentType(setContentHubId(content, hubId), type);
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
    serviceSpatialReference,
  } = attributes;

  // layer datasets will get their type from the layer
  // so we will need to derive the item type from the URL
  const serviceType = url && getServiceTypeFromUrl(url);

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
      (modifiedProvenance === "item.modified" && modified)) as number,
    title: (title || name) as string,
    type: serviceType || type,
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
    scoreCompleteness,
  };
}

/**
 * returns a new content that has the specified type and
 * and updated related properties like normalizedType, family, etc
 * @param content orignal content
 * @param type new type
 * @returns new content
 */
export const setContentType = (
  content: IHubContent,
  type: string
): IHubContent => {
  // get family and normalized type based on new type
  const normalizedType = normalizeItemType({ ...content.item, type });
  const family = getFamily(normalizedType);
  const contentTypeIcon = getContentTypeIcon(normalizedType);
  const contentTypeLabel = getContentTypeLabel(
    normalizedType,
    content.isProxied
  );
  // TODO: don't we need to update content.item.type too?
  const updated = {
    ...content,
    type,
    family,
    normalizedType,
    contentTypeIcon,
    contentTypeLabel,
  };
  // update the relative URL to the content
  // which is based on type and family
  return appendContentUrls(updated, {
    relative: getContentRelativeUrl(updated),
  });
};

/**
 * Compute the content type icon based on the normalizedType
 * @param normalizedType
 * @returns content type icon
 */
export const getContentTypeIcon = (normalizedType: string) => {
  const type = camelize(normalizedType || "");
  const iconMap = {
    appbuilderExtension: "file",
    appbuilderWidgetPackage: "widgets-source",
    application: "web",
    arcgisProMap: "desktop",
    cadDrawing: "file-cad",
    cityEngineWebScene: "urban-model",
    codeAttachment: "file-code",
    colorSet: "palette",
    contentCategorySet: "label",
    csv: "file-csv",
    cSV: "file-csv",
    cSVCollection: "file-csv",
    dashboard: "dashboard",
    desktopApplication: "desktop",
    documentLink: "link",
    excaliburImageryProject: "file",
    explorerMap: "file",
    exportPackage: "file",
    featureCollection: "data",
    featureCollectionTemplate: "file",
    featureLayer: "data",
    featureService: "collection",
    fileGeodatabase: "data",
    form: "survey",
    geocodingService: "file",
    geodataService: "file",
    geometryService: "file",
    geopackage: "file",
    geoprocessingService: "file",
    globeLayer: "layers",
    globeService: "file",
    hubInitiative: "initiative",
    hubInitiativeTemplate: "initiative-template",
    hubPage: "browser",
    hubSiteApplication: "web",
    image: "file-image",
    imageService: "data",
    insightsModel: "file",
    insightsPage: "graph-moving-average",
    insightsTheme: "palette",
    insightsWorkbook: "graph-moving-average",
    iWorkPages: "file-text",
    iWorkKeynote: "presentation",
    iWorkNumbers: "file-report",
    kML: "data",
    kMLCollection: "data",
    layer: "layers",
    layerPackage: "layers",
    locatorPackage: "file",
    mapArea: "file",
    mapDocument: "map-contents",
    mapImageLayer: "collection",
    mapPackage: "file",
    mapService: "collection",
    microsoftExcel: "file-report",
    microsoftPowerpoint: "presentation",
    microsoftWord: "file-text",
    mission: "file",
    mobileMapPackage: "map-contents",
    nativeApplication: "mobile",
    nativeApplicationInstaller: "file",
    nativeApplicationTemplate: "file",
    mobileApplication: "mobile",
    networkAnalysisService: "file",
    notebook: "code",
    orientedImageryCatalog: "file",
    orthoMappingProject: "file",
    orthoMappingTemplate: "file",
    pDF: "file-pdf",
    quickCaptureProject: "mobile",
    rasterLayer: "map",
    realTimeAnalytic: "file",
    relationalDatabaseConnection: "file",
    reportTemplate: "file",
    sceneLayer: "data",
    sceneService: "urban-model",
    serviceDefinition: "file",
    shapefile: "data",
    solution: "puzzle-piece",
    sqliteGeodatabase: "file",
    statisticalDataCollection: "file",
    storymap: "tour",
    storyMap: "tour",
    symbolSet: "file",
    table: "table",
    urbanModel: "urban-model",
    vectorTileService: "map",
    visioDocument: "conditional-rules",
    webExperience: "apps",
    webMap: "map",
    webMappingApplication: "apps",
    webScene: "urban-model",
    wfs: "map",
    wFS: "map",
    wMS: "map",
    wMTS: "map",
    workflowManagerService: "file",
    workforceProject: "list-check",
  } as any;
  return iconMap[type] ?? "file";
};

/**
 * Compute the content type label
 * @param normalizedType
 * @param isProxied
 * @returns content type label
 */
export const getContentTypeLabel = (
  normalizedType: string,
  isProxied: boolean
) => {
  return isProxied ? "CSV" : camelize(normalizedType || "");
};

/**
 * returns a new content that has the specified hubId and updated identifier
 * @param content orignal content
 * @param hubId new hubId
 * @returns new content
 */
export const setContentHubId = (
  content: IHubContent,
  hubId: string
): IHubContent => {
  const { id, slug } = content;
  // get the identifier which is based on hubId
  const identifier = slug || hubId || id;
  const updated = { ...content, hubId, identifier };
  // update the relative URL to the content
  // which is based on identifier
  return appendContentUrls(updated, {
    relative: getContentRelativeUrl(updated),
  });
};

/**
 * Calculates the relative and absolute urls for a given content on a specific site
 *
 * @param content
 * @param siteModel
 * @returns relative and absolute urls
 */
export const getContentSiteUrls = (content: IHubContent, siteModel: IModel) => {
  // compute relative URL using a site specific identifier
  const siteIdentifier = getContentIdentifier(content, siteModel);
  const relative = getContentRelativeUrl(content, siteIdentifier);
  // get the absolute URL to this content on the site
  const siteUrl = getProp(siteModel, "item.url").replace(/\/$/, "");
  const absolute = `${siteUrl}${relative}`;

  return { relative, absolute };
};

/**
 * append the absolute URL to the content on the site
 * also updates the relative URL in case the
 * @param content
 * @param siteModel
 * @returns
 */
export const setContentSiteUrls = (
  content: IHubContent,
  siteModel: IModel
): IHubContent => {
  const { relative, absolute: site } = getContentSiteUrls(content, siteModel);
  // append the updated URLs to a new content
  return appendContentUrls(content, {
    relative,
    site,
  });
};

// URL helpers
const appendContentUrls = (
  content: IHubContent,
  newUrls: Record<string, string>
): IHubContent => {
  // merge new urls into existing ones and return a new content
  const urls = { ...content.urls, ...newUrls };
  return { ...content, urls };
};

const getContentRelativeUrl = (
  content: IHubContent,
  siteIdentifier?: string
): string => {
  const { family } = content;
  // prefer site specific identifier if passed in
  const identifier = siteIdentifier || content.identifier;
  // solution types have their own logic
  let contentUrl = getSolutionUrl(content);
  if (!contentUrl) {
    const pluralizedFamilies = [
      "app",
      "dataset",
      "document",
      "map",
      "template",
    ];
    // default to the catchall content route
    let path = "/content";
    if (content.family === "feedback") {
      // exception
      path = "/feedback/surveys";
    } else if (isPageContent(content)) {
      // pages are in the document family,
      // but instead of showing the page's metadata on /documents/about
      // but we render the page on the pages route
      path = "/pages";
    } else if (pluralizedFamilies.indexOf(family) > -1) {
      // the rule
      path = `/${family}s`;
    }
    contentUrl = `${path}/${identifier}`;
  }
  return contentUrl;
};

const getSolutionUrl = (content: IHubContent): string => {
  let hubUrl;
  const { normalizedType, identifier } = content;
  if (normalizedType === "Solution") {
    // NOTE: as per the above spreadsheet,
    // solution types are now in the Template family
    // but we don't send them to the route for initiative templates
    if (content.typeKeywords?.indexOf("Deployed") > 0) {
      // deployed solutions go to the generic content route
      hubUrl = `/content/${identifier}`;
    }
    // others go to the solution about route
    hubUrl = `/templates/${identifier}/about`;
  }
  return hubUrl;
};

// page helpers
// TODO: we check both "Hub Page" and "Site Page" because we don't know whether the site is a portal or not
// In the future, the site object will have a site.isPortal() function that we can leverage
// instead of hardcoding the types here.
// TODO: should this be based on normalizedType instead?
const isPageContent = (content: IHubContent) =>
  includes(["Hub Page", "Site Page"], content.type);
