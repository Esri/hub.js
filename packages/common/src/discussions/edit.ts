import { IUserRequestOptions } from "@esri/arcgis-rest-auth";
import { IUserItemOptions, removeItem } from "@esri/arcgis-rest-portal";
import { IHubDiscussion } from "../core/types";
import { createModel, getModel, updateModel } from "../models";
import { constructSlug, getUniqueSlug, setSlugKeyword } from "../items/slugs";
import { cloneObject } from "../index";
import { PropertyMapper } from "../core/_internal/PropertyMapper";
import { getPropertyMap } from "./_internal/getPropertyMap";
import { computeProps } from "./_internal/computeProps";
import { DEFAULT_DISCUSSION, DEFAULT_DISCUSSION_MODEL } from "./defaults";

/**
 * @private
 * Create a new Hub Discussion item
 *
 * Minimal properties are name and orgUrlKey
 *
 * @param partialDiscussion a partial discussion
 * @param requestOptions user request options
 * @returns promise that resolves a IHubDiscussion
 */
export async function createDiscussion(
  partialDiscussion: Partial<IHubDiscussion>,
  requestOptions: IUserRequestOptions
): Promise<IHubDiscussion> {
  // merge incoming with the default
  // this expansion solves the typing somehow
  const discussion = { ...DEFAULT_DISCUSSION, ...partialDiscussion };

  // Create a slug from the title if one is not passed in
  if (!discussion.slug) {
    discussion.slug = constructSlug(discussion.name, discussion.orgUrlKey);
  }
  // Ensure slug is  unique
  discussion.slug = await getUniqueSlug(
    { slug: discussion.slug },
    requestOptions
  );
  // add slug to keywords
  discussion.typeKeywords = setSlugKeyword(
    discussion.typeKeywords,
    discussion.slug
  );
  // Map discussion object onto a default discussion Model
  const mapper = new PropertyMapper<Partial<IHubDiscussion>>(getPropertyMap());
  // create model from object, using the default model as a starting point
  let model = mapper.objectToModel(
    discussion,
    cloneObject(DEFAULT_DISCUSSION_MODEL)
  );
  // create the item
  model = await createModel(model, requestOptions);
  // map the model back into a IHubDiscussion
  let newDiscussion = mapper.modelToObject(model, {});
  newDiscussion = computeProps(model, newDiscussion, requestOptions);
  // and return it
  return newDiscussion as IHubDiscussion;
}

/**
 * @private
 * Update a Hub Discussion
 * @param discussion the discussion to update
 * @param requestOptions user request options
 * @returns promise that resolves a IHubDiscussion
 */
export async function updateDiscussion(
  discussion: IHubDiscussion,
  requestOptions: IUserRequestOptions
): Promise<IHubDiscussion> {
  // verify that the slug is unique, excluding the current discussion
  discussion.slug = await getUniqueSlug(
    { slug: discussion.slug, existingId: discussion.id },
    requestOptions
  );
  // get the backing item & data
  const model = await getModel(discussion.id, requestOptions);
  // create the PropertyMapper
  const mapper = new PropertyMapper<Partial<IHubDiscussion>>(getPropertyMap());
  // Note: Although we are fetching the model, and applying changes onto it,
  // we are not attempting to handle "concurrent edit" conflict resolution
  // but this is where we would apply that sort of logic
  const modelToUpdate = mapper.objectToModel(discussion, model);
  // update the backing item
  const updatedModel = await updateModel(modelToUpdate, requestOptions);
  // now map back into a discussion and return that
  let updatedDiscussion = mapper.modelToObject(updatedModel, discussion);
  updatedDiscussion = computeProps(model, updatedDiscussion, requestOptions);
  // the casting is needed because modelToObject returns a `Partial<T>`
  // where as this function returns a `T`
  return updatedDiscussion as IHubDiscussion;
}

/**
 * @private
 * Remove a Hub Discussion
 * @param id the discussion item id
 * @param requestOptions request options
 * @returns a promise
 */
export async function deleteDiscussion(
  id: string,
  requestOptions: IUserRequestOptions
): Promise<void> {
  const ro = { ...requestOptions, ...{ id } } as IUserItemOptions;
  await removeItem(ro);
  return;
}
