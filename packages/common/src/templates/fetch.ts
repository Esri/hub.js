import { IRequestOptions } from "@esri/arcgis-rest-request";
import { IHubTemplate } from "../core/types/IHubTemplate";
import { IHubRequestOptions, IModel } from "../types";
import { isGuid, mapBy } from "../utils";
import { IItem, getItem } from "@esri/arcgis-rest-portal";
import { getItemBySlug } from "../items/slugs";
import { fetchModelFromItem } from "../models";
import { PropertyMapper } from "../core/_internal/PropertyMapper";
import { getPropertyMap } from "./_internal/getPropertyMap";
import { computeProps } from "./_internal/computeProps";
import { IHubSearchResult } from "../search/types";
import { getFamily } from "../content/get-family";
import { unique } from "../util";
import { parseInclude } from "../search/_internal/parseInclude";
import { fetchItemEnrichments } from "../items/_enrichments";
import { getProp } from "../objects";
import { computeLinks } from "./_internal/computeLinks";
import { getActivatedTemplateType } from "./utils";

/**
 * @private
 * Fetch a Hub Template backing item by id or slug
 * @param identifier item id or slug
 * @param requestOptions
 */
export async function fetchTemplate(
  identifier: string,
  requestOptions: IRequestOptions
): Promise<IHubTemplate> {
  let getPrms;
  if (isGuid(identifier)) {
    getPrms = getItem(identifier, requestOptions);
  } else {
    getPrms = getItemBySlug(identifier, requestOptions);
  }
  return getPrms.then((item) => {
    if (!item) return null;
    return convertItemToTemplate(item, requestOptions);
  });
}

/**
 * @private
 * Convert an Hub Solution Item into a Hub Template, fetching
 * any additional information that may be required
 * @param item
 * @param auth
 */
export async function convertItemToTemplate(
  item: IItem,
  requestOptions: IRequestOptions
): Promise<IHubTemplate> {
  const model = await fetchModelFromItem(item, requestOptions);
  // 1. Create a property mapper between the the template
  // object and item model
  const mapper = new PropertyMapper<Partial<IHubTemplate>, IModel>(
    getPropertyMap()
  );

  // 2. Map the item into an IHubTemplate
  const template = mapper.storeToEntity(model, {}) as IHubTemplate;

  // 3. Compute + set various properties on the IHubTemplate
  // that cannot be directly mapped from the item
  return computeProps(model, template, requestOptions);
}

/**
 * @private
 * Fetch template specific enrichments
 * @param item
 * @param include
 * @param requestOptions
 */
export async function enrichTemplateSearchResult(
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

  // 1. optionally enrich the template item with
  // well-known item enrichments
  const DEFAULTS: string[] = [];
  // merge default and provided "include" enrichments
  include = [...DEFAULTS, ...include].filter(unique);
  // Parse the includes into a valid set of enrichments
  const specs = include.map(parseInclude);
  // Extract out the low-level enrichments needed
  const enrichments = mapBy("enrichment", specs).filter(unique);
  // fetch the enrichments
  let enriched = {};
  if (enrichments.length) {
    enriched = await fetchItemEnrichments(item, enrichments, requestOptions);
  }
  // map the enriched props onto the result
  specs.forEach((spec) => {
    result[spec.prop] = getProp(enriched, spec.path);
  });

  // 2. append relevant links onto the search result - these
  // are the same links that get appended to the template entity
  result.links = computeLinks(item, requestOptions);

  // 3. append additional template-specific properties
  result.activatedType = getActivatedTemplateType(item);

  return result;
}
