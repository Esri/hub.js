import { IUserItemOptions, removeItem } from "@esri/arcgis-rest-portal";
import { IHubDiscussion } from "../core/types";
import { createModel, getModel, updateModel } from "../models";
import { constructSlug, getUniqueSlug, setSlugKeyword } from "../items/slugs";
import {
  createSetting,
  removeSetting,
  updateSetting,
} from "./api/settings/settings";
import { PropertyMapper } from "../core/_internal/PropertyMapper";
import { getPropertyMap } from "./_internal/getPropertyMap";
import { computeProps } from "./_internal/computeProps";
import { DEFAULT_DISCUSSION, DEFAULT_DISCUSSION_MODEL } from "./defaults";
import { getDefaultEntitySettings } from "./api/settings/getDefaultEntitySettings";
import { IUserRequestOptions } from "@esri/arcgis-rest-auth";
import { setDiscussableKeyword } from "./utils";
import { IHubRequestOptions, IModel } from "../types";
import { cloneObject } from "../util";
import { arcgisToGeoJSON } from "@terraformer/arcgis";
import { Polygon } from "geojson";

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
  requestOptions: IHubRequestOptions
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
  discussion.typeKeywords = setDiscussableKeyword(
    discussion.typeKeywords,
    discussion.isDiscussable
  );
  // Map discussion object onto a default discussion Model
  const mapper = new PropertyMapper<Partial<IHubDiscussion>, IModel>(
    getPropertyMap()
  );
  // create model from object, using the default model as a starting point
  let model = mapper.entityToStore(
    discussion,
    cloneObject(DEFAULT_DISCUSSION_MODEL)
  );
  // create the item
  model = await createModel(model, requestOptions as IUserRequestOptions);
  const defaultSettings = getDefaultEntitySettings("discussion");
  // create the entity settings
  model.entitySettings = await createSetting({
    data: {
      id: model.item.id,
      type: defaultSettings.type,
      settings: {
        ...defaultSettings.settings,
        discussions: {
          ...defaultSettings.settings.discussions,
          ...discussion.discussionSettings,
        },
      },
    },
    ...requestOptions,
  });
  // map the model back into a IHubDiscussion
  let newDiscussion = mapper.storeToEntity(model, {});
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
  requestOptions: IHubRequestOptions
): Promise<IHubDiscussion> {
  // verify that the slug is unique, excluding the current discussion
  discussion.slug = await getUniqueSlug(
    { slug: discussion.slug, existingId: discussion.id },
    requestOptions
  );
  discussion.typeKeywords = setDiscussableKeyword(
    discussion.typeKeywords,
    discussion.isDiscussable
  );
  // get the backing item & data
  const model = await getModel(discussion.id, requestOptions);
  // create the PropertyMapper
  const mapper = new PropertyMapper<Partial<IHubDiscussion>, IModel>(
    getPropertyMap()
  );
  // Note: Although we are fetching the model, and applying changes onto it,
  // we are not attempting to handle "concurrent edit" conflict resolution
  // but this is where we would apply that sort of logic
  const modelToUpdate = mapper.entityToStore(discussion, model);
  // update the backing item
  const updatedModel = await updateModel(
    modelToUpdate,
    requestOptions as IUserRequestOptions
  );
  // now map back into a discussion and return that
  let updatedDiscussion = mapper.storeToEntity(updatedModel, discussion);
  updatedDiscussion = computeProps(model, updatedDiscussion, requestOptions);

  // persist location geometries to discussion settings as Polygon[]
  let allowedLocations: Polygon[];
  try {
    allowedLocations =
      updatedDiscussion.location?.geometries?.map(
        (geometry) => arcgisToGeoJSON(geometry) as any as Polygon
      ) || null;
  } catch (e) {
    allowedLocations = null;
    /* tslint:disable no-console */
    console.warn("Esri JSON conversion failed", e);
  }

  // create or update entity settings
  const defaultSettings = getDefaultEntitySettings("discussion");
  const settings = {
    ...defaultSettings.settings,
    discussions: {
      ...defaultSettings.settings.discussions,
      ...updatedDiscussion.discussionSettings,
      allowedLocations,
    },
  };
  const newOrUpdatedSettings = updatedDiscussion.entitySettingsId
    ? await updateSetting({
        id: updatedDiscussion.entitySettingsId,
        data: { settings },
        ...requestOptions,
      })
    : await createSetting({
        data: {
          id: updatedDiscussion.id,
          type: defaultSettings.type,
          settings,
        },
        ...requestOptions,
      });
  updatedDiscussion.entitySettingsId = newOrUpdatedSettings.id;
  updatedDiscussion.discussionSettings =
    newOrUpdatedSettings.settings.discussions;
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
  requestOptions: IHubRequestOptions
): Promise<void> {
  const ro = { ...requestOptions, ...{ id } } as IUserItemOptions;
  await removeItem(ro);
  try {
    await removeSetting({ id, ...requestOptions });
  } catch (e) {
    // suppress error
  }
  return;
}
