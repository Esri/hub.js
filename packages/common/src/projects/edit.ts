import type { IUserRequestOptions } from "@esri/arcgis-rest-request";

// Note - we separate these imports so we can cleanly spy on things in tests
import { constructSlug } from "../items/slugs";
import { IUserItemOptions, removeItem } from "@esri/arcgis-rest-portal";
import { PropertyMapper } from "../core/_internal/PropertyMapper";
import { DEFAULT_PROJECT, DEFAULT_PROJECT_MODEL } from "./defaults";
import { computeProps } from "./_internal/computeProps";
import { getPropertyMap } from "./_internal/getPropertyMap";
import { cloneObject } from "../util";
import { IModel } from "../hub-types";
import { setEntityStatusKeyword } from "../utils/internal/setEntityStatusKeyword";
import { ensureUniqueEntitySlug } from "../items/_internal/ensureUniqueEntitySlug";
import { IHubItemEntity } from "../core/types/IHubItemEntity";
import { IHubProject } from "../core/types/IHubProject";
import { setDiscussableKeyword } from "../discussions/utils";
import { createModel } from "../models/createModel";
import { getModel } from "../models/getModel";
import { updateModel } from "../models/updateModel";

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
  // ensure lowercase orgUrlKey
  project.orgUrlKey = project.orgUrlKey.toLowerCase();

  // Create a slug from the title if one is not passed in
  if (!project.slug) {
    project.slug = constructSlug(project.name, project.orgUrlKey);
  }
  // Ensure slug is  unique
  await ensureUniqueEntitySlug(project as IHubItemEntity, requestOptions);
  // add status to keywords
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
  newProject = await computeProps(model, newProject, requestOptions);
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
  await ensureUniqueEntitySlug(project as IHubItemEntity, requestOptions);
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

  // ----------------------------------------------------------------
  // Note: Although we are fetching the model, and applying changes onto it,
  // we are not attempting to handle "concurrent edit" conflict resolution
  // but this is where we would apply that sort of logic
  const modelToUpdate = mapper.entityToStore(project, model);
  // update the backing item
  const updatedModel = await updateModel(modelToUpdate, requestOptions);
  // now map back into a project and return that
  let updatedProject = mapper.storeToEntity(updatedModel, project);
  updatedProject = await computeProps(model, updatedProject, requestOptions);
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
