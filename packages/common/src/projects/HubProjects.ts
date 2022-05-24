import { IUserRequestOptions, UserSession } from "@esri/arcgis-rest-auth";

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
  IModel,
  isGuid,
  cloneObject,
  Filter,
  IHubSearchOptions,
  ISearchResponse,
  _searchContent,
  mergeContentFilter,
  getItemThumbnailUrl,
  unique,
  mapBy,
  getProp,
  getFamily,
  IHubRequestOptions,
  getItemHomeUrl,
} from "..";
import {
  IItem,
  IUserItemOptions,
  removeItem,
  getItem,
} from "@esri/arcgis-rest-portal";
import { IRequestOptions } from "@esri/arcgis-rest-request";
import { searchContentEntities } from "../search/_internal/searchContentEntities";
import { IPropertyMap, PropertyMapper } from "../core/_internal/PropertyMapper";
import { IHubEntityBase, IHubProject } from "../core/types";
import { IHubSearchResult } from "../search";
import { parseInclude } from "../search/_internal/parseInclude";
import { fetchItemEnrichments } from "../items/_enrichments";
import { getHubRelativeUrl } from "../content/_internal";

export const HUB_PROJECT_ITEM_TYPE = "Hub Project";

/**
 * Default values of a IHubProject
 */
const DEFAULT_PROJECT: Partial<IHubProject> = {
  name: "No title provided",
  tags: [],
  typeKeywords: ["Hub Project"],
  status: "inactive",
};

/**
 * Default values for a new HubProject Model
 */
const DEFAULT_PROJECT_MODEL = {
  item: {
    type: HUB_PROJECT_ITEM_TYPE,
    title: "No Title Provided",
    description: "No Description Provided",
    snippet: "",
    tags: [],
    typeKeywords: ["Hub Project"],
    properties: {
      slug: "",
    },
  },
  data: {
    display: "about",
    timeline: {},
    status: "inactive",
    contacts: [],
    schemaVersion: 1,
  },
} as unknown as IModel;

/**
 * Returns an Array of IPropertyMap objects
 * We could define these directly, but since the
 * properties of IHubProject map directly to properties
 * on item or data, it's slightly less verbose to
 * generate the structure.
 * @returns
 */
function getProjectPropertyMap(): IPropertyMap[] {
  const itemProps = [
    "created",
    "culture",
    "description",
    "extent",
    "id",
    "modified",
    "owner",
    "snippet",
    "tags",
    "typeKeywords",
    "url",
    "type",
  ];
  const dataProps = [
    "contacts",
    "display",
    "geometry",
    "headerImage",
    "layout",
    "location",
    "status",
  ];
  const map: IPropertyMap[] = [];
  itemProps.forEach((entry) => {
    map.push({ objectKey: entry, modelKey: `item.${entry}` });
  });
  dataProps.forEach((entry) => {
    map.push({ objectKey: entry, modelKey: `data.${entry}` });
  });
  // Deeper mappings
  map.push({
    objectKey: "slug",
    modelKey: "item.properties.slug",
  });
  map.push({
    objectKey: "orgUrlKey",
    modelKey: "item.properties.orgUrlKey",
  });
  map.push({
    objectKey: "name",
    modelKey: "item.title",
  });
  return map;
}

/**
 * Create a new Hub Project item
 *
 * Minimal properties are name and org
 *
 * @param project
 * @param requestOptions
 */
export async function createProject(
  partialProject: Partial<IHubProject>,
  requestOptions: IUserRequestOptions
): Promise<IHubProject> {
  // merge incoming with the default
  // this expansion solves the typing somehow
  const project = { ...DEFAULT_PROJECT, ...partialProject };

  // Create a slug from the title if one is not passed in
  if (!project.slug) {
    project.slug = constructSlug(project.name, project.orgUrlKey);
  }
  // Ensure slug is  unique
  project.slug = await getUniqueSlug({ slug: project.slug }, requestOptions);
  // add slug to keywords
  project.typeKeywords = setSlugKeyword(project.typeKeywords, project.slug);
  // Map project object onto a default project Model
  const mapper = new PropertyMapper<Partial<IHubProject>>(
    getProjectPropertyMap()
  );
  // create model from object, using the default model as a starting point
  let model = mapper.objectToModel(project, cloneObject(DEFAULT_PROJECT_MODEL));
  // create the item
  model = await createModel(model, requestOptions);
  // map the model back into a IHubProject
  const newProject = mapper.modelToObject(model, {});
  // and return it
  return newProject as IHubProject;
}

/**
 * Update a Hub Project
 * @param project
 * @param requestOptions
 */
export async function updateProject(
  project: IHubProject,
  requestOptions: IUserRequestOptions
): Promise<IHubProject> {
  // verify that the slug is unique, excluding the current project
  project.slug = await getUniqueSlug(
    { slug: project.slug, existingId: project.id },
    requestOptions
  );
  // get the backing item & data
  const model = await getModel(project.id, requestOptions);
  // create the PropertyMapper
  const mapper = new PropertyMapper<Partial<IHubProject>>(
    getProjectPropertyMap()
  );
  // Note: Although we are fetching the model, and applying changes onto it,
  // we are not attempting to handle "concurrent edit" conflict resolution
  // but this is where we would apply that sort of logic
  const modelToUpdate = mapper.objectToModel(project, model);
  // update the backing item
  const updatedModel = await updateModel(modelToUpdate, requestOptions);
  // now map back into a project and return that
  const updatedProject = mapper.modelToObject(updatedModel, project);
  // the casting is needed because modelToObject returns a `Partial<T>`
  // where as this function returns a `T`
  return updatedProject as IHubProject;
}

/**
 * Get a Hub Project by id or slug
 * @param identifier item id or slug
 * @param requestOptions
 */
export function fetchProject(
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
 * Remove a Hub Project
 * @param id
 * @param requestOptions
 */
export async function destroyProject(
  id: string,
  requestOptions: IUserRequestOptions
): Promise<void> {
  const ro = { ...requestOptions, ...{ id } } as IUserItemOptions;
  await removeItem(ro);
  return;
}

/**
 * Search for Projects, and get IHubProject results
 *
 * Different from `searchContent` in that this returns the specific entity type
 *
 * @param filter
 * @param options
 * @returns
 */
export async function searchProjects(
  filter: Filter<"content">,
  options: IHubSearchOptions
): Promise<ISearchResponse<IHubProject>> {
  // Scope to Hub Projects
  const scopingFilter: Filter<"content"> = {
    filterType: "content",
    type: {
      exact: ["Hub Project"],
    },
  };
  // merge filters
  const projectFilter = mergeContentFilter([scopingFilter, filter]);

  return searchContentEntities(projectFilter, convertItemToProject, options);
}

/**
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
  const mapper = new PropertyMapper<Partial<IHubProject>>(
    getProjectPropertyMap()
  );
  let token: string;
  if (requestOptions.authentication) {
    const session: UserSession = requestOptions.authentication as UserSession;
    token = session.token;
  }
  const prj = mapper.modelToObject(model, {}) as IHubProject;
  prj.thumbnailUrl = getItemThumbnailUrl(model.item, requestOptions, token);
  return prj;
}

/**
 *
 * @param item
 * @param includes
 * @param requestOptions
 * @returns
 */
export async function enrichProjectSearchResult(
  item: IItem,
  includes: string[] = [],
  requestOptions?: IHubRequestOptions
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
  const DEFAULTS = ["data.status AS projectStatus"];
  // merge includes
  includes = [...includes, ...DEFAULTS].filter(unique);
  // Parse the includes into a valid set of enrichments
  const specs = includes.map(parseInclude);
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
