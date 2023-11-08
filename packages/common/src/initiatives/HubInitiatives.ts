import { IUserRequestOptions } from "@esri/arcgis-rest-auth";

// Note - we separate these imports so we can cleanly spy on things in tests
import {
  createModel,
  fetchModelFromItem,
  getModel,
  updateModel,
} from "../models";
import {
  constructSlug,
  getItemBySlug,
  getUniqueSlug,
  setSlugKeyword,
} from "../items/slugs";

import {
  isGuid,
  cloneObject,
  unique,
  mapBy,
  getProp,
  getFamily,
  IHubRequestOptions,
  setDiscussableKeyword,
  IModel,
} from "../index";
import { IQuery } from "../search/types/IHubCatalog";
import {
  IItem,
  IUserItemOptions,
  removeItem,
  getItem,
} from "@esri/arcgis-rest-portal";
import { IRequestOptions } from "@esri/arcgis-rest-request";

import { PropertyMapper } from "../core/_internal/PropertyMapper";
import { IEntityInfo, IHubInitiative } from "../core/types";
import { IHubSearchResult } from "../search";
import { parseInclude } from "../search/_internal/parseInclude";
import { fetchItemEnrichments } from "../items/_enrichments";
import { DEFAULT_INITIATIVE, DEFAULT_INITIATIVE_MODEL } from "./defaults";
import { getPropertyMap } from "./_internal/getPropertyMap";
import { computeProps } from "./_internal/computeProps";
import { applyInitiativeMigrations } from "./_internal/applyInitiativeMigrations";
import { combineQueries } from "../search/_internal/combineQueries";
import { portalSearchItemsAsItems } from "../search/_internal/portalSearchItems";
import { getTypeWithKeywordQuery } from "../associations/internal/getTypeWithKeywordQuery";
import { negateGroupPredicates } from "../search/_internal/negateGroupPredicates";
import { computeLinks } from "./_internal/computeLinks";
import { getHubRelativeUrl } from "../content/_internal/internalContentUtils";
import { setEntityStatusKeyword } from "../utils/internal/setEntityStatusKeyword";

/**
 * @private
 * Create a new Hub Initiative item
 *
 * Minimal properties are name and orgUrlKey
 *
 * @param partialInitiative
 * @param requestOptions
 */
export async function createInitiative(
  partialInitiative: Partial<IHubInitiative>,
  requestOptions: IUserRequestOptions
): Promise<IHubInitiative> {
  // merge incoming with the default
  // this expansion solves the typing somehow
  const initiative = { ...DEFAULT_INITIATIVE, ...partialInitiative };

  // Create a slug from the title if one is not passed in
  if (!initiative.slug) {
    initiative.slug = constructSlug(initiative.name, initiative.orgUrlKey);
  }
  // Ensure slug is  unique
  initiative.slug = await getUniqueSlug(
    { slug: initiative.slug },
    requestOptions
  );
  // add slug to keywords
  initiative.typeKeywords = setSlugKeyword(
    initiative.typeKeywords,
    initiative.slug
  );
  // add the status keyword
  initiative.typeKeywords = setEntityStatusKeyword(
    initiative.typeKeywords,
    initiative.status
  );
  initiative.typeKeywords = setDiscussableKeyword(
    initiative.typeKeywords,
    initiative.isDiscussable
  );
  // Map initiative object onto a default initiative Model
  const mapper = new PropertyMapper<Partial<IHubInitiative>, IModel>(
    getPropertyMap()
  );
  // create model from object, using the default model as a starting point
  let model = mapper.entityToStore(
    initiative,
    cloneObject(DEFAULT_INITIATIVE_MODEL)
  );
  // create the item
  model = await createModel(model, requestOptions);
  // map the model back into a IHubInitiative
  let newInitiative = mapper.storeToEntity(model, {});
  newInitiative = computeProps(model, newInitiative, requestOptions);
  // and return it
  return newInitiative as IHubInitiative;
}

/**
 * @private
 * Update a Hub Initiative
 * @param initiative
 * @param requestOptions
 */
export async function updateInitiative(
  initiative: IHubInitiative,
  requestOptions: IUserRequestOptions
): Promise<IHubInitiative> {
  // verify that the slug is unique, excluding the current initiative
  initiative.slug = await getUniqueSlug(
    { slug: initiative.slug, existingId: initiative.id },
    requestOptions
  );
  // update the status keyword
  initiative.typeKeywords = setEntityStatusKeyword(
    initiative.typeKeywords,
    initiative.status
  );
  initiative.typeKeywords = setDiscussableKeyword(
    initiative.typeKeywords,
    initiative.isDiscussable
  );
  // get the backing item & data
  const model = await getModel(initiative.id, requestOptions);
  // create the PropertyMapper
  const mapper = new PropertyMapper<Partial<IHubInitiative>, IModel>(
    getPropertyMap()
  );
  // Note: Although we are fetching the model, and applying changes onto it,
  // we are not attempting to handle "concurrent edit" conflict resolution
  // but this is where we would apply that sort of logic
  const modelToUpdate = mapper.entityToStore(initiative, model);
  // update the backing item
  const updatedModel = await updateModel(modelToUpdate, requestOptions);
  // now map back into an initiative and return that
  let updatedInitiative = mapper.storeToEntity(updatedModel, initiative);
  updatedInitiative = computeProps(model, updatedInitiative, requestOptions);
  // the casting is needed because modelToObject returns a `Partial<T>`
  // where as this function returns a `T`
  return updatedInitiative as IHubInitiative;
}

/**
 * @private
 * Get a Hub Initiative by id or slug
 * @param identifier item id or slug
 * @param requestOptions
 */
export function fetchInitiative(
  identifier: string,
  requestOptions: IRequestOptions
): Promise<IHubInitiative> {
  let getPrms;
  if (isGuid(identifier)) {
    // get item by id
    getPrms = getItem(identifier, requestOptions);
  } else {
    getPrms = getItemBySlug(identifier, requestOptions);
  }
  return getPrms.then((item) => {
    if (!item) return null;
    return convertItemToInitiative(item, requestOptions);
  });
}

/**
 * @private
 * Remove a Hub Initiative
 * @param id
 * @param requestOptions
 */
export async function deleteInitiative(
  id: string,
  requestOptions: IUserRequestOptions
): Promise<void> {
  const ro = { ...requestOptions, ...{ id } } as IUserItemOptions;
  await removeItem(ro);
  return;
}

/**
 * @private
 * Convert an Hub Initiative Item into a Hub Initiative, fetching any additional
 * information that may be required
 * @param item
 * @param auth
 * @returns
 */
export async function convertItemToInitiative(
  item: IItem,
  requestOptions: IRequestOptions
): Promise<IHubInitiative> {
  let model = await fetchModelFromItem(item, requestOptions);
  // apply migrations
  model = await applyInitiativeMigrations(model, requestOptions);
  const mapper = new PropertyMapper<Partial<IHubInitiative>, IModel>(
    getPropertyMap()
  );
  const prj = mapper.storeToEntity(model, {}) as IHubInitiative;
  return computeProps(model, prj, requestOptions);
}

/**
 * @private
 * Fetch Initiative specific enrichments
 * @param item
 * @param include
 * @param requestOptions
 * @returns
 */
export async function enrichInitiativeSearchResult(
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

  // Handle links
  // TODO: Link handling should be an enrichment
  result.links = {
    ...computeLinks(item, requestOptions),
    // TODO: remove once sites are separated from initiatives and
    // the initiatives view route is released
    siteRelative: getHubRelativeUrl(result.type, result.id),
  };

  return result;
}

/**
 * Fetch the Projects that are "Accepted" with an Initiative.
 * This is a subset of the "Associated" projects, limited
 * to those included in the Initiative's Catalog.
 * @param initiative
 * @param requestOptions
 * @param query: Optional `IQuery` to further filter the results
 * @returns
 */
export async function fetchAcceptedProjects(
  initiative: IHubInitiative,
  requestOptions: IHubRequestOptions,
  query?: IQuery
): Promise<IEntityInfo[]> {
  let projectQuery = getAcceptedProjectsQuery(initiative);
  // combineQueries will purge undefined/null entries
  projectQuery = combineQueries([projectQuery, query]);

  return queryAsEntityInfo(projectQuery, requestOptions);
}

/**
 * Fetch the Projects that are "Associated" to the Initiative but are not
 * "Accepted", meaning they have the keyword but are not included in the Initiative's Catalog.
 * This is how we can get the list of Projects awaiting Acceptance
 * @param initiative
 * @param requestOptions
 * @param query
 * @returns
 */
export async function fetchPendingProjects(
  initiative: IHubInitiative,
  requestOptions: IHubRequestOptions,
  query?: IQuery
): Promise<IEntityInfo[]> {
  let projectQuery = getPendingProjectsQuery(initiative);
  // combineQueries will purge undefined/null entries
  projectQuery = combineQueries([projectQuery, query]);

  return queryAsEntityInfo(projectQuery, requestOptions);
}

/**
 * Execute the query and convert into EntityInfo objects
 * @param query
 * @param requestOptions
 * @returns
 */
async function queryAsEntityInfo(
  query: IQuery,
  requestOptions: IHubRequestOptions
) {
  const response = await portalSearchItemsAsItems(query, {
    requestOptions,
    num: 100,
  });
  return response.results.map((item) => {
    return {
      id: item.id,
      name: item.title,
      type: item.type,
    } as IEntityInfo;
  });
}

/**
 * Associated projects are those with the Initiative id in the typekeywords
 * and is included in the Initiative's catalog.
 * This is passed into the Gallery showing "Approved Projects"
 * @param initiative
 * @returns
 */
export function getAcceptedProjectsQuery(initiative: IHubInitiative): IQuery {
  // get query that returns Hub Projects with the initiative keyword
  let query = getTypeWithKeywordQuery(
    "Hub Project",
    `initiative|${initiative.id}`
  );
  // Get the item scope from the catalog
  const qry = getProp(initiative, "catalog.scopes.item");
  // combineQueries will remove null/undefined entries
  query = combineQueries([query, qry]);

  return query;
}

/**
 * Related Projects are those that have the Initiative id in the
 * typekeywords but NOT in the catalog. We use this query to show
 * Projects which want to be associated but are not yet included in
 * the catalog
 * This is passed into the Gallery showing "Pending Projects"
 * @param initiative
 * @returns
 */
export function getPendingProjectsQuery(initiative: IHubInitiative): IQuery {
  // get query that returns Hub Projects with the initiative keyword
  let query = getTypeWithKeywordQuery(
    "Hub Project",
    `initiative|${initiative.id}`
  );
  // The the item scope from the catalog...
  const qry = getProp(initiative, "catalog.scopes.item");

  // negate the scope, combine that with the base query
  query = combineQueries([query, negateGroupPredicates(qry)]);

  return query;
}

// ALTHOUGH WE DON"T CURRENTLY HAVE A UX THAT NEEDS THIS
// THERE IS SOME DISCUSSION ABOUT IT BEING USEFUL SO I'M LEAVING
// THE CODE HERE, COMMENTED. SAME FOR TESTS
// /**
//  * Fetch Projects which are not "Connected" and are not in the
//  * Initiative's Catalog.
//  * @param initiative
//  * @param requestOptions
//  * @param query
//  * @returns
//  */
// export async function fetchUnConnectedProjects(
//   initiative: IHubInitiative,
//   requestOptions: IHubRequestOptions,
//   query?: IQuery
// ): Promise<IEntityInfo[]> {
//   let projectQuery = getUnConnectedProjectsQuery(initiative);
//   // combineQueries will purge undefined/null entries
//   projectQuery = combineQueries([projectQuery, query]);

//   return queryAsEntityInfo(projectQuery, requestOptions);
// }
// /**
//  * Un-connected projects are those without Initiative id in the typekeywords
//  * and is NOT included in the Initiative's catalog.
//  * This can be used to locate "Other" Projects
//  * @param initiative
//  * @returns
//  */
// export function getUnConnectedProjectsQuery(
//   initiative: IHubInitiative
// ): IQuery {
//   // get query that returns Hub Projects with the initiative keyword
//   let query = getTypeWithoutKeywordQuery(
//     "Hub Project",
//     `initiative|${initiative.id}`
//   );
//   // The the item scope from the catalog...
//   const qry = getProp(initiative, "catalog.scopes.item");

//   // negate the scope, combine that with the base query
//   query = combineQueries([query, negateGroupPredicates(qry)]);
//   return query;
// }
