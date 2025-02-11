import { IUserRequestOptions } from "@esri/arcgis-rest-auth";
import { editorToEntity } from "../core/schemas/internal/metrics/editorToEntity";

// Note - we separate these imports so we can cleanly spy on things in tests
import {
  createModel,
  fetchModelFromItem,
  getModel,
  updateModel,
} from "../models";
import { constructSlug, getItemBySlug } from "../items/slugs";

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
  IHubInitiativeEditor,
  camelize,
} from "../index";
import { IQuery } from "../search/types/IHubCatalog";
import {
  IItem,
  IUserItemOptions,
  removeItem,
  getItem,
  updateGroup,
} from "@esri/arcgis-rest-portal";
import { IRequestOptions } from "@esri/arcgis-rest-request";

import { PropertyMapper } from "../core/_internal/PropertyMapper";
import { IHubInitiative, IHubItemEntity } from "../core/types";
import { IHubSearchResult } from "../search";
import { parseInclude } from "../search/_internal/parseInclude";
import { fetchItemEnrichments } from "../items/_enrichments";
import { DEFAULT_INITIATIVE, DEFAULT_INITIATIVE_MODEL } from "./defaults";
import { getPropertyMap } from "./_internal/getPropertyMap";
import { computeProps } from "./_internal/computeProps";
import { applyInitiativeMigrations } from "./_internal/applyInitiativeMigrations";
import { combineQueries } from "../search/_internal/combineQueries";
import { getTypeWithKeywordQuery } from "../associations/internal/getTypeWithKeywordQuery";
import { negateGroupPredicates } from "../search/negateGroupPredicates";
import { computeLinks } from "./_internal/computeLinks";
import { deriveLocationFromItem } from "../content/_internal/internalContentUtils";
import { setEntityStatusKeyword } from "../utils/internal/setEntityStatusKeyword";
import { editorToMetric } from "../metrics/editorToMetric";
import { setMetricAndDisplay } from "../core/schemas/internal/metrics/setMetricAndDisplay";
import { createId } from "../util";
import { IArcGISContext } from "../ArcGISContext";
import { convertHubGroupToGroup } from "../groups/_internal/convertHubGroupToGroup";
import { IHubGroup } from "../core/types/IHubGroup";
import { ensureUniqueEntitySlug } from "../items/_internal/ensureUniqueEntitySlug";

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
  await ensureUniqueEntitySlug(initiative as IHubItemEntity, requestOptions);
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
 * Convert a IHubInitiativeEditor back to an IHubInitiative
 * @param editor
 * @param portal
 * @returns
 */
export async function editorToInitiative(
  editor: IHubInitiativeEditor,
  context: IArcGISContext
): Promise<IHubInitiative> {
  const _metric = editor._metric;
  const _associations = editor._associations;

  // 1. remove the ephemeral props we graft onto the editor
  delete editor._groups;
  delete editor._thumbnail;
  delete editor.view?.featuredImage;
  delete editor._metric;
  delete editor._groups;
  delete editor._associations;

  // 2. clone into a HubInitiative and extract common properties
  let initiative = editorToEntity(editor, context.portal) as IHubInitiative;

  // 4. handle configured metric:
  //   a. transform editor values into metric + displayConfig
  //   b. set metric and displayConfig on initiative
  if (_metric && Object.keys(_metric).length) {
    const metricId =
      _metric.metricId || createId(camelize(`${_metric.cardTitle}_`));
    const { metric, displayConfig } = editorToMetric(_metric, metricId, {
      metricName: _metric.cardTitle,
    });

    initiative = setMetricAndDisplay(initiative, metric, displayConfig);
  }

  // 5. handle association group settings
  const assocGroupId = initiative.associations?.groupId;

  if (assocGroupId && _associations) {
    const associationGroup = convertHubGroupToGroup(_associations as IHubGroup);

    // handle group access
    if (_associations.groupAccess) {
      await updateGroup({
        group: {
          id: assocGroupId,
          access: _associations.groupAccess,
        },
        authentication: context.hubRequestOptions.authentication,
      });
    }

    // handle membership access
    if (_associations.membershipAccess) {
      await updateGroup({
        group: {
          id: assocGroupId,
          membershipAccess: associationGroup.membershipAccess,
          clearEmptyFields: true,
        },
        authentication: context.hubRequestOptions.authentication,
      });
    }
  }

  return initiative;
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
  await ensureUniqueEntitySlug(initiative as IHubItemEntity, requestOptions);
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
    typeKeywords: item.typeKeywords,
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
    location: deriveLocationFromItem(item),
    rawResult: item,
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
  result.links = computeLinks(item, requestOptions);

  return result;
}

// NOTE: even though I can't find any uses of
// this deprecated function in the codebase
// if you delete it, tests in the following files will fail
// but _only in node_, not in chrome, so go figure:
// - projects/fetch.test.ts
// - search/_internal/portalSearchItems.test.ts
/**
 * ** DEPRECATED: Please use the association methods directly.
 * This will be removed in the next breaking version **
 *
 * Related Projects are those that have the Initiative id in the
 * typekeywords but NOT in the catalog. We use this query to show
 * Projects which want to be associated but are not yet included in
 * the catalog
 * This is passed into the Gallery showing "Pending Projects"
 * @param initiative
 * @returns
 */
/* istanbul ignore next */
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
