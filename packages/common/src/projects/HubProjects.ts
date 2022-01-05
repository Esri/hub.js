import { IUserRequestOptions } from "@esri/arcgis-rest-auth";
import { IHubProject } from "./types";
import { getAllResources, IResource, isGuid } from "..";
import {
  IItemResourceResponse,
  IUserItemOptions,
  removeItem,
} from "@esri/arcgis-rest-portal";
import { IRequestOptions } from "@esri/arcgis-rest-request";

/**
 * Create a new Hub Project item
 * @param project
 * @param requestOptions
 */
export function create(
  project: Partial<IHubProject>,
  requestOptions: IUserRequestOptions
): Promise<IHubProject> {
  const requiredProperties = ["title"];
  // create a default Project Model
  // transfer properties from the passed in project onto the model
  // create the item
  // fetch the new item
  // populate all the properties like we would with get()
  // return the new project object
  throw new Error("not implemented");
}

/**
 * Update a Hub Project
 * @param project
 * @param requestOptions
 */
export function update(
  project: IHubProject,
  requestOptions: IUserRequestOptions
): Promise<IHubProject> {
  // verify that the slug is unique
  // get the backing item & data
  // update the values from the passed in project
  //
  throw new Error("not implemented");
}

/**
 * Get a Hub Project by id or slug
 * @param identifier item id or slug
 * @param requestOptions
 */
export function get(
  identifier: string,
  requestOptions?: IUserRequestOptions
): Promise<IHubProject> {
  if (isGuid(identifier)) {
    // get item by id
  } else {
    // search for item using filter=typekeyword:slug|identifier
  }
  // assuming we have an item, get the /data
  // read properties from the Project Model
  // and construct then return a IHubProject pojo

  throw new Error("not implemented");
}

/**
 * Remove a Hub Project
 * @param id
 * @param requestOptions
 */
export async function remove(
  id: string,
  requestOptions: IUserRequestOptions
): Promise<void> {
  const ro = { ...requestOptions, ...{ id } } as IUserItemOptions;
  const resp = await removeItem(ro);
  // TODO: Error handling following JSON-API Error codes standard
}

/**
 * RESOURCES
 */

export function createResource(
  project: IHubProject,
  file: File,
  name: string,
  requestOptions: IUserRequestOptions
): Promise<IItemResourceResponse> {
  throw new Error("not implemented");
}

export function updateResource(
  project: IHubProject,
  file: File,
  name: string,
  requestOptions: IUserRequestOptions
): Promise<IItemResourceResponse> {
  throw new Error("not implemented");
}

export function removeResource(
  project: IHubProject,
  name: string,
  requestOptions: IUserRequestOptions
): Promise<void> {
  throw new Error("not implemented");
}

export function listResources(
  project: IHubProject,
  requestOptions: IUserRequestOptions
): Promise<IResource[]> {
  return getAllResources(project.id, requestOptions);
}

/**
 * UTILITIES
 */
export function isSlugUnique(
  slug: string,
  orgKey: string,
  requestOptions: IRequestOptions
): Promise<boolean> {
  // execute a search using `filter=typekeyword:slug|<orgKey>-<slug>` if any results, return false
  throw new Error("not implemented");
}

export function validateProject(project: Partial<IHubProject>): IValidation {
  throw new Error("not implemented");
}

// This will likely change to whatever Ajv returns
export interface IValidation {
  valid: boolean;
  errors: any[];
}
