vi.mock("@esri/arcgis-rest-portal", async (importOriginal) => ({
  ...(await importOriginal()),
  getRelatedItems: vi.fn(),
  getItem: vi.fn(),
}));

import { vi } from "vitest";
import * as restPortal from "@esri/arcgis-rest-portal";
import * as FieldworkerItem from "../../mocks/items/fieldworker-item.json";
import * as FeatureServiceItem from "../../mocks/items/feature-service-item.json";
import * as StakeholderItem from "../../mocks/items/stakeholder-item.json";
import * as FormItemPublished from "../../mocks/items/form-item-published.json";
import * as isFieldworkerViewUtil from "../../../src/surveys/utils/is-fieldworker-view";
import * as getInputFeatureServiceModelUtil from "../../../src/surveys/utils/get-input-feature-service-model";
import * as getSourceFeatureServiceModelFromFieldworkerUtil from "../../../src/surveys/utils/get-source-feature-service-model-from-fieldworker";
import * as getStakeholderModelUtil from "../../../src/surveys/utils/get-stakeholder-model";
import { mockUserSession } from "../../test-helpers/fake-user-session";
import type { IRequestOptions } from "@esri/arcgis-rest-request";
import { getSurveyModels } from "../../../src/surveys/utils/get-survey-models";
import { IModel } from "../../../src/hub-types";

describe("getSurveyModels", () => {
  let formModel: IModel;
  let featureServiceModel: IModel;
  let fieldworkerModel: IModel;
  let stakeholderModel: IModel;
  let requestOptions: IRequestOptions;

  beforeEach(() => {
    formModel = { item: FormItemPublished };
    featureServiceModel = { item: FeatureServiceItem };
    fieldworkerModel = { item: FieldworkerItem };
    stakeholderModel = { item: StakeholderItem };
    requestOptions = { authentication: mockUserSession };
  });

  it("fetches the feature service when a fieldworker is the primary input service", async function () {
    const getItemStub = vi
      .spyOn(restPortal, "getItem")
      .mockReturnValue(Promise.resolve(FormItemPublished));
    const isFieldworkerViewSpy = vi
      .spyOn(isFieldworkerViewUtil, "isFieldworkerView")
      .mockReturnValue(true);
    const getInputFeatureServiceModelSpy = vi
      .spyOn(getInputFeatureServiceModelUtil, "getInputFeatureServiceModel")
      .mockReturnValue(Promise.resolve(fieldworkerModel));
    const getSourceFeatureServiceModelFromFieldworkerSpy = vi
      .spyOn(
        getSourceFeatureServiceModelFromFieldworkerUtil,
        "getSourceFeatureServiceModelFromFieldworker"
      )
      .mockReturnValue(Promise.resolve(featureServiceModel));
    const getStakeholderModelSpy = vi
      .spyOn(getStakeholderModelUtil, "getStakeholderModel")
      .mockReturnValue(Promise.resolve(stakeholderModel));
    const results = await getSurveyModels(formModel.item.id, requestOptions);
    expect(getItemStub).toHaveBeenCalledTimes(1);
    expect(getItemStub.mock.calls[0]).toEqual([
      FormItemPublished.id,
      requestOptions,
    ]);
    expect(getInputFeatureServiceModelSpy).toHaveBeenCalledTimes(1);
    expect(getInputFeatureServiceModelSpy.mock.calls[0]).toEqual([
      formModel.item.id,
      requestOptions,
    ]);
    expect(
      getSourceFeatureServiceModelFromFieldworkerSpy
    ).toHaveBeenCalledTimes(1);
    expect(
      getSourceFeatureServiceModelFromFieldworkerSpy.mock.calls[0]
    ).toEqual([FieldworkerItem.id, requestOptions]);
    expect(isFieldworkerViewSpy).toHaveBeenCalledTimes(1);
    expect(isFieldworkerViewSpy.mock.calls[0]).toEqual([fieldworkerModel.item]);
    expect(getStakeholderModelSpy).toHaveBeenCalledTimes(1);
    expect(getStakeholderModelSpy.mock.calls[0]).toEqual([
      FormItemPublished.id,
      requestOptions,
    ]);
    expect(results.form).toEqual(formModel);
    expect(results.featureService).toEqual(featureServiceModel);
    expect(results.fieldworker).toEqual(fieldworkerModel);
    expect(results.stakeholder).toEqual(stakeholderModel);
  });

  it("does not attempt to fetch the feature service when the feature service is resolved from getInputFeatureServiceModel", async function () {
    const getItemStub = vi
      .spyOn(restPortal, "getItem")
      .mockReturnValue(Promise.resolve(FormItemPublished));
    const isFieldworkerViewSpy = vi
      .spyOn(isFieldworkerViewUtil, "isFieldworkerView")
      .mockReturnValue(false);
    const getInputFeatureServiceModelSpy = vi
      .spyOn(getInputFeatureServiceModelUtil, "getInputFeatureServiceModel")
      .mockReturnValue(Promise.resolve(featureServiceModel));
    const getSourceFeatureServiceModelFromFieldworkerSpy = vi.spyOn(
      getSourceFeatureServiceModelFromFieldworkerUtil,
      "getSourceFeatureServiceModelFromFieldworker"
    );
    const getStakeholderModelSpy = vi
      .spyOn(getStakeholderModelUtil, "getStakeholderModel")
      .mockReturnValue(Promise.resolve(undefined as unknown as IModel));
    const results = await getSurveyModels(formModel.item.id, requestOptions);
    expect(getItemStub).toHaveBeenCalledTimes(1);
    expect(getItemStub.mock.calls[0]).toEqual([
      FormItemPublished.id,
      requestOptions,
    ]);
    expect(getInputFeatureServiceModelSpy).toHaveBeenCalledTimes(1);
    expect(getInputFeatureServiceModelSpy.mock.calls[0]).toEqual([
      formModel.item.id,
      requestOptions,
    ]);
    expect(
      getSourceFeatureServiceModelFromFieldworkerSpy
    ).toHaveBeenCalledTimes(0);
    expect(isFieldworkerViewSpy).toHaveBeenCalledTimes(1);
    expect(isFieldworkerViewSpy.mock.calls[0]).toEqual([
      featureServiceModel.item,
    ]);
    expect(getStakeholderModelSpy).toHaveBeenCalledTimes(1);
    expect(getStakeholderModelSpy.mock.calls[0]).toEqual([
      FormItemPublished.id,
      requestOptions,
    ]);
    expect(results.form).toEqual(formModel);
    expect(results.featureService).toEqual(featureServiceModel);
    expect(results.fieldworker).toBeUndefined();
    expect(results.stakeholder).toBeUndefined();
  });

  it("does not attempt to fetch the feature service when nothing is resolved from getInputFeatureServiceModel", async function () {
    const getItemStub = vi
      .spyOn(restPortal, "getItem")
      .mockReturnValue(Promise.resolve(FormItemPublished));
    const isFieldworkerViewSpy = vi
      .spyOn(isFieldworkerViewUtil, "isFieldworkerView")
      .mockReturnValue(false);
    const getInputFeatureServiceModelSpy = vi
      .spyOn(getInputFeatureServiceModelUtil, "getInputFeatureServiceModel")
      .mockReturnValue(Promise.resolve());
    const getSourceFeatureServiceModelFromFieldworkerSpy = vi.spyOn(
      getSourceFeatureServiceModelFromFieldworkerUtil,
      "getSourceFeatureServiceModelFromFieldworker"
    );
    const getStakeholderModelSpy = vi
      .spyOn(getStakeholderModelUtil, "getStakeholderModel")
      .mockReturnValue(Promise.resolve(undefined as unknown as IModel));
    const results = await getSurveyModels(formModel.item.id, requestOptions);
    expect(getItemStub).toHaveBeenCalledTimes(1);
    expect(getItemStub.mock.calls[0]).toEqual([
      FormItemPublished.id,
      requestOptions,
    ]);
    expect(getInputFeatureServiceModelSpy).toHaveBeenCalledTimes(1);
    expect(getInputFeatureServiceModelSpy.mock.calls[0]).toEqual([
      formModel.item.id,
      requestOptions,
    ]);
    expect(
      getSourceFeatureServiceModelFromFieldworkerSpy
    ).toHaveBeenCalledTimes(0);
    expect(isFieldworkerViewSpy).toHaveBeenCalledTimes(0);
    expect(getStakeholderModelSpy).toHaveBeenCalledTimes(1);
    expect(getStakeholderModelSpy.mock.calls[0]).toEqual([
      FormItemPublished.id,
      requestOptions,
    ]);
    expect(results.form).toEqual(formModel);
    expect(results.featureService).toBeUndefined();
    expect(results.fieldworker).toBeUndefined();
    expect(results.stakeholder).toBeUndefined();
  });

  it("only fetches Form when formItemOrId is a string", async function () {
    const getItemStub = vi.spyOn(restPortal, "getItem");
    const isFieldworkerViewSpy = vi
      .spyOn(isFieldworkerViewUtil, "isFieldworkerView")
      .mockReturnValue(true);
    const getInputFeatureServiceModelSpy = vi
      .spyOn(getInputFeatureServiceModelUtil, "getInputFeatureServiceModel")
      .mockReturnValue(Promise.resolve(fieldworkerModel));
    const getSourceFeatureServiceModelFromFieldworkerSpy = vi
      .spyOn(
        getSourceFeatureServiceModelFromFieldworkerUtil,
        "getSourceFeatureServiceModelFromFieldworker"
      )
      .mockReturnValue(Promise.resolve(featureServiceModel));
    const getStakeholderModelSpy = vi
      .spyOn(getStakeholderModelUtil, "getStakeholderModel")
      .mockReturnValue(Promise.resolve(stakeholderModel));
    const results = await getSurveyModels(formModel.item, requestOptions);
    expect(getItemStub).toHaveBeenCalledTimes(0);
    expect(getInputFeatureServiceModelSpy).toHaveBeenCalledTimes(1);
    expect(getInputFeatureServiceModelSpy.mock.calls[0]).toEqual([
      formModel.item.id,
      requestOptions,
    ]);
    expect(
      getSourceFeatureServiceModelFromFieldworkerSpy
    ).toHaveBeenCalledTimes(1);
    expect(
      getSourceFeatureServiceModelFromFieldworkerSpy.mock.calls[0]
    ).toEqual([FieldworkerItem.id, requestOptions]);
    expect(isFieldworkerViewSpy).toHaveBeenCalledTimes(1);
    expect(isFieldworkerViewSpy.mock.calls[0]).toEqual([fieldworkerModel.item]);
    expect(getStakeholderModelSpy).toHaveBeenCalledTimes(1);
    expect(getStakeholderModelSpy.mock.calls[0]).toEqual([
      FormItemPublished.id,
      requestOptions,
    ]);
    expect(results.form).toEqual(formModel);
    expect(results.featureService).toEqual(featureServiceModel);
    expect(results.fieldworker).toEqual(fieldworkerModel);
    expect(results.stakeholder).toEqual(stakeholderModel);
  });
});
