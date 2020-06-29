/* Copyright (c) 2018 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

import { IFormModel, IFeatureServiceModel, cloneObject } from "@esri/hub-common";
import { mockUserSession } from "@esri/hub-common/test/test-helpers/fake-user-session";
import { getSurveyModels } from "../../src/sharing/get-survey-models";
import { FormItemPublished } from "../mocks/form-item-published";
import { FeatureServiceItem } from "../mocks/feature-service-item";
import { FieldworkerItem } from "../mocks/fieldworker-item";
import { StakeholderItem } from "../mocks/stakeholder-item";
import * as isFieldworkerView from "../../src/utils/is-fieldworker-view";
import * as getInputFeatureServiceModel from "../../src/sharing/get-input-feature-service-model";
import * as getSourceFeatureServiceModelFromFieldworker from "../../src/sharing/get-source-feature-service-model-from-fieldworker";
import * as getStakeholderModel from "../../src/sharing/get-stakeholder-model";

describe("getSurveyModels", function () {
  let formModel: IFormModel;
  let featureServiceModel: IFeatureServiceModel;
  let fieldworkerModel: IFeatureServiceModel;
  let stakeholderModel: IFeatureServiceModel;

  beforeEach(() => {
    formModel = { item: FormItemPublished };
    featureServiceModel = { item: FeatureServiceItem };
    fieldworkerModel = { item: FieldworkerItem };
    stakeholderModel = { item: StakeholderItem };
  });

  it("fetches the feature service when a fieldworker is the primary input service", async function () {
    const isFieldworkerViewSpy = spyOn(isFieldworkerView, "isFieldworkerView").and.returnValue(true);
    const getInputFeatureServiceModelSpy = spyOn(getInputFeatureServiceModel, "getInputFeatureServiceModel").and.returnValue(Promise.resolve(fieldworkerModel));
    const getSourceFeatureServiceModelFromFieldworkerSpy = spyOn(getSourceFeatureServiceModelFromFieldworker, "getSourceFeatureServiceModelFromFieldworker").and.returnValue(Promise.resolve(featureServiceModel));
    const getStakeholderModelSpy = spyOn(getStakeholderModel, "getStakeholderModel").and.returnValue(Promise.resolve(stakeholderModel));
    const results = await getSurveyModels(formModel, mockUserSession);
    expect(getInputFeatureServiceModelSpy.calls.count()).toBe(1);
    expect(getInputFeatureServiceModelSpy.calls.argsFor(0)).toEqual([formModel.item.id, mockUserSession]);
    expect(getSourceFeatureServiceModelFromFieldworkerSpy.calls.count()).toBe(1);
    expect(getSourceFeatureServiceModelFromFieldworkerSpy.calls.argsFor(0)).toEqual([FieldworkerItem.id, mockUserSession]);
    expect(isFieldworkerViewSpy.calls.count()).toBe(1);
    expect(isFieldworkerViewSpy.calls.argsFor(0)).toEqual([fieldworkerModel.item]);
    expect(getStakeholderModelSpy.calls.count()).toBe(1);
    expect(getStakeholderModelSpy.calls.argsFor(0)).toEqual([FeatureServiceItem.id, mockUserSession]);
    expect(results.form).toEqual(formModel);
    expect(results.featureService).toEqual(featureServiceModel);
    expect(results.fieldworker).toEqual(fieldworkerModel);
    expect(results.stakeholder).toEqual(stakeholderModel);
  });

  it("fetches does not attempt to fetch the feature service when a fieldworker is absent", async function () {
    const isFieldworkerViewSpy = spyOn(isFieldworkerView, "isFieldworkerView").and.returnValue(false);
    const getInputFeatureServiceModelSpy = spyOn(getInputFeatureServiceModel, "getInputFeatureServiceModel").and.returnValue(Promise.resolve(featureServiceModel));
    const getSourceFeatureServiceModelFromFieldworkerSpy = spyOn(getSourceFeatureServiceModelFromFieldworker, "getSourceFeatureServiceModelFromFieldworker");
    const getStakeholderModelSpy = spyOn(getStakeholderModel, "getStakeholderModel").and.returnValue(Promise.resolve());
    const results = await getSurveyModels(formModel, mockUserSession);
    expect(getInputFeatureServiceModelSpy.calls.count()).toBe(1);
    expect(getInputFeatureServiceModelSpy.calls.argsFor(0)).toEqual([formModel.item.id, mockUserSession]);
    expect(getSourceFeatureServiceModelFromFieldworkerSpy.calls.count()).toBe(0);
    expect(isFieldworkerViewSpy.calls.count()).toBe(1);
    expect(isFieldworkerViewSpy.calls.argsFor(0)).toEqual([featureServiceModel.item]);
    expect(getStakeholderModelSpy.calls.count()).toBe(1);
    expect(getStakeholderModelSpy.calls.argsFor(0)).toEqual([FeatureServiceItem.id, mockUserSession]);
    expect(results.form).toEqual(formModel);
    expect(results.featureService).toEqual(featureServiceModel);
    expect(results.fieldworker).toBeUndefined();
    expect(results.stakeholder).toBeUndefined();
  });
});
