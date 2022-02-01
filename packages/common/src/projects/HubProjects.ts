import { IUserRequestOptions } from "@esri/arcgis-rest-auth";
import { IHubProject } from ".";
// Note - we separate these imports so we can cleanly spy on things in tests
import { createModel, getModel, getModelBySlug, updateModel } from "../models";
import { getUniqueSlug } from "../items/slugs";
import { IModel, isGuid, cloneObject } from "..";
import { IUserItemOptions, removeItem } from "@esri/arcgis-rest-portal";
import { IRequestOptions } from "@esri/arcgis-rest-request";
import { createSlug, IPropertyMap, setSlugKeyword } from "./utils";
import { PropertyMapper } from "./utils";

/**
 * Default values of a IHubProject
 */
const DEFAULT_PROJECT: Partial<IHubProject> = {
  title: "No title provided",
  properties: {},
  tags: [],
  typeKeywords: ["IHubProject", "HubProject"],
  slug: "",
  // status: "inactive",
};

export const PROJECT_ITEM_TYPE = "Web Mapping Application";

/**
 * Default values for a new HubProject Model
 */
const DEFAULT_PROJECT_MODEL = {
  item: {
    type: PROJECT_ITEM_TYPE,
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
export function getPropertyMap(): IPropertyMap[] {
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
    "title",
    "typeKeywords",
    "url",
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
  return map;
}

/**
 * Create a new Hub Project item
 * @param project
 * @param requestOptions
 */
export async function create(
  partialProject: IHubProject,
  requestOptions: IUserRequestOptions
): Promise<IHubProject> {
  // merge incoming with the default
  const project = { ...DEFAULT_PROJECT, ...partialProject };

  // Create a slug from the title if one is not passed in
  if (!project.slug) {
    project.slug = createSlug(project.title, project.org.key);
  }
  // Ensure slug is  unique
  project.slug = await getUniqueSlug(project.slug, requestOptions);
  // add slug to keywords
  project.typeKeywords = setSlugKeyword(project.typeKeywords, project.slug);
  // Map project object onto a default project Model
  const mapper = new PropertyMapper<Partial<IHubProject>>(getPropertyMap());
  // create model from object, using the default model as a starting point
  let model = mapper.objectToModel(project, cloneObject(DEFAULT_PROJECT_MODEL));
  // create the item
  model = await createModel(model, requestOptions);
  // map the model back into a IHubProject
  const newProject = mapper.modelToObject(model, {});
  // and return it
  return newProject as IHubProject;
  // TODO Error handling
}

/**
 * Update a Hub Project
 * @param project
 * @param requestOptions
 */
export async function update(
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
  const mapper = new PropertyMapper<Partial<IHubProject>>(getPropertyMap());
  // Although we are applying changes onto the model, we are not
  // checking if there were changes in the meantime
  // TODO: add checks on `modified` timestamps
  const modelToUpdate = mapper.objectToModel(project, model);
  // update the backing item
  const updatedModel = await updateModel(modelToUpdate, requestOptions);
  // now map back into the project and return that
  const updatedProject = mapper.modelToObject(updatedModel, project);
  return updatedProject as IHubProject;
  // TODO: Error handling following JSON-API Error codes standard
}

/**
 * Get a Hub Project by id or slug
 * @param identifier item id or slug
 * @param requestOptions
 */
export function get(
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
    const mapper = new PropertyMapper<Partial<IHubProject>>(getPropertyMap());
    const project = mapper.modelToObject(model, {}) as IHubProject;
    return project;
  });
}

/**
 * Remove a Hub Project
 * @param id
 * @param requestOptions
 */
export async function destroy(
  id: string,
  requestOptions: IUserRequestOptions
): Promise<{ success: boolean; itemId: string }> {
  const ro = { ...requestOptions, ...{ id } } as IUserItemOptions;
  return removeItem(ro);
}

/**
 * RESOURCES
 * Extract to another module and delegate
 */

// export function createResource(
//   project: IHubProject,
//   file: File,
//   name: string,
//   requestOptions: IUserRequestOptions
// ): Promise<IItemResourceResponse> {
//   throw new Error("not implemented");
// }

// export function updateResource(
//   project: IHubProject,
//   file: File,
//   name: string,
//   requestOptions: IUserRequestOptions
// ): Promise<IItemResourceResponse> {
//   throw new Error("not implemented");
// }

// export function removeResource(
//   project: IHubProject,
//   name: string,
//   requestOptions: IUserRequestOptions
// ): Promise<void> {
//   throw new Error("not implemented");
// }

// export function listResources(
//   project: IHubProject,
//   requestOptions: IUserRequestOptions
// ): Promise<IResource[]> {
//   return getAllResources(project.id, requestOptions);
// }

/**
 * UTILITIES
 */
// export function validateProject(project: Partial<IHubProject>): IValidation {
//   throw new Error("not implemented");
// }

// // This will likely change to whatever Ajv returns
// export interface IValidation {
//   valid: boolean;
//   errors: any[];
// }
