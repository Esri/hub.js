import {
  getProp,
  cloneObject,
  IGetSurveyModelsResponse
} from "@esri/hub-common";

/**
 * Method used when fetching Feedback/Survey models in Hub;
 * properties.settings.resultsAvailability is used in Hub to determine when it
 * should render links to survey results
 *
 * Adds form item.properties hash if it is missing
 * Adds item.properties.settings hash if it is missing
 * Adds item.properties.settings.resultsAvailability property if missing
 * @param {IGetSurveyModelsResponse} models
 * @returns {IGetSurveyModelsResponse}
 */
export function migrateFormPropertiesSettings (
  models: IGetSurveyModelsResponse
): IGetSurveyModelsResponse {
  const _models = cloneObject(models);
  if (!getProp(_models.form, "item.properties")) {
    _models.form.item.properties = {};
  }
  if (!getProp(_models.form, "item.properties.settings")) {
    _models.form.item.properties.settings = {};
  }
  if (!getProp(_models.form, "item.properties.settings.resultsAvailability")) {
    _models.form.item.properties.settings.resultsAvailability = "always";
  }
  return _models;
};
