import { getFamily } from "../content/get-family";
import { getHubRelativeUrl } from "../content/_internal/internalContentUtils";
import { fetchItemEnrichments } from "../items/_enrichments";
import { getProp } from "../objects";
import { getItemThumbnailUrl } from "../resources";
import { IHubSearchResult } from "../search";
import { parseInclude } from "../search/_internal/parseInclude";
import { IHubRequestOptions, IModel } from "../types";
import { getItemHomeUrl } from "../urls";
import { IRequestOptions } from "@esri/arcgis-rest-request";
import { getItem, IItem } from "@esri/arcgis-rest-portal";
import { unique } from "../util";
import { mapBy, isGuid } from "../utils";
import { getItemBySlug } from "../items/slugs";
import { IHubPage } from "../core";
import { fetchModelFromItem } from "../models";
import { PropertyMapper } from "../core/_internal/PropertyMapper";
import { getPropertyMap } from "./_internal/getPropertyMap";
import { computeProps } from "./_internal/computeProps";
import { IUserRequestOptions } from "@esri/arcgis-rest-auth";
import { IUserItemOptions, removeItem } from "@esri/arcgis-rest-portal";

/**
 * @private
 * Get a Hub Page by id or slug
 * @param identifier item id or slug
 * @param requestOptions
 */
export async function fetchPage(
  identifier: string,
  requestOptions: IRequestOptions
): Promise<IHubPage> {
  let getPrms;
  if (isGuid(identifier)) {
    // get item by id
    getPrms = getItem(identifier, requestOptions);
  } else {
    getPrms = getItemBySlug(identifier, requestOptions);
  }
  return getPrms.then((item) => {
    if (!item) return null;
    return convertItemToPage(item, requestOptions);
  });
}

/**
 * @private
 * Convert an Hub Page Item into a Hub Project, fetching any additional
 * information that may be required
 * @param item
 * @param auth
 * @returns
 */
export async function convertItemToPage(
  item: IItem,
  requestOptions: IRequestOptions
): Promise<IHubPage> {
  const model = await fetchModelFromItem(item, requestOptions);
  // TODO: In the future we will handle the boundary fetching from resource
  const mapper = new PropertyMapper<Partial<IHubPage>, IModel>(
    getPropertyMap()
  );
  const prj = mapper.storeToEntity(model, {}) as IHubPage;
  return computeProps(model, prj, requestOptions);
}

/**
 * @private
 * Remove a Hub Page
 * @param id
 * @param requestOptions
 */
export async function deletePage(
  id: string,
  requestOptions: IUserRequestOptions
): Promise<void> {
  const ro = { ...requestOptions, ...{ id } } as IUserItemOptions;
  await removeItem(ro);
  return;
}

/**
 * Fetch Page specific Enrichments
 * @param item
 * @param include
 * @param requestOptions
 * @returns
 */
export async function enrichPageSearchResult(
  item: IItem,
  include: string[],
  requestOptions: IHubRequestOptions
): Promise<IHubSearchResult> {
  // Create the basic structure
  const result: IHubSearchResult = {
    access: item.access,
    id: item.id,
    type: item.type,
    name: item.title,
    owner: item.owner,
    typeKeywords: item.typeKeywords,
    tags: item.tags,
    categories: item.categories,
    summary: item.snippet || item.description,
    createdDate: new Date(item.created),
    createdDateSource: "item.created",
    updatedDate: new Date(item.modified),
    updatedDateSource: "item.modified",
    family: getFamily(item.type),
    links: {
      self: "not-implemented",
      siteRelative: "not-implemented",
      thumbnail: "not-implemented",
    },
  };

  // default includes
  const DEFAULTS: string[] = [];
  // merge includes
  include = [...DEFAULTS, ...include].filter(unique);
  // Parse the includes into a valid set of enrichments
  const specs = include.map(parseInclude);
  // Extract out the low-level enrichments needed
  const enrichments = mapBy("enrichment", specs).filter(unique);
  // fetch the enrichments
  let enriched = {};
  if (enrichments.length) {
    // TODO: Look into caching for the requests in fetchItemEnrichments
    enriched = await fetchItemEnrichments(item, enrichments, requestOptions);
  }

  // map the enriched props onto the result
  specs.forEach((spec) => {
    result[spec.prop] = getProp(enriched, spec.path);
  });

  // Handle Links
  result.links.thumbnail = getItemThumbnailUrl(item, requestOptions);
  result.links.self = getItemHomeUrl(result.id, requestOptions);
  result.links.siteRelative = getHubRelativeUrl(
    result.type,
    result.id,
    item.typeKeywords
  );

  return result;
}
