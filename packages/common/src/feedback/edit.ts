import { IUserRequestOptions } from "@esri/arcgis-rest-auth";
import {
  IUserItemOptions,
  getItem,
  removeItem,
} from "@esri/arcgis-rest-portal";
import { PropertyMapper } from "../core/_internal/PropertyMapper";
import { setEntityStatusKeyword } from "../utils/internal/setEntityStatusKeyword";
import { computeProps } from "./_internal/computeProps";
import { getPropertyMap } from "./_internal/getPropertyMap";
import { IHubFeedback } from "../core/types/IHubFeedback";
import { setDiscussableKeyword } from "../discussions/utils";
import { setDisplayMapKeyword } from "./utils/set-display-map-keyword";
import { updateModel } from "../models";
import { IModel } from "../types";

/**
 * @private
 * Update a Hub Feedback obejct
 * @param feedback the feedback to update
 * @param requestOptions user request options
 * @returns promise that resolves a IHubFeedback
 */
export async function updateFeedback(
  feedback: IHubFeedback,
  requestOptions: IUserRequestOptions
): Promise<IHubFeedback> {
  // update the status keyword
  feedback.typeKeywords = setEntityStatusKeyword(
    feedback.typeKeywords,
    feedback.status
  );
  feedback.typeKeywords = setDiscussableKeyword(
    feedback.typeKeywords,
    feedback.isDiscussable
  );
  feedback.typeKeywords = setDisplayMapKeyword(
    feedback.typeKeywords,
    feedback.displayMap
  );
  // get the backing item
  const item = await getItem(feedback.id, requestOptions);
  const model = { item };
  // create the PropertyMapper
  const mapper = new PropertyMapper<Partial<IHubFeedback>, IModel>(
    getPropertyMap()
  );
  // Note: Although we are fetching the model, and applying changes onto it,
  // we are not attempting to handle "concurrent edit" conflict resolution
  // but this is where we would apply that sort of logic
  const modelToUpdate = mapper.entityToStore(feedback, model);
  // update the backing item
  const updatedModel = await updateModel(modelToUpdate, requestOptions);
  // now map back into a feedback and return that
  let updatedFeedback = mapper.storeToEntity(updatedModel, feedback);
  updatedFeedback = computeProps(model, updatedFeedback, requestOptions);
  // the casting is needed because modelToObject returns a `Partial<T>`
  // where as this function returns a `T`
  return updatedFeedback as IHubFeedback;
}

/**
 * @private
 * Remove a Hub Feedback object
 * @param id
 * @param requestOptions
 */
export async function deleteFeedback(
  id: string,
  requestOptions: IUserRequestOptions
): Promise<void> {
  const ro = { ...requestOptions, ...{ id } } as IUserItemOptions;
  await removeItem(ro);
  return;
}
