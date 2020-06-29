/* Copyright (c) 2018 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

import { IRequestOptions } from "@esri/arcgis-rest-request";
import * as hubCommon from "@esri/hub-common";
import { mockUserSession as authentication } from "@esri/hub-common/test/test-helpers/fake-user-session";
import { FormItemPublished } from "../mocks/form-item-published";
import { FeatureServiceItem } from "../mocks/feature-service-item";
import { FieldworkerItem } from "../mocks/fieldworker-item";
import { StakeholderItem } from "../mocks/stakeholder-item";
import { setAccess } from "../../src/sharing/set-access";
import * as setAccessRevertable from "../../src/sharing/set-access-revertable";
import * as getSurveyModels from "../../src/sharing/get-survey-models";
import * as isPublished from "../../src/utils/is-published";

describe("setAccess", function () {
  let formModel: hubCommon.IFormModel;
  let featureServiceModel: hubCommon.IFeatureServiceModel;
  let fieldworkerModel: hubCommon.IFeatureServiceModel;
  let stakeholderModel: hubCommon.IFeatureServiceModel;
  let requestOptions: IRequestOptions;
  let getSurveyModelsResults: hubCommon.IGetSurveyModelsResponse;
  let setAccessRevertableResults: hubCommon.IRevertableTaskResult[];
  let setAccessRevertablePromiseResults: Promise<hubCommon.IRevertableTaskResult>[];
  let processRevertableTasksResults: any[];

  beforeEach(() => {
    formModel = { item: FormItemPublished };
    featureServiceModel = { item: FeatureServiceItem };
    fieldworkerModel = { item: FieldworkerItem };
    stakeholderModel = { item: StakeholderItem };
    requestOptions = { authentication };
    getSurveyModelsResults = {
      form: formModel,
      featureService: featureServiceModel,
      fieldworker: fieldworkerModel,
      stakeholder: stakeholderModel
    };
    setAccessRevertableResults = [
      {
        status: "fullfilled",
        revert: () => Promise.resolve("form"),
        results: { notSharedWith: [], itemId: formModel.item.id }
      },
      {
        status: "fullfilled",
        revert: () => Promise.resolve("featureService"),
        results: { notSharedWith: [], itemId: featureServiceModel.item.id }
      },
      {
        status: "fullfilled",
        revert: () => Promise.resolve("fieldworker"),
        results: { notSharedWith: [], itemId: fieldworkerModel.item.id }
      }
    ];
    setAccessRevertablePromiseResults = setAccessRevertableResults.map(
      (result: hubCommon.IRevertableTaskResult) => Promise.resolve(result)
    );
    processRevertableTasksResults = (setAccessRevertableResults as hubCommon.IRevertableTaskSuccess[]).map(
      ({ results }) => results
    );
  });

  it("should resolve the results from processRevertableTasks for a published survey", async function () {
    const getSurveyModelsSpy = spyOn(getSurveyModels, "getSurveyModels").and.returnValue(Promise.resolve(getSurveyModelsResults));
    const isPublishedSpy = spyOn(isPublished, "isPublished").and.returnValue(true);
    const setAccessRevertableSpy = spyOn(setAccessRevertable, "setAccessRevertable").and.returnValues(...setAccessRevertablePromiseResults);
    const processRevertableTasksSpy = spyOn(hubCommon, "processRevertableTasks").and.returnValue(Promise.resolve(processRevertableTasksResults));
    const results = await setAccess(
      formModel,
      "public",
      requestOptions
    );
    expect(getSurveyModelsSpy.calls.count()).toBe(1);
    expect(getSurveyModelsSpy.calls.argsFor(0)).toEqual([formModel, requestOptions]);
    expect(isPublishedSpy.calls.count()).toBe(1);
    expect(isPublishedSpy.calls.argsFor(0)).toEqual([formModel.item]);
    expect(setAccessRevertableSpy.calls.count()).toBe(3);
    expect(setAccessRevertableSpy.calls.argsFor(0)).toEqual([formModel, "public", requestOptions]);
    expect(setAccessRevertableSpy.calls.argsFor(1)).toEqual([featureServiceModel, "public", requestOptions]);
    expect(setAccessRevertableSpy.calls.argsFor(2)).toEqual([fieldworkerModel, "public", requestOptions]);
    expect(processRevertableTasksSpy.calls.count()).toBe(1);
    expect(processRevertableTasksSpy.calls.argsFor(0)).toEqual([setAccessRevertablePromiseResults]);
    expect(results).toEqual(processRevertableTasksResults);
  });

  it("should resolve the results from processRevertableTasks for a draft survey", async function () {
    setAccessRevertableResults.pop();
    setAccessRevertablePromiseResults.pop();
    processRevertableTasksResults.pop();
    const getSurveyModelsSpy = spyOn(getSurveyModels, "getSurveyModels").and.returnValue(Promise.resolve(getSurveyModelsResults));
    const isPublishedSpy = spyOn(isPublished, "isPublished").and.returnValue(false);
    const setAccessRevertableSpy = spyOn(setAccessRevertable, "setAccessRevertable").and.returnValues(...setAccessRevertablePromiseResults);
    const processRevertableTasksSpy = spyOn(hubCommon, "processRevertableTasks").and.returnValue(Promise.resolve(processRevertableTasksResults));
    const results = await setAccess(
      formModel,
      "public",
      requestOptions
    );
    expect(getSurveyModelsSpy.calls.count()).toBe(1);
    expect(getSurveyModelsSpy.calls.argsFor(0)).toEqual([formModel, requestOptions]);
    expect(isPublishedSpy.calls.count()).toBe(1);
    expect(isPublishedSpy.calls.argsFor(0)).toEqual([formModel.item]);
    expect(setAccessRevertableSpy.calls.count()).toBe(2);
    expect(setAccessRevertableSpy.calls.argsFor(0)).toEqual([formModel, "public", requestOptions]);
    expect(setAccessRevertableSpy.calls.argsFor(1)).toEqual([featureServiceModel, "public", requestOptions]);
    expect(processRevertableTasksSpy.calls.count()).toBe(1);
    expect(processRevertableTasksSpy.calls.argsFor(0)).toEqual([setAccessRevertablePromiseResults]);
    expect(results).toEqual(processRevertableTasksResults);
  });

  it("should filter out falsey models", async function () {
    getSurveyModelsResults = {
      form: formModel,
      featureService: featureServiceModel,
      fieldworker: undefined,
      stakeholder: undefined
    };
    setAccessRevertableResults.pop();
    setAccessRevertablePromiseResults.pop();
    const getSurveyModelsSpy = spyOn(getSurveyModels, "getSurveyModels").and.returnValue(Promise.resolve(getSurveyModelsResults));
    const isPublishedSpy = spyOn(isPublished, "isPublished").and.returnValue(true);
    const setAccessRevertableSpy = spyOn(setAccessRevertable, "setAccessRevertable").and.returnValues(...setAccessRevertablePromiseResults);
    const processRevertableTasksSpy = spyOn(hubCommon, "processRevertableTasks").and.returnValue(Promise.resolve(processRevertableTasksResults));
    const results = await setAccess(
      formModel,
      "public",
      requestOptions
    );
    expect(getSurveyModelsSpy.calls.count()).toBe(1);
    expect(getSurveyModelsSpy.calls.argsFor(0)).toEqual([formModel, requestOptions]);
    expect(isPublishedSpy.calls.count()).toBe(1);
    expect(isPublishedSpy.calls.argsFor(0)).toEqual([formModel.item]);
    expect(setAccessRevertableSpy.calls.count()).toBe(2);
    expect(setAccessRevertableSpy.calls.argsFor(0)).toEqual([formModel, "public", requestOptions]);
    expect(setAccessRevertableSpy.calls.argsFor(1)).toEqual([featureServiceModel, "public", requestOptions]);
    expect(processRevertableTasksSpy.calls.count()).toBe(1);
    expect(processRevertableTasksSpy.calls.argsFor(0)).toEqual([setAccessRevertablePromiseResults]);
    expect(results).toEqual(processRevertableTasksResults);
  });

  it("should reject if processRevertableTasks rejects", async function (done) {
    const getSurveyModelsSpy = spyOn(getSurveyModels, "getSurveyModels").and.returnValue(Promise.resolve(getSurveyModelsResults));
    const isPublishedSpy = spyOn(isPublished, "isPublished").and.returnValue(true);
    const setAccessRevertableSpy = spyOn(setAccessRevertable, "setAccessRevertable").and.returnValues(...setAccessRevertablePromiseResults);
    const processRevertableTasksSpy = spyOn(hubCommon, "processRevertableTasks").and.returnValue(Promise.reject(new Error("fail")));
    try {
      await setAccess(
        formModel,
        "public",
        requestOptions
      );
      done.fail("Should have rejected");
    } catch (e) {
      expect(getSurveyModelsSpy.calls.count()).toBe(1);
      expect(getSurveyModelsSpy.calls.argsFor(0)).toEqual([formModel, requestOptions]);
      expect(isPublishedSpy.calls.count()).toBe(1);
      expect(isPublishedSpy.calls.argsFor(0)).toEqual([formModel.item]);
      expect(setAccessRevertableSpy.calls.count()).toBe(3);
      expect(setAccessRevertableSpy.calls.argsFor(0)).toEqual([formModel, "public", requestOptions]);
      expect(setAccessRevertableSpy.calls.argsFor(1)).toEqual([featureServiceModel, "public", requestOptions]);
      expect(setAccessRevertableSpy.calls.argsFor(2)).toEqual([fieldworkerModel, "public", requestOptions]);
      expect(processRevertableTasksSpy.calls.count()).toBe(1);
      expect(processRevertableTasksSpy.calls.argsFor(0)).toEqual([setAccessRevertablePromiseResults]);
      expect(e).toEqual(new Error(`Failed to set survey ${formModel.item.id} items access to public`));
      done();
    }
  });
});
