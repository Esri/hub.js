import { IUserRequestOptions } from "@esri/arcgis-rest-auth";
import { IUserItemOptions, removeItem } from "@esri/arcgis-rest-portal";
import { IHubEditableContent } from "../core";

// Note - we separate these imports so we can cleanly spy on things in tests
import {
  createModel,
  getModel,
  updateModel,
  // upsertModelResources,
} from "../models";

import { PropertyMapper } from "../core/_internal/PropertyMapper";
import { getPropertyMap } from "./_internal/getPropertyMap";
import { cloneObject } from "../util";
import { IModel } from "../types";

// TODO: move this to defaults?
const DEFAULT_CONTENT_MODEL: IModel = {
  item: {
    title: "No Title Provided",
    description: "",
    snippet: "",
    tags: [],
    typeKeywords: [],
  },
  data: null,
} as unknown as IModel;

/**
 * @private
 * Create a new Hub Content item
 *
 * Minimal properties are name and org
 *
 */
export async function createContent(
  partialContent: Partial<IHubEditableContent>,
  requestOptions: IUserRequestOptions
): Promise<IHubEditableContent> {
  // let resources;
  // merge incoming with the default
  // this expansion solves the typing somehow
  const content = { /* ...DEFAULT_PROJECT, */ ...partialContent };

  // Map project object onto a default project Model
  const mapper = new PropertyMapper<Partial<IHubEditableContent>, IModel>(
    getPropertyMap()
  );
  // create model from object, using the default model as a starting point
  let model = mapper.objectToModel(content, cloneObject(DEFAULT_CONTENT_MODEL));

  // TODO: if we have resources disconnect them from the model for now.
  // if (model.resources) {
  //   resources = configureBaseResources(
  //     cloneObject(model.resources),
  //     EntityResourceMap
  //   );
  //   delete model.resources;
  // }
  // create the item
  model = await createModel(model, requestOptions);

  // TODO: if we have resources, create them, then re-attach them to the model
  // if (resources) {
  //   model = await upsertModelResources(model, resources, requestOptions);
  // }
  // map the model back into a IHubEditableContent
  const newContent = mapper.modelToObject(model, {});
  // TODO:
  // newContent = computeProps(model, newContent, requestOptions);
  // and return it
  return newContent as IHubEditableContent;
}

/**
 * @private
 * Update a Hub Content
 * @param content
 * @param requestOptions
 */
export async function updateContent(
  content: IHubEditableContent,
  requestOptions: IUserRequestOptions
): Promise<IHubEditableContent> {
  // let resources;

  // get the backing item & data
  const model = await getModel(content.id, requestOptions);
  // create the PropertyMapper
  const mapper = new PropertyMapper<Partial<IHubEditableContent>, IModel>(
    getPropertyMap()
  );
  // Note: Although we are fetching the model, and applying changes onto it,
  // we are not attempting to handle "concurrent edit" conflict resolution
  // but this is where we would apply that sort of logic
  const modelToUpdate = mapper.objectToModel(content, model);
  // TODO: if we have resources disconnect them from the model for now.
  // if (modelToUpdate.resources) {
  //   resources = configureBaseResources(
  //     cloneObject(modelToUpdate.resources),
  //     EntityResourceMap
  //   );
  //   delete modelToUpdate.resources;
  // }
  // update the backing item
  const updatedModel = await updateModel(modelToUpdate, requestOptions);
  // // if we have resources, create them, then re-attach them to the model
  // if (resources) {
  //   updatedModel = await upsertModelResources(
  //     updatedModel,
  //     resources,
  //     requestOptions
  //   );
  // }
  // now map back into a project and return that
  const updatedContent = mapper.modelToObject(updatedModel, content);
  // updatedContent = computeProps(model, updatedContent, requestOptions);
  // the casting is needed because modelToObject returns a `Partial<T>`
  // where as this function returns a `T`
  return updatedContent as IHubEditableContent;
}

/**
 * @private
 * Remove a Hub Content
 * @param id
 * @param requestOptions
 */
export async function deleteContent(
  id: string,
  requestOptions: IUserRequestOptions
): Promise<void> {
  const ro = { ...requestOptions, ...{ id } } as IUserItemOptions;
  await removeItem(ro);
  return;
}
