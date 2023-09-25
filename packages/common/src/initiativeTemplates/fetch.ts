import { getItem, IItem } from "@esri/arcgis-rest-portal";
import { IRequestOptions } from "@esri/arcgis-rest-request";
import { getFamily } from "../content";
import { getHubRelativeUrl } from "../content/_internal/internalContentUtils";
import { getRelativeWorkspaceUrl } from "../core";
import { IHubInitiativeTemplate } from "../core/types/IHubInitiativeTemplate";
import { PropertyMapper } from "../core/_internal/PropertyMapper";
import { getItemBySlug, getItemIdentifier } from "../items";
import { fetchItemEnrichments } from "../items/_enrichments";
import { fetchModelFromItem } from "../models";
import { getProp } from "../objects";
import { getItemThumbnailUrl } from "../resources";
import { IHubSearchResult } from "../search";
import { parseInclude } from "../search/_internal/parseInclude";
import { IHubRequestOptions, IModel } from "../types";
import { getItemHomeUrl } from "../urls";
import { unique } from "../util";
import { isGuid, mapBy } from "../utils";
import { computeProps } from "./_internal/computeProps";
import { getPropertyMap } from "./_internal/getPropertyMap";

export async function fetchInitiativeTemplate(
  identifier: string,
  requestOptions: IRequestOptions
): Promise<IHubInitiativeTemplate> {
  let getPrms;
  if (isGuid(identifier)) {
    // get item by id
    getPrms = getItem(identifier, requestOptions);
  } else {
    getPrms = getItemBySlug(identifier, requestOptions);
  }
  return getPrms.then((item) => {
    if (!item) return null;
    return convertItemToInitiativeTemplate(item, requestOptions);
  });
}

/**
 * @private
 * Convert a Hub Initiative Template Item into a Hub Initiative Template, feching any additional
 * information that may be required
 * @param item
 * @param requestOptions
 * @returns
 */
export async function convertItemToInitiativeTemplate(
  item: IItem,
  requestOptions: IRequestOptions
): Promise<IHubInitiativeTemplate> {
  const model = await fetchModelFromItem(item, requestOptions);
  // TODO: in the future we will handle the boundary fetching from resource
  const mapper = new PropertyMapper<Partial<IHubInitiativeTemplate>, IModel>(
    getPropertyMap()
  );
  const it = mapper.storeToEntity(model, {}) as IHubInitiativeTemplate;
  return computeProps(model, it, requestOptions);
}

export async function enrichInitiativeTemplateSearchResult(
  item: IItem,
  include: string[],
  requestOptions: IHubRequestOptions
): Promise<IHubSearchResult> {
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
      workspaceRelative: "not-implemented",
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
    // TODO: look into caching the requests in fetchItemEnrichments
    enriched = await fetchItemEnrichments(item, enrichments, requestOptions);
  }
  specs.forEach((spec) => {
    result[spec.prop] = getProp(enriched, spec.path);
  });

  // Handle links
  // TODO: link handling should be an enrichment
  result.links.thumbnail = getItemThumbnailUrl(item, requestOptions);
  result.links.self = getItemHomeUrl(result.id, requestOptions);
  const identifier = getItemIdentifier(item);
  result.links.siteRelative = getHubRelativeUrl(
    result.type,
    identifier,
    item.typeKeywords
  );
  result.links.workspaceRelative = getRelativeWorkspaceUrl(
    result.type,
    identifier
  );
  return result;
}
