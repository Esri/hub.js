/* Copyright (c) 2018 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

import { IItem, getItem } from "@esri/arcgis-rest-portal";
import {
  HubType,
  HubFamily,
  IHubContent,
  IHubGeography,
  IHubRequestOptions,
  IBBox,
  createExtent,
  normalizeItemType,
  getCollection,
  includes,
  isDownloadable
} from "@esri/hub-common";
import {
  IFetchEnrichmentOptions,
  enrichContent,
  getPortalUrls
} from "./enrichments";

function itemExtentToBoundary(extent: IBBox): IHubGeography {
  return (
    extent &&
    extent.length && {
      // TODO: center?
      geometry: createExtent(
        extent[0][0],
        extent[0][1],
        extent[1][0],
        extent[1][1]
      )
    }
  );
}

/**
 * Return a new content with portal URL (home, API, and data) properties
 * DEPRECATED: Use getPortalUrls() instead. withPortalUrls will be removed at v9.0.0
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
    "DEPRECATED: Use getPortalUrls() instead. withPortalUrls will be removed at v9.0.0"
  );
  const portalUrls = getPortalUrls(content, requestOptions);
  return { ...content, ...portalUrls };
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
  const normalizedType = normalizeItemType(item);
  const content = Object.assign({}, item, {
    // no server errors when fetching the item directly
    errors: [],
    // store a reference to the item
    item,
    // NOTE: this will overwrite any existing item.name, which is
    // The file name of the item for file types. Read-only.
    // presumably there to use as the default file name when downloading
    // we don't store item.name in the Hub API and we use name for title
    name: item.title,
    family: getFamily(normalizedType),
    // TODO: should we alway be setting hubId here
    // or only when we know the item exists in the index
    hubId: item.id,
    hubType: getItemHubType(item),
    normalizedType,
    categories: parseItemCategories(item.categories),
    itemCategories: item.categories,
    // can we strip HTML from description, and do we need to trim it to a X chars?
    summary: item.snippet || item.description,
    publisher: {
      name: item.owner,
      username: item.owner
    },
    permissions: {
      visibility: item.access,
      control: item.itemControl || "view"
    },
    // Hub app configuration metadata from item properties
    actionLinks: properties && properties.links,
    hubActions: properties && properties.actions,
    metrics: properties && properties.metrics,
    isDownloadable: isDownloadable(item),
    // default boundary from item.extent
    boundary: itemExtentToBoundary(item.extent),
    license: { name: "Custom License", description: item.accessInformation },
    // dates and sources we will enrich these later...
    createdDate,
    createdDateSource,
    publishedDate: createdDate,
    publishedDateSource: createdDateSource,
    updatedDate: new Date(item.modified),
    updatedDateSource: "item.modified"
  });
  return content;
}

/**
 * get the HubType for a given item or item type
 *
 * @param itemOrType an item or item.type
 */
export function getItemHubType(itemOrType: IItem | string): HubType {
  if (typeof itemOrType === "string") {
    itemOrType = { type: itemOrType } as IItem;
  }
  const itemType = normalizeItemType(itemOrType);
  // TODO: not all categories are Hub types, may need to validate
  return getCollection(itemType) as HubType;
}

function collectionToFamily(collection: string): string {
  const overrides: any = {
    other: "content",
    solution: "template"
  };
  return overrides[collection] || collection;
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
  const parsed = categories.map(cat => cat.split("/"));
  const flattened = parsed.reduce((acc, arr, _) => [...acc, ...arr], []);
  return flattened.filter(cat => !includes(exclude, cat.toLowerCase()));
}

/**
 * Fetch content using the ArcGIS REST API
 * @param item id
 * @param options - request options that may include authentication
 */
export function getContentFromPortal(
  idOrItem: string | IItem,
  requestOptions?: IFetchEnrichmentOptions
): Promise<IHubContent> {
  const getItemPromise: Promise<IItem> =
    typeof idOrItem === "string"
      ? getItem(idOrItem, requestOptions)
      : Promise.resolve(idOrItem);

  return getItemPromise.then(item => {
    return enrichContent(itemToContent(item), requestOptions);
  });
}
