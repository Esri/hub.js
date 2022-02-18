import { IUserRequestOptions, UserSession } from "@esri/arcgis-rest-auth";

// Note - we separate these imports so we can cleanly spy on things in tests
import {
  createModel,
  fetchModelFromItem,
  getModel,
  getModelBySlug,
  updateModel,
} from "../models";
import { constructSlug, getUniqueSlug, setSlugKeyword } from "../items/slugs";
import {
  IModel,
  isGuid,
  cloneObject,
  Filter,
  IHubSearchOptions,
  ISearchResponse,
  _searchContent,
  expandContentFilter,
  serializeContentFilterForPortal,
  getNextFunction,
  mergeContentFilter,
  getItemThumbnailUrl,
} from "..";
import {
  ISearchOptions,
  IUserItemOptions,
  removeItem,
  searchItems,
} from "@esri/arcgis-rest-portal";
import { IRequestOptions } from "@esri/arcgis-rest-request";

import { IPropertyMap, PropertyMapper } from "../core/helpers/PropertyMapper";
import { IHubProject } from "../core/types";

export const HUB_PROJECT_ITEM_TYPE = "Web Mapping Application";

/**
 * Default values of a IHubProject
 */
const DEFAULT_PROJECT: Partial<IHubProject> = {
  name: "No title provided",
  tags: [],
  typeKeywords: ["IHubProject", "HubProject"],
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
    getPrms = getModel(identifier, requestOptions);
  } else {
    // search for item using filter=typekeywords:slug|identifier
    // although we could leverage searchProjects with an appropriate filter
    // getModelBySlug is a generalized function that works for any type
    getPrms = getModelBySlug(identifier, requestOptions);
  }
  return getPrms.then((model) => {
    // transform the model into a HubProject
    const mapper = new PropertyMapper<Partial<IHubProject>>(
      getProjectPropertyMap()
    );
    const project = mapper.modelToObject(model, {}) as IHubProject;
    let token: string;
    if (requestOptions.authentication) {
      const us: UserSession = requestOptions.authentication as UserSession;
      token = us.token;
    }

    project.thumbnailUrl = getItemThumbnailUrl(
      model.item,
      requestOptions,
      token
    );
    return project;
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

// WIP: Need to resolve how best to execute this
// i.e. delegate to searchContent or just do an item search
// and convert to IHubProject objects.
//
export async function searchProjects(
  filter: Filter<"content">,
  options: IHubSearchOptions
): Promise<ISearchResponse<IHubProject>> {
  // Scope to Hub Projects
  const scopingFilter: Filter<"content"> = {
    filterType: "content",
    typekeywords: {
      exact: ["HubProject"],
    },
  };
  // merge filters
  const projectFilter = mergeContentFilter([scopingFilter, filter]);
  // expand filter so we can serialize to either api
  const expanded = expandContentFilter(projectFilter);
  const so = serializeContentFilterForPortal(expanded);
  // Aggregations
  if (options.aggregations?.length) {
    so.countFields = options.aggregations.join(",");
    so.countSize = 200;
  }
  // copy over various options
  if (options.num) {
    so.num = options.num;
  }
  if (options.sortField) {
    so.sortField = options.sortField;
  }
  if (options.sortOrder) {
    so.sortOrder = options.sortOrder;
  }
  if (options.site) {
    so.site = cloneObject(options.site);
  }
  if (options.authentication) {
    so.authentication = options.authentication;
  }
  return searchPortalProjects(so);
}

/**
 * Internal fn that takes
 * @param searchOptions
 * @returns
 */
async function searchPortalProjects(
  searchOptions: ISearchOptions
): Promise<ISearchResponse<IHubProject>> {
  const response = await searchItems(searchOptions);
  const hasNext: boolean = response.nextStart > -1;
  // TODO: Change to leveraging the enrichment pipelines

  // Convert the item's into models
  const modelPromises = response.results.map((itm) => {
    return fetchModelFromItem(itm, {
      authentication: searchOptions.authentication,
    });
  });
  const models = await Promise.all(modelPromises);
  // create a mapper to convert the model int
  const mapper = new PropertyMapper<Partial<IHubProject>>(
    getProjectPropertyMap()
  );

  let token: string;
  if (searchOptions.authentication) {
    const us: UserSession = searchOptions.authentication as UserSession;
    token = us.token;
  }

  // map over the results, converting them into IHubProject pojos
  const projects = models.map((m) => {
    const prj = mapper.modelToObject(m, {}) as IHubProject;
    prj.thumbnailUrl = getItemThumbnailUrl(
      m.item,
      { authentication: searchOptions.authentication },
      token
    );
    return prj;
  }) as unknown as IHubProject[];

  return {
    total: response.total,
    results: projects,
    facets: [],
    hasNext,
    next: getNextFunction<IHubProject>(
      searchOptions,
      response.nextStart,
      response.total,
      searchPortalProjects
    ),
  };
}
