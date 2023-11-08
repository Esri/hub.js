import { IUserRequestOptions } from "@esri/arcgis-rest-auth";

// Note - we separate these imports so we can cleanly spy on things in tests
import { createModel, getModel, updateModel } from "../models";
import { constructSlug, getUniqueSlug, setSlugKeyword } from "../items/slugs";
import {
  IPortal,
  IUserItemOptions,
  removeItem,
} from "@esri/arcgis-rest-portal";
import { PropertyMapper } from "../core/_internal/PropertyMapper";
import { IHubProject, IHubProjectEditor } from "../core/types";
import { DEFAULT_PROJECT, DEFAULT_PROJECT_MODEL } from "./defaults";
import { computeProps } from "./_internal/computeProps";
import { getPropertyMap } from "./_internal/getPropertyMap";
import { cloneObject } from "../util";
import { setDiscussableKeyword } from "../discussions";
import { IModel } from "../types";
import { setEntityStatusKeyword } from "../utils/internal/setEntityStatusKeyword";

/**
 * @private
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
  // add slug and status to keywords
  project.typeKeywords = setSlugKeyword(project.typeKeywords, project.slug);
  project.typeKeywords = setEntityStatusKeyword(
    project.typeKeywords,
    project.status
  );
  project.typeKeywords = setDiscussableKeyword(
    project.typeKeywords,
    project.isDiscussable
  );
  // Map project object onto a default project Model
  const mapper = new PropertyMapper<Partial<IHubProject>, IModel>(
    getPropertyMap()
  );
  // create model from object, using the default model as a starting point
  let model = mapper.entityToStore(project, cloneObject(DEFAULT_PROJECT_MODEL));
  // create the item
  model = await createModel(model, requestOptions);
  // map the model back into a IHubProject
  let newProject = mapper.storeToEntity(model, {});
  newProject = computeProps(model, newProject, requestOptions);
  // and return it
  return newProject as IHubProject;
}

/**
 * Convert a IHubProjectEditor back to an IHubProject
 * @param editor
 * @param portal
 * @returns
 */
export function editorToProject(
  editor: IHubProjectEditor,
  portal: IPortal
): IHubProject {
  // remove the ephemeral props we graft on for the editor
  delete editor._groups;
  // clone into a HubProject
  const project = cloneObject(editor) as IHubProject;
  // ensure there's an org url key
  project.orgUrlKey = editor.orgUrlKey ? editor.orgUrlKey : portal.urlKey;
  // copy the location extent up one level
  project.extent = editor.location?.extent;
  // return with a cast
  return project;
}

/**
 * @private
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
  // update the status keyword
  project.typeKeywords = setEntityStatusKeyword(
    project.typeKeywords,
    project.status
  );
  project.typeKeywords = setDiscussableKeyword(
    project.typeKeywords,
    project.isDiscussable
  );
  // get the backing item & data
  const model = await getModel(project.id, requestOptions);
  // create the PropertyMapper
  const mapper = new PropertyMapper<Partial<IHubProject>, IModel>(
    getPropertyMap()
  );
  // Note: Although we are fetching the model, and applying changes onto it,
  // we are not attempting to handle "concurrent edit" conflict resolution
  // but this is where we would apply that sort of logic
  const modelToUpdate = mapper.entityToStore(project, model);
  // update the backing item
  const updatedModel = await updateModel(modelToUpdate, requestOptions);
  // now map back into a project and return that
  let updatedProject = mapper.storeToEntity(updatedModel, project);
  updatedProject = computeProps(model, updatedProject, requestOptions);
  // the casting is needed because modelToObject returns a `Partial<T>`
  // where as this function returns a `T`
  return updatedProject as IHubProject;
}

/**
 * @private
 * Remove a Hub Project
 * @param id
 * @param requestOptions
 */
export async function deleteProject(
  id: string,
  requestOptions: IUserRequestOptions
): Promise<void> {
  const ro = { ...requestOptions, ...{ id } } as IUserItemOptions;
  await removeItem(ro);
  return;
}
