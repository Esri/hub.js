import { IUserItemOptions, removeItem } from "@esri/arcgis-rest-portal";
import { constructSlug } from "../items/slugs";
import { ensureUniqueEntitySlug } from "../items/_internal/ensureUniqueEntitySlug";
import { removeSettingV2 } from "./api/settings/settings";
import { PropertyMapper } from "../core/_internal/PropertyMapper";
import { getPropertyMap } from "./_internal/getPropertyMap";
import { computeProps } from "./_internal/computeProps";
import { DEFAULT_DISCUSSION, DEFAULT_DISCUSSION_MODEL } from "./defaults";
import type { IUserRequestOptions } from "@esri/arcgis-rest-request";
import { setDiscussableKeyword } from "./utils";
import { IHubRequestOptions, IModel } from "../hub-types";
import { cloneObject } from "../util";
import { arcgisToGeoJSON } from "@terraformer/arcgis";
import type { Polygon } from "geojson";
import { createOrUpdateEntitySettings } from "../core/_internal/createOrUpdateEntitySettings";
import { IHubDiscussion } from "../core/types/IHubDiscussion";
import { IHubItemEntity } from "../core/types/IHubItemEntity";
import { createModel } from "../models/createModel";
import { getModel } from "../models/getModel";
import { updateModel } from "../models/updateModel";

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

  // ensure orgUrlKey is set and downcased
  discussion.orgUrlKey = discussion.orgUrlKey.toLowerCase();

  // Create a slug from the title if one is not passed in
  if (!discussion.slug) {
    discussion.slug = constructSlug(discussion.name, discussion.orgUrlKey);
  }
  // Ensure slug is unique
  await ensureUniqueEntitySlug(discussion as IHubItemEntity, requestOptions);
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
  const newDiscussion = mapper.storeToEntity(model, {}) as IHubDiscussion;

  // create the entity settings
  const entitySettings = await createOrUpdateEntitySettings(
    newDiscussion,
    requestOptions
  );
  newDiscussion.entitySettingsId = entitySettings.id;
  newDiscussion.discussionSettings = entitySettings.settings.discussions;

  return newDiscussion;
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
  await ensureUniqueEntitySlug(discussion as IHubItemEntity, requestOptions);
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
  const updatedDiscussion = computeProps(
    model,
    mapper.storeToEntity(updatedModel, discussion),
    requestOptions
  );

  // persist location geometries to discussion settings as Polygon[]
  let allowedLocations: Polygon[];
  try {
    allowedLocations =
      updatedDiscussion.location.geometries?.map(
        (geometry) => arcgisToGeoJSON(geometry) as any as Polygon
      ) || null;
  } catch (e) {
    allowedLocations = null;
    /* tslint:disable no-console */
    console.warn("Esri JSON conversion failed", e);
  }

  // create or update entity settings
  const entitySettings = await createOrUpdateEntitySettings(
    updatedDiscussion,
    requestOptions,
    allowedLocations
  );

  updatedDiscussion.entitySettingsId = entitySettings.id;
  updatedDiscussion.discussionSettings = entitySettings.settings.discussions;

  return updatedDiscussion;
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
  try {
    await removeSettingV2({ id, ...requestOptions });
  } catch (e) {
    // suppress error
  }
  await removeItem(ro);
  return;
}
