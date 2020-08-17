/* Copyright (c) 2018 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

import { IRequestOptions } from "@esri/arcgis-rest-request";
import * as hubCommon from "@esri/hub-common";
import { mockUserSession as authentication } from "@esri/hub-common/test/test-helpers/fake-user-session";
import { FormItemPublished } from "../mocks/form-item-published";
import { FeatureServiceItem } from "../mocks/feature-service-item";
import { FieldworkerItem } from "../mocks/fieldworker-item";
import { StakeholderItem } from "../mocks/stakeholder-item";
import { ViewGroup } from "../mocks/view-group";
import { shareWithGroup } from "../../src/sharing/share-with-group";
import * as shareWithGroupRevertable from "../../src/sharing/share-with-group-revertable";
import * as getGroupSharingDetails from "../../src/sharing/get-group-sharing-details";

describe("shareWithGroup", function() {
  let formModel: hubCommon.IModel;
  let featureServiceModel: hubCommon.IModel;
  let fieldworkerModel: hubCommon.IModel;
  let stakeholderModel: hubCommon.IModel;
  let requestOptions: IRequestOptions;
  let getGroupSharingDetailsResults: hubCommon.IGetGroupSharingDetailsResults;
  let shareWithGroupRevertableResults: hubCommon.IRevertableTaskResult[];
  let shareWithGroupRevertablePromiseResults: Array<
    Promise<hubCommon.IRevertableTaskResult>
  >;
  let processRevertableTasksResults: any[];

  beforeEach(() => {
    formModel = { item: FormItemPublished };
    featureServiceModel = { item: FeatureServiceItem };
    fieldworkerModel = { item: FieldworkerItem };
    stakeholderModel = { item: StakeholderItem };
    requestOptions = { authentication };
    getGroupSharingDetailsResults = {
      modelsToShare: [
        formModel,
        featureServiceModel,
        fieldworkerModel,
        stakeholderModel
      ],
      group: ViewGroup
    };
    shareWithGroupRevertableResults = [
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
      },
      {
        status: "fullfilled",
        revert: () => Promise.resolve("stakeholder"),
        results: { notSharedWith: [], itemId: stakeholderModel.item.id }
      }
    ];
    shareWithGroupRevertablePromiseResults = shareWithGroupRevertableResults.map(
      (result: hubCommon.IRevertableTaskResult) => Promise.resolve(result)
    );
    processRevertableTasksResults = (shareWithGroupRevertableResults as hubCommon.IRevertableTaskSuccess[]).map(
      ({ results }) => results
    );
  });

  it("should resolve the results from processRevertableTasks", async function() {
    const getGroupSharingDetailsSpy = spyOn(
      getGroupSharingDetails,
      "getGroupSharingDetails"
    ).and.returnValue(Promise.resolve(getGroupSharingDetailsResults));
    const shareWithGroupRevertableSpy = spyOn(
      shareWithGroupRevertable,
      "shareWithGroupRevertable"
    ).and.returnValues(...shareWithGroupRevertablePromiseResults);
    const processRevertableTasksSpy = spyOn(
      hubCommon,
      "processRevertableTasks"
    ).and.returnValue(Promise.resolve(processRevertableTasksResults));
    const results = await shareWithGroup(
      formModel.item.id,
      ViewGroup.id,
      requestOptions
    );
    expect(getGroupSharingDetailsSpy.calls.count()).toBe(1);
    expect(getGroupSharingDetailsSpy.calls.argsFor(0)).toEqual([
      FormItemPublished.id,
      ViewGroup.id,
      requestOptions
    ]);
    expect(shareWithGroupRevertableSpy.calls.count()).toBe(4);
    expect(shareWithGroupRevertableSpy.calls.argsFor(0)).toEqual([
      formModel,
      ViewGroup,
      requestOptions
    ]);
    expect(shareWithGroupRevertableSpy.calls.argsFor(1)).toEqual([
      featureServiceModel,
      ViewGroup,
      requestOptions
    ]);
    expect(shareWithGroupRevertableSpy.calls.argsFor(2)).toEqual([
      fieldworkerModel,
      ViewGroup,
      requestOptions
    ]);
    expect(shareWithGroupRevertableSpy.calls.argsFor(3)).toEqual([
      stakeholderModel,
      ViewGroup,
      requestOptions
    ]);
    expect(processRevertableTasksSpy.calls.count()).toBe(1);
    expect(processRevertableTasksSpy.calls.argsFor(0)).toEqual([
      shareWithGroupRevertablePromiseResults
    ]);
    expect(results).toEqual(processRevertableTasksResults);
  });

  it("should reject if processRevertableTasks rejects", async function(done) {
    const getGroupSharingDetailsSpy = spyOn(
      getGroupSharingDetails,
      "getGroupSharingDetails"
    ).and.returnValue(Promise.resolve(getGroupSharingDetailsResults));
    const shareWithGroupRevertableSpy = spyOn(
      shareWithGroupRevertable,
      "shareWithGroupRevertable"
    ).and.returnValues(...shareWithGroupRevertablePromiseResults);
    const processRevertableTasksSpy = spyOn(
      hubCommon,
      "processRevertableTasks"
    ).and.returnValue(Promise.reject(new Error("fail")));
    try {
      await shareWithGroup(formModel.item.id, ViewGroup.id, requestOptions);
      done.fail("Should have rejected");
    } catch (e) {
      expect(getGroupSharingDetailsSpy.calls.count()).toBe(1);
      expect(getGroupSharingDetailsSpy.calls.argsFor(0)).toEqual([
        FormItemPublished.id,
        ViewGroup.id,
        requestOptions
      ]);
      expect(shareWithGroupRevertableSpy.calls.count()).toBe(4);
      expect(shareWithGroupRevertableSpy.calls.argsFor(0)).toEqual([
        formModel,
        ViewGroup,
        requestOptions
      ]);
      expect(shareWithGroupRevertableSpy.calls.argsFor(1)).toEqual([
        featureServiceModel,
        ViewGroup,
        requestOptions
      ]);
      expect(shareWithGroupRevertableSpy.calls.argsFor(2)).toEqual([
        fieldworkerModel,
        ViewGroup,
        requestOptions
      ]);
      expect(shareWithGroupRevertableSpy.calls.argsFor(3)).toEqual([
        stakeholderModel,
        ViewGroup,
        requestOptions
      ]);
      expect(processRevertableTasksSpy.calls.count()).toBe(1);
      expect(processRevertableTasksSpy.calls.argsFor(0)).toEqual([
        shareWithGroupRevertablePromiseResults
      ]);
      expect(e).toEqual(
        new Error(
          `Failed to share survey ${formModel.item.id} items to group ${
            ViewGroup.id
          }`
        )
      );
      done();
    }
  });
});
