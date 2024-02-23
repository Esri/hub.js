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
import { IHubSurvey } from "../core/types/IHubSurvey";
import { setDiscussableKeyword } from "../discussions/utils";
import { setDisplayMapKeyword } from "./utils/set-display-map-keyword";
import { updateModel } from "../models";
import { IModel } from "../types";
import { getFormJson } from "./utils/get-form-json";

/**
 * @private
 * Update a Hub Survey obejct
 * @param survey the Survey to update
 * @param requestOptions user request options
 * @returns promise that resolves a IHubSurvey
 */
export async function updateSurvey(
  survey: IHubSurvey,
  requestOptions: IUserRequestOptions
): Promise<IHubSurvey> {
  // update the status keyword
  survey.typeKeywords = setEntityStatusKeyword(
    survey.typeKeywords,
    survey.status
  );
  survey.typeKeywords = setDiscussableKeyword(
    survey.typeKeywords,
    survey.isDiscussable
  );
  survey.typeKeywords = setDisplayMapKeyword(
    survey.typeKeywords,
    survey.displayMap
  );
  // get the backing item
  const item = await getItem(survey.id, requestOptions);
  const model: IModel = { item };
  model.formJSON = await getFormJson(item, requestOptions);
  // create the PropertyMapper
  const mapper = new PropertyMapper<Partial<IHubSurvey>, IModel>(
    getPropertyMap()
  );
  // Note: Although we are fetching the model, and applying changes onto it,
  // we are not attempting to handle "concurrent edit" conflict resolution
  // but this is where we would apply that sort of logic
  const modelToUpdate = mapper.entityToStore(survey, model);
  // update the backing item
  const updatedModel = await updateModel(modelToUpdate, requestOptions);
  // now map back into a survey and return that
  let updatedSurvey = mapper.storeToEntity(updatedModel, survey);
  updatedSurvey = computeProps(model, updatedSurvey, requestOptions);
  // the casting is needed because modelToObject returns a `Partial<T>`
  // where as this function returns a `T`
  return updatedSurvey as IHubSurvey;
}

/**
 * @private
 * Remove a Hub Survey object
 * @param id
 * @param requestOptions
 */
export async function deleteSurvey(
  id: string,
  requestOptions: IUserRequestOptions
): Promise<void> {
  const ro = { ...requestOptions, ...{ id } } as IUserItemOptions;
  await removeItem(ro);
  return;
}
