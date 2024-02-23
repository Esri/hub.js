/* Copyright (c) 2018 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

import { IModel } from "../../src/types";
import * as restPortal from "@esri/arcgis-rest-portal";
import { mockUserSession } from "../test-helpers/fake-user-session";
import { getSurveyModels } from "../../src/surveys/utils/get-survey-models";
import * as FormItemPublished from "../mocks/items/form-item-published.json";
import * as FeatureServiceItem from "../mocks/items/feature-service-item.json";
import * as FieldworkerItem from "../mocks/items/fieldworker-item.json";
import * as StakeholderItem from "../mocks/items/stakeholder-item.json";
import * as isFieldworkerView from "../../src/surveys/utils/is-fieldworker-view";
import * as getInputFeatureServiceModel from "../../src/surveys/utils/get-input-feature-service-model";
import * as getSourceFeatureServiceModelFromFieldworker from "../../src/surveys/utils/get-source-feature-service-model-from-fieldworker";
import * as getStakeholderModel from "../../src/surveys/utils/get-stakeholder-model";
import { IRequestOptions } from "@esri/arcgis-rest-request";

describe("getSurveyModels", function () {
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
    const getItemStub = spyOn(restPortal, "getItem").and.returnValue(
      Promise.resolve(FormItemPublished)
    );
    const isFieldworkerViewSpy = spyOn(
      isFieldworkerView,
      "isFieldworkerView"
    ).and.returnValue(true);
    const getInputFeatureServiceModelSpy = spyOn(
      getInputFeatureServiceModel,
      "getInputFeatureServiceModel"
    ).and.returnValue(Promise.resolve(fieldworkerModel));
    const getSourceFeatureServiceModelFromFieldworkerSpy = spyOn(
      getSourceFeatureServiceModelFromFieldworker,
      "getSourceFeatureServiceModelFromFieldworker"
    ).and.returnValue(Promise.resolve(featureServiceModel));
    const getStakeholderModelSpy = spyOn(
      getStakeholderModel,
      "getStakeholderModel"
    ).and.returnValue(Promise.resolve(stakeholderModel));
    const results = await getSurveyModels(formModel.item.id, requestOptions);
    expect(getItemStub.calls.count()).toBe(1);
    expect(getItemStub.calls.argsFor(0)).toEqual([
      FormItemPublished.id,
      requestOptions,
    ]);
    expect(getInputFeatureServiceModelSpy.calls.count()).toBe(1);
    expect(getInputFeatureServiceModelSpy.calls.argsFor(0)).toEqual([
      formModel.item.id,
      requestOptions,
    ]);
    expect(getSourceFeatureServiceModelFromFieldworkerSpy.calls.count()).toBe(
      1
    );
    expect(
      getSourceFeatureServiceModelFromFieldworkerSpy.calls.argsFor(0)
    ).toEqual([FieldworkerItem.id, requestOptions]);
    expect(isFieldworkerViewSpy.calls.count()).toBe(1);
    expect(isFieldworkerViewSpy.calls.argsFor(0)).toEqual([
      fieldworkerModel.item,
    ]);
    expect(getStakeholderModelSpy.calls.count()).toBe(1);
    expect(getStakeholderModelSpy.calls.argsFor(0)).toEqual([
      FormItemPublished.id,
      requestOptions,
    ]);
    expect(results.form).toEqual(formModel);
    expect(results.featureService).toEqual(featureServiceModel);
    expect(results.fieldworker).toEqual(fieldworkerModel);
    expect(results.stakeholder).toEqual(stakeholderModel);
  });

  it("does not attempt to fetch the feature service when the feature service is resolved from getInputFeatureServiceModel", async function () {
    const getItemStub = spyOn(restPortal, "getItem").and.returnValue(
      Promise.resolve(FormItemPublished)
    );
    const isFieldworkerViewSpy = spyOn(
      isFieldworkerView,
      "isFieldworkerView"
    ).and.returnValue(false);
    const getInputFeatureServiceModelSpy = spyOn(
      getInputFeatureServiceModel,
      "getInputFeatureServiceModel"
    ).and.returnValue(Promise.resolve(featureServiceModel));
    const getSourceFeatureServiceModelFromFieldworkerSpy = spyOn(
      getSourceFeatureServiceModelFromFieldworker,
      "getSourceFeatureServiceModelFromFieldworker"
    );
    const getStakeholderModelSpy = spyOn(
      getStakeholderModel,
      "getStakeholderModel"
    ).and.returnValue(Promise.resolve());
    const results = await getSurveyModels(formModel.item.id, requestOptions);
    expect(getItemStub.calls.count()).toBe(1);
    expect(getItemStub.calls.argsFor(0)).toEqual([
      FormItemPublished.id,
      requestOptions,
    ]);
    expect(getInputFeatureServiceModelSpy.calls.count()).toBe(1);
    expect(getInputFeatureServiceModelSpy.calls.argsFor(0)).toEqual([
      formModel.item.id,
      requestOptions,
    ]);
    expect(getSourceFeatureServiceModelFromFieldworkerSpy.calls.count()).toBe(
      0
    );
    expect(isFieldworkerViewSpy.calls.count()).toBe(1);
    expect(isFieldworkerViewSpy.calls.argsFor(0)).toEqual([
      featureServiceModel.item,
    ]);
    expect(getStakeholderModelSpy.calls.count()).toBe(1);
    expect(getStakeholderModelSpy.calls.argsFor(0)).toEqual([
      FormItemPublished.id,
      requestOptions,
    ]);
    expect(results.form).toEqual(formModel);
    expect(results.featureService).toEqual(featureServiceModel);
    expect(results.fieldworker).toBeUndefined();
    expect(results.stakeholder).toBeUndefined();
  });

  it("does not attempt to fetch the feature service when nothing is resolved from getInputFeatureServiceModel", async function () {
    const getItemStub = spyOn(restPortal, "getItem").and.returnValue(
      Promise.resolve(FormItemPublished)
    );
    const isFieldworkerViewSpy = spyOn(
      isFieldworkerView,
      "isFieldworkerView"
    ).and.returnValue(false);
    const getInputFeatureServiceModelSpy = spyOn(
      getInputFeatureServiceModel,
      "getInputFeatureServiceModel"
    ).and.returnValue(Promise.resolve());
    const getSourceFeatureServiceModelFromFieldworkerSpy = spyOn(
      getSourceFeatureServiceModelFromFieldworker,
      "getSourceFeatureServiceModelFromFieldworker"
    );
    const getStakeholderModelSpy = spyOn(
      getStakeholderModel,
      "getStakeholderModel"
    ).and.returnValue(Promise.resolve());
    const results = await getSurveyModels(formModel.item.id, requestOptions);
    expect(getItemStub.calls.count()).toBe(1);
    expect(getItemStub.calls.argsFor(0)).toEqual([
      FormItemPublished.id,
      requestOptions,
    ]);
    expect(getInputFeatureServiceModelSpy.calls.count()).toBe(1);
    expect(getInputFeatureServiceModelSpy.calls.argsFor(0)).toEqual([
      formModel.item.id,
      requestOptions,
    ]);
    expect(getSourceFeatureServiceModelFromFieldworkerSpy.calls.count()).toBe(
      0
    );
    expect(isFieldworkerViewSpy.calls.count()).toBe(0);
    expect(getStakeholderModelSpy.calls.count()).toBe(1);
    expect(getStakeholderModelSpy.calls.argsFor(0)).toEqual([
      FormItemPublished.id,
      requestOptions,
    ]);
    expect(results.form).toEqual(formModel);
    expect(results.featureService).toBeUndefined();
    expect(results.fieldworker).toBeUndefined();
    expect(results.stakeholder).toBeUndefined();
  });

  it("only fetches Form when formItemOrId is a string", async function () {
    const getItemStub = spyOn(restPortal, "getItem");
    const isFieldworkerViewSpy = spyOn(
      isFieldworkerView,
      "isFieldworkerView"
    ).and.returnValue(true);
    const getInputFeatureServiceModelSpy = spyOn(
      getInputFeatureServiceModel,
      "getInputFeatureServiceModel"
    ).and.returnValue(Promise.resolve(fieldworkerModel));
    const getSourceFeatureServiceModelFromFieldworkerSpy = spyOn(
      getSourceFeatureServiceModelFromFieldworker,
      "getSourceFeatureServiceModelFromFieldworker"
    ).and.returnValue(Promise.resolve(featureServiceModel));
    const getStakeholderModelSpy = spyOn(
      getStakeholderModel,
      "getStakeholderModel"
    ).and.returnValue(Promise.resolve(stakeholderModel));
    const results = await getSurveyModels(formModel.item, requestOptions);
    expect(getItemStub.calls.count()).toBe(0);
    expect(getInputFeatureServiceModelSpy.calls.count()).toBe(1);
    expect(getInputFeatureServiceModelSpy.calls.argsFor(0)).toEqual([
      formModel.item.id,
      requestOptions,
    ]);
    expect(getSourceFeatureServiceModelFromFieldworkerSpy.calls.count()).toBe(
      1
    );
    expect(
      getSourceFeatureServiceModelFromFieldworkerSpy.calls.argsFor(0)
    ).toEqual([FieldworkerItem.id, requestOptions]);
    expect(isFieldworkerViewSpy.calls.count()).toBe(1);
    expect(isFieldworkerViewSpy.calls.argsFor(0)).toEqual([
      fieldworkerModel.item,
    ]);
    expect(getStakeholderModelSpy.calls.count()).toBe(1);
    expect(getStakeholderModelSpy.calls.argsFor(0)).toEqual([
      FormItemPublished.id,
      requestOptions,
    ]);
    expect(results.form).toEqual(formModel);
    expect(results.featureService).toEqual(featureServiceModel);
    expect(results.fieldworker).toEqual(fieldworkerModel);
    expect(results.stakeholder).toEqual(stakeholderModel);
  });
});
