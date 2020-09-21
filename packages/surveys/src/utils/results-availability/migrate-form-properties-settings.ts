import {
  getProp,
  cloneObject,
  IGetSurveyModelsResponse
} from "@esri/hub-common";

/**
 * Populate form item properties is missing
 * @param {IGetSurveyModelsResponse} _models
 * @returns {IGetSurveyModelsResponse}
 */
export const migrateFormPropertiesSettings = (
  _models: IGetSurveyModelsResponse
): IGetSurveyModelsResponse => {
  const models = cloneObject(_models);
  if (!getProp(models.form, "item.properties")) {
    models.form.item.properties = {};
  }
  if (!getProp(models.form, "item.properties.settings")) {
    models.form.item.properties.settings = { resultsAvailability: "always" };
  }
  return models;
};
