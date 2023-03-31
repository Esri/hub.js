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
  getItemThumbnailUrl,
  unique,
  mapBy,
  getProp,
  getFamily,
  IHubRequestOptions,
  getItemHomeUrl,
} from "../index";
import {
  IItem,
  IUserItemOptions,
  removeItem,
  getItem,
} from "@esri/arcgis-rest-portal";
import { IRequestOptions } from "@esri/arcgis-rest-request";

import { PropertyMapper } from "../core/_internal/PropertyMapper";
import { IHubInitiative } from "../core/types";
import { IHubSearchResult } from "../search";
import { parseInclude } from "../search/_internal/parseInclude";
import { fetchItemEnrichments } from "../items/_enrichments";
import { getHubRelativeUrl } from "../content/_internal/internalContentUtils";
import { DEFAULT_INITIATIVE, DEFAULT_INITIATIVE_MODEL } from "./defaults";
import { getPropertyMap } from "./_internal/getPropertyMap";
import { computeProps } from "./_internal/computeProps";

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
  // Map initiative object onto a default initiative Model
  const mapper = new PropertyMapper<Partial<IHubInitiative>>(getPropertyMap());
  // create model from object, using the default model as a starting point
  let model = mapper.objectToModel(
    initiative,
    cloneObject(DEFAULT_INITIATIVE_MODEL)
  );
  // create the item
  model = await createModel(model, requestOptions);
  // map the model back into a IHubInitiative
  let newInitiative = mapper.modelToObject(model, {});
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
  // get the backing item & data
  const model = await getModel(initiative.id, requestOptions);
  // create the PropertyMapper
  const mapper = new PropertyMapper<Partial<IHubInitiative>>(getPropertyMap());
  // Note: Although we are fetching the model, and applying changes onto it,
  // we are not attempting to handle "concurrent edit" conflict resolution
  // but this is where we would apply that sort of logic
  const modelToUpdate = mapper.objectToModel(initiative, model);
  // update the backing item
  const updatedModel = await updateModel(modelToUpdate, requestOptions);
  // now map back into an initiative and return that
  let updatedInitiative = mapper.modelToObject(updatedModel, initiative);
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
  const model = await fetchModelFromItem(item, requestOptions);
  const mapper = new PropertyMapper<Partial<IHubInitiative>>(getPropertyMap());
  const prj = mapper.modelToObject(model, {}) as IHubInitiative;
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
  result.links.thumbnail = getItemThumbnailUrl(item, requestOptions);
  result.links.self = getItemHomeUrl(result.id, requestOptions);
  result.links.siteRelative = getHubRelativeUrl(
    result.type,
    result.id,
    item.typeKeywords
  );

  return result;
}
