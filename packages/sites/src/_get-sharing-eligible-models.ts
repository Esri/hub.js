import { IModel, IHubRequestOptions, getSurveyModels } from "@esri/hub-common";

function _getIneligibleModelIds(
  siteModel: IModel,
  models: IModel[],
  hubRequestOptions: IHubRequestOptions
) {
  const fetchSurveyModels = (model: IModel) =>
    getSurveyModels(model.item, hubRequestOptions).then(
      ({ form, featureService, fieldworker, stakeholder }) =>
        [form, featureService, fieldworker, stakeholder].filter(Boolean)
    );

  const inEligibleModelCollectionPromises = models.reduce(
    (acc, model) =>
      model.item.type === "Form" ? [...acc, fetchSurveyModels(model)] : acc,
    [Promise.resolve([siteModel])]
  );

  return Promise.all(inEligibleModelCollectionPromises).then(
    (ineligibleModelCollections) =>
      ineligibleModelCollections.reduce(
        (acc, ineligibleModelCollection) => [
          ...acc,
          ...ineligibleModelCollection,
        ],
        []
      )
  );
}

export function _getSharingEligibleModels(
  siteModel: IModel,
  models: IModel[],
  hubRequestOptions: IHubRequestOptions
) {
  return _getIneligibleModelIds(siteModel, models, hubRequestOptions).then(
    (ineligibleModels) =>
      models.reduce(
        (acc, model) =>
          ineligibleModels.find(({ item: { id } }) => model.item.id === id)
            ? acc
            : [...acc, model],
        []
      )
  );
}
