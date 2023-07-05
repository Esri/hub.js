import { IUserRequestOptions } from "@esri/arcgis-rest-auth";

// Note - we separate these imports so we can cleanly spy on things in tests
import { createModel, getModel, updateModel } from "../models";
import { constructSlug, getUniqueSlug, setSlugKeyword } from "../items/slugs";
import { IUserItemOptions, removeItem } from "@esri/arcgis-rest-portal";
import { PropertyMapper } from "../core/_internal/PropertyMapper";
import { EntityResourceMap, IHubProject } from "../core/types";
import { DEFAULT_PROJECT, DEFAULT_PROJECT_MODEL } from "./defaults";
import { computeProps } from "./_internal/computeProps";
import { getPropertyMap } from "./_internal/getPropertyMap";
import { ProjectEditorType } from "./_internal/ProjectSchema";
import { setStatusKeyword } from "./_internal/setStatusKeyword";
import { cloneObject } from "../util";
import {
  getEntityEditorSchemas,
  UiSchemaElementOptions,
} from "../core/schemas";
import {
  EditorConfigType,
  IEditorConfig,
} from "../core/behaviors/IWithEditorBehavior";
import { setDiscussableKeyword } from "../discussions";
import { IModel } from "../types";

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
  project.typeKeywords = setStatusKeyword(project.typeKeywords, project.status);
  project.typeKeywords = setDiscussableKeyword(
    project.typeKeywords,
    project.isDiscussable
  );
  // Map project object onto a default project Model
  const mapper = new PropertyMapper<Partial<IHubProject>, IModel>(
    getPropertyMap()
  );
  // create model from object, using the default model as a starting point
  let model = mapper.objectToModel(project, cloneObject(DEFAULT_PROJECT_MODEL));
  // create the item
  model = await createModel(model, requestOptions);
  // map the model back into a IHubProject
  let newProject = mapper.modelToObject(model, {});
  newProject = computeProps(model, newProject, requestOptions);
  // and return it
  return newProject as IHubProject;
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
  project.typeKeywords = setStatusKeyword(project.typeKeywords, project.status);
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
  const modelToUpdate = mapper.objectToModel(project, model);
  // update the backing item
  const updatedModel = await updateModel(modelToUpdate, requestOptions);
  // now map back into a project and return that
  let updatedProject = mapper.modelToObject(updatedModel, project);
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

/**
 * DEPRECATED: the following will be removed at next breaking version
 * use the getEntityEditorSchemas function instead (which this function
 * has already been refactored to consume)
 *
 * Get the editor config for for the HubProject entity.
 * @param i18nScope translation scope to be interpolated into the uiSchema
 * @param type editor type - corresonds to the returned uiSchema
 * @param options optional hash of dynamic uiSchema element options
 */
/* istanbul ignore next deprecated */
export async function getHubProjectEditorConfig(
  i18nScope: string,
  type: EditorConfigType,
  options: UiSchemaElementOptions[] = []
): Promise<IEditorConfig> {
  const editorType = `hub:project:${type}` as ProjectEditorType;

  return getEntityEditorSchemas(i18nScope, editorType, options);
}
