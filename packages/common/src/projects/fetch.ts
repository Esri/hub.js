import { IRequestOptions } from "@esri/arcgis-rest-request";
import { getItem, IItem } from "@esri/arcgis-rest-portal";

import { getFamily } from "../content/get-family";
import { getHubRelativeUrl } from "../content/_internal/internalContentUtils";
import { IHubProject } from "../core/types";
import { PropertyMapper } from "../core/_internal/PropertyMapper";
import { getItemBySlug } from "../items/slugs";

import { fetchItemEnrichments } from "../items/_enrichments";
import { fetchModelFromItem } from "../models";
import { IHubSearchResult } from "../search";
import { IQuery } from "../search/types/IHubCatalog";
import { parseInclude } from "../search/_internal/parseInclude";
import { IHubRequestOptions, IModel } from "../types";
import { isGuid, mapBy } from "../utils";
import { computeProps } from "./_internal/computeProps";
import { getPropertyMap } from "./_internal/getPropertyMap";
import { unique } from "../util";
import { getProp } from "../objects/get-prop";
import { listAssociations } from "../associations";
import { getTypeByIdsQuery } from "../associations/internal/getTypeByIdsQuery";
import { computeLinks } from "./_internal/computeLinks";

/**
 * @private
 * Get a Hub Project by id or slug
 * @param identifier item id or slug
 * @param requestOptions
 */
export async function fetchProject(
  identifier: string,
  requestOptions: IRequestOptions
): Promise<IHubProject> {
  let getPrms;
  if (isGuid(identifier)) {
    // get item by id
    getPrms = getItem(identifier, requestOptions);
  } else {
    getPrms = getItemBySlug(identifier, requestOptions);
  }
  return getPrms.then((item) => {
    if (!item) return null;
    return convertItemToProject(item, requestOptions);
  });
}

/**
 * @private
 * Convert an Hub Project Item into a Hub Project, fetching any additional
 * information that may be required
 * @param item
 * @param auth
 * @returns
 */
export async function convertItemToProject(
  item: IItem,
  requestOptions: IRequestOptions
): Promise<IHubProject> {
  const model = await fetchModelFromItem(item, requestOptions);
  // TODO: In the future we will handle the boundary fetching from resource
  const mapper = new PropertyMapper<Partial<IHubProject>, IModel>(
    getPropertyMap()
  );
  const prj = mapper.storeToEntity(model, {}) as IHubProject;
  return computeProps(model, prj, requestOptions);
}

/**
 * @private
 * Fetch project specific enrichments
 * @param item
 * @param include
 * @param requestOptions
 * @returns
 */
export async function enrichProjectSearchResult(
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
    // TODO: Look into caching for the requests in fetchItemEnrichments
    enriched = await fetchItemEnrichments(item, enrichments, requestOptions);
  }
  // map the enriched props onto the result
  specs.forEach((spec) => {
    result[spec.prop] = getProp(enriched, spec.path);
  });

  // Add links to search result
  // TODO: Link handling should be an enrichment
  result.links = { ...computeLinks(item, requestOptions) };

  return result;
}

/**
 * Get a query that will fetch all the initiatives which the project has
 * chosen to connect to. If project has not defined any associations
 * to any Initiatives, will return `null`.
 * Currently, we have not implemented a means to get the list of initiatives that have
 * "Accepted" the Project via inclusion in it's catalog.
 *
 * If needed, this could be done by getting all the groups the project is shared into
 * then cross-walking that into the catalogs of all the Associated Initiatives
 * @param project
 * @returns
 */
export function getAssociatedInitiativesQuery(project: IHubProject): IQuery {
  // get the list of ids from the keywords
  const ids = listAssociations(project, "initiative").map((a) => a.id);
  if (ids.length) {
    // get the query
    return getTypeByIdsQuery("Hub Initiative", ids);
  } else {
    // if there are no
    return null;
  }
}
