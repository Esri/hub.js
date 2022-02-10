import { IUserRequestOptions } from "@esri/arcgis-rest-auth";

// Note - we separate these imports so we can cleanly spy on things in tests
import { createModel, getModel, getModelBySlug, updateModel } from "../models";
import { constructSlug, getUniqueSlug, setSlugKeyword } from "../items/slugs";
import {
  IModel,
  isGuid,
  cloneObject,
  Filter,
  IHubSearchOptions,
  ISearchResponse,
  _searchContent,
} from "..";
import { IUserItemOptions, removeItem } from "@esri/arcgis-rest-portal";
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
  // slug: "",
  // status: "inactive",
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
    typeKeywords: [],
    properties: {
      slug: "",
    },
  },
  data: {
    display: "about",
    timeline: {},
    org: {},
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
    "org",
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
    project.slug = constructSlug(project.name, project.org.key);
  }
  // Ensure slug is  unique
  project.slug = await getUniqueSlug(project.slug, requestOptions);
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
  // verify that the slug is unique
  // TODO: if the slug has not changed, we don't want to do this because
  // the existing item will cause this to increment
  project.slug = await getUniqueSlug(project.slug, requestOptions);
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
export function getProject(
  identifier: string,
  requestOptions: IRequestOptions
): Promise<IHubProject> {
  let getPrms;
  if (isGuid(identifier)) {
    // get item by id
    getPrms = getModel(identifier, requestOptions);
  } else {
    // search for item using filter=typekeywords:slug|identifier
    getPrms = getModelBySlug(identifier, requestOptions);
  }
  return getPrms.then((model) => {
    // transform the model into a HubProject
    const mapper = new PropertyMapper<Partial<IHubProject>>(
      getProjectPropertyMap()
    );
    const project = mapper.modelToObject(model, {}) as IHubProject;
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
// export async function searchProjects(
//   filter: Filter<"content">,
//   opts: IHubSearchOptions
// ): Promise<ISearchResponse<IHubProject>> {
//   return _searchContent(filter, opts).then((results) => {

//   })
// }
