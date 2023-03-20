import { IUserRequestOptions } from "@esri/arcgis-rest-auth";

// Note - we separate these imports so we can cleanly spy on things in tests
import {
  createModel,
  getModel,
  updateModel,
  upsertModelResources,
} from "../models";
import { constructSlug, getUniqueSlug, setSlugKeyword } from "../items/slugs";

import { IUserItemOptions, removeItem } from "@esri/arcgis-rest-portal";

import { PropertyMapper } from "../core/_internal/PropertyMapper";
import { EntityResourceMap, IHubProject } from "../core/types";
import { DEFAULT_PROJECT, DEFAULT_PROJECT_MODEL } from "./defaults";
import { HubProjectSchema, UiSchemaElementOptions } from "../core/schemas";
import { filterSchemaToUiSchema } from "../core/schemas/internal";
import { applyUiSchemaElementOptions } from "../core/schemas/internal/applyUiSchemaElementOptions";
import { computeProps } from "./_internal/computeProps";
import { getPropertyMap } from "./_internal/getPropertyMap";
import { cloneObject } from "../util";
import {
  EditorConfigType,
  IEditorConfig,
} from "../core/behaviors/IWithEditorBehavior";
import { interpolate } from "../items/interpolate";
import { configureBaseResources } from "../core/_internal/configureBaseResources";

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
  let resources;
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
  const mapper = new PropertyMapper<Partial<IHubProject>>(getPropertyMap());
  // create model from object, using the default model as a starting point
  let model = mapper.objectToModel(project, cloneObject(DEFAULT_PROJECT_MODEL));
  // if we have resources disconnect them from the model for now.
  if (model.resources) {
    resources = configureBaseResources(
      cloneObject(model.resources),
      EntityResourceMap
    );
    delete model.resources;
  }
  // create the item
  model = await createModel(model, requestOptions);
  // if we have resources, create them, then re-attach them to the model
  if (resources) {
    model = await upsertModelResources(model, resources, requestOptions);
  }
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
  let resources;
  // verify that the slug is unique, excluding the current project
  project.slug = await getUniqueSlug(
    { slug: project.slug, existingId: project.id },
    requestOptions
  );
  // get the backing item & data
  const model = await getModel(project.id, requestOptions);
  // create the PropertyMapper
  const mapper = new PropertyMapper<Partial<IHubProject>>(getPropertyMap());
  // Note: Although we are fetching the model, and applying changes onto it,
  // we are not attempting to handle "concurrent edit" conflict resolution
  // but this is where we would apply that sort of logic
  const modelToUpdate = mapper.objectToModel(project, model);
  // if we have resources disconnect them from the model for now.
  if (modelToUpdate.resources) {
    resources = configureBaseResources(
      cloneObject(modelToUpdate.resources),
      EntityResourceMap
    );
    delete modelToUpdate.resources;
  }
  // update the backing item
  let updatedModel = await updateModel(modelToUpdate, requestOptions);
  // if we have resources, create them, then re-attach them to the model
  if (resources) {
    updatedModel = await upsertModelResources(
      updatedModel,
      resources,
      requestOptions
    );
  }
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
 * Get the editor config for for the HubProject entity.
 * @param i18nScope Translation scope to be interpolated into the schemas
 * @param type
 * @param options Optional hash of Element component options
 * @returns
 */
export async function getHubProjectEditorConfig(
  i18nScope: string,
  type: "details" | "create" | "settings" | "basics" | "location" | "status",
  options: UiSchemaElementOptions[] = []
): Promise<IEditorConfig> {
  // schema is always the entire schema
  let schema = cloneObject(HubProjectSchema);
  // uiSchema is the dynamically imported based on the provided "type"
  let { uiSchema } = await {
    details: () => import("../core/schemas/projects/uiSchemas/edit"),
    create: () => import("../core/schemas/projects/uiSchemas/create"),
    settings: () => import("../core/schemas/projects/uiSchemas/settings"),
    basics: () => import("../core/schemas/projects/uiSchemas/basics"),
    location: () => import("../core/schemas/projects/uiSchemas/location"),
    status: () => import("../core/schemas/projects/uiSchemas/status"),
  }[type]();

  // filter out properties not used in the UI schema
  schema = filterSchemaToUiSchema(schema, uiSchema);
  // apply the options
  uiSchema = applyUiSchemaElementOptions(uiSchema, options);
  // interpolate the i18n scope into the uiSchema
  uiSchema = interpolate(uiSchema, { i18nScope });

  return Promise.resolve({ schema, uiSchema });
}
