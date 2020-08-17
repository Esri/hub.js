/* Copyright (c) 2018 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

import { IGetSurveyModelsResponse, IModel } from "@esri/hub-common";
import { getGroupSharingDetails } from "../../src/sharing/get-group-sharing-details";
import { FormItemDraft } from "../mocks/form-item-draft";
import { FormItemPublished } from "../mocks/form-item-published";
import { FeatureServiceItem } from "../mocks/feature-service-item";
import { FieldworkerItem } from "../mocks/fieldworker-item";
import { StakeholderItem } from "../mocks/stakeholder-item";
import { UpdateGroup } from "../mocks/update-group";
import { ViewGroup } from "../mocks/view-group";
import * as restPortal from "@esri/arcgis-rest-portal";
import { mockUserSession } from "@esri/hub-common/test/test-helpers/fake-user-session";
import * as getSurveyModels from "../../src/items/get-survey-models";
import * as isPublished from "../../src/utils/is-published";
import { IRequestOptions } from "@esri/hub-common/node_modules/@esri/arcgis-rest-request";

describe("getGroupSharingDetails", function() {
  let getSurveyModelsResult: IGetSurveyModelsResponse;
  let formModel: IModel;
  let featureServiceModel: IModel;
  let fieldworkerModel: IModel;
  let stakeholderModel: IModel;
  let requestOptions: IRequestOptions;

  beforeEach(() => {
    formModel = { item: FormItemDraft };
    featureServiceModel = { item: FeatureServiceItem };
    fieldworkerModel = { item: FieldworkerItem };
    stakeholderModel = { item: StakeholderItem };
    getSurveyModelsResult = {
      form: formModel,
      featureService: featureServiceModel,
      fieldworker: fieldworkerModel,
      stakeholder: stakeholderModel
    };
    requestOptions = { authentication: mockUserSession };
  });

  it("should resolve with the form & feature service models when a draft and an update group", async function() {
    const getGroupSpy = spyOn(restPortal, "getGroup").and.returnValue(
      Promise.resolve(UpdateGroup)
    );
    const getSurveyModelsSpy = spyOn(
      getSurveyModels,
      "getSurveyModels"
    ).and.returnValue(Promise.resolve(getSurveyModelsResult));
    const isPublishedSpy = spyOn(isPublished, "isPublished").and.returnValue(
      false
    );
    const result = await getGroupSharingDetails(
      formModel.item.id,
      "123",
      requestOptions
    );
    expect(getGroupSpy.calls.count()).toBe(1);
    expect(getGroupSpy.calls.argsFor(0)).toEqual(["123", requestOptions]);
    expect(getSurveyModelsSpy.calls.count()).toBe(1);
    expect(getSurveyModelsSpy.calls.argsFor(0)).toEqual([
      formModel.item.id,
      requestOptions
    ]);
    expect(isPublishedSpy.calls.count()).toBe(1);
    expect(isPublishedSpy.calls.argsFor(0)).toEqual([formModel.item]);
    expect(result).toEqual({
      group: UpdateGroup,
      modelsToShare: [formModel, featureServiceModel]
    });
  });

  it("should resolve with the form & feature service models when a draft and a view group", async function() {
    const getGroupSpy = spyOn(restPortal, "getGroup").and.returnValue(
      Promise.resolve(ViewGroup)
    );
    const getSurveyModelsSpy = spyOn(
      getSurveyModels,
      "getSurveyModels"
    ).and.returnValue(Promise.resolve(getSurveyModelsResult));
    const isPublishedSpy = spyOn(isPublished, "isPublished").and.returnValue(
      false
    );
    const result = await getGroupSharingDetails(
      formModel.item.id,
      "123",
      requestOptions
    );
    expect(getGroupSpy.calls.count()).toBe(1);
    expect(getGroupSpy.calls.argsFor(0)).toEqual(["123", requestOptions]);
    expect(getSurveyModelsSpy.calls.count()).toBe(1);
    expect(getSurveyModelsSpy.calls.argsFor(0)).toEqual([
      formModel.item.id,
      requestOptions
    ]);
    expect(isPublishedSpy.calls.count()).toBe(1);
    expect(isPublishedSpy.calls.argsFor(0)).toEqual([formModel.item]);
    expect(result).toEqual({
      group: ViewGroup,
      modelsToShare: [formModel, featureServiceModel]
    });
  });

  it("should resolve with the form, feature service, fieldworker & stakeholder models when published and an update group", async function() {
    formModel = { item: FormItemPublished };
    getSurveyModelsResult.form = formModel;
    const getGroupSpy = spyOn(restPortal, "getGroup").and.returnValue(
      Promise.resolve(UpdateGroup)
    );
    const getSurveyModelsSpy = spyOn(
      getSurveyModels,
      "getSurveyModels"
    ).and.returnValue(Promise.resolve(getSurveyModelsResult));
    const isPublishedSpy = spyOn(isPublished, "isPublished").and.returnValue(
      true
    );
    const result = await getGroupSharingDetails(
      formModel.item.id,
      "123",
      requestOptions
    );
    expect(getGroupSpy.calls.count()).toBe(1);
    expect(getGroupSpy.calls.argsFor(0)).toEqual(["123", requestOptions]);
    expect(getSurveyModelsSpy.calls.count()).toBe(1);
    expect(getSurveyModelsSpy.calls.argsFor(0)).toEqual([
      formModel.item.id,
      requestOptions
    ]);
    expect(isPublishedSpy.calls.count()).toBe(1);
    expect(isPublishedSpy.calls.argsFor(0)).toEqual([formModel.item]);
    expect(result).toEqual({
      group: UpdateGroup,
      modelsToShare: [
        formModel,
        featureServiceModel,
        fieldworkerModel,
        stakeholderModel
      ]
    });
  });

  it("should resolve with the form & fieldworker models when published and a view group", async function() {
    formModel = { item: FormItemPublished };
    getSurveyModelsResult.form = formModel;
    const getGroupSpy = spyOn(restPortal, "getGroup").and.returnValue(
      Promise.resolve(ViewGroup)
    );
    const getSurveyModelsSpy = spyOn(
      getSurveyModels,
      "getSurveyModels"
    ).and.returnValue(Promise.resolve(getSurveyModelsResult));
    const isPublishedSpy = spyOn(isPublished, "isPublished").and.returnValue(
      true
    );
    const result = await getGroupSharingDetails(
      formModel.item.id,
      "123",
      requestOptions
    );
    expect(getGroupSpy.calls.count()).toBe(1);
    expect(getGroupSpy.calls.argsFor(0)).toEqual(["123", requestOptions]);
    expect(getSurveyModelsSpy.calls.count()).toBe(1);
    expect(getSurveyModelsSpy.calls.argsFor(0)).toEqual([
      formModel.item.id,
      requestOptions
    ]);
    expect(isPublishedSpy.calls.count()).toBe(1);
    expect(isPublishedSpy.calls.argsFor(0)).toEqual([formModel.item]);
    expect(result).toEqual({
      group: ViewGroup,
      modelsToShare: [formModel, fieldworkerModel]
    });
  });

  it("should filter out falsey models", async function() {
    formModel = { item: FormItemPublished };
    getSurveyModelsResult.form = formModel;
    delete getSurveyModelsResult.stakeholder;
    const getGroupSpy = spyOn(restPortal, "getGroup").and.returnValue(
      Promise.resolve(UpdateGroup)
    );
    const getSurveyModelsSpy = spyOn(
      getSurveyModels,
      "getSurveyModels"
    ).and.returnValue(Promise.resolve(getSurveyModelsResult));
    const isPublishedSpy = spyOn(isPublished, "isPublished").and.returnValue(
      true
    );
    const result = await getGroupSharingDetails(
      formModel.item.id,
      "123",
      requestOptions
    );
    expect(getGroupSpy.calls.count()).toBe(1);
    expect(getGroupSpy.calls.argsFor(0)).toEqual(["123", requestOptions]);
    expect(getSurveyModelsSpy.calls.count()).toBe(1);
    expect(getSurveyModelsSpy.calls.argsFor(0)).toEqual([
      formModel.item.id,
      requestOptions
    ]);
    expect(isPublishedSpy.calls.count()).toBe(1);
    expect(isPublishedSpy.calls.argsFor(0)).toEqual([formModel.item]);
    expect(result).toEqual({
      group: UpdateGroup,
      modelsToShare: [formModel, featureServiceModel, fieldworkerModel]
    });
  });
});
