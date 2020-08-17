/* Copyright (c) 2018 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

import { IRequestOptions } from "@esri/arcgis-rest-request";
import * as hubCommon from "@esri/hub-common";
import { mockUserSession as authentication } from "@esri/hub-common/test/test-helpers/fake-user-session";
import { FormItemPublished } from "../mocks/form-item-published";
import { FeatureServiceItem } from "../mocks/feature-service-item";
import { FieldworkerItem } from "../mocks/fieldworker-item";
import { ViewGroup } from "../mocks/view-group";
import { unshareWithGroup } from "../../src/sharing/unshare-with-group";
import * as unshareWithGroupRevertable from "../../src/sharing/unshare-with-group-revertable";
import * as getGroupSharingDetails from "../../src/sharing/get-group-sharing-details";

describe("unshareWithGroup", function() {
  let formModel: hubCommon.IModel;
  let featureServiceModel: hubCommon.IModel;
  let fieldworkerModel: hubCommon.IModel;
  let requestOptions: IRequestOptions;
  let getGroupSharingDetailsResults: hubCommon.IGetGroupSharingDetailsResults;
  let unshareWithGroupRevertableResults: hubCommon.IRevertableTaskResult[];
  let unshareWithGroupRevertablePromiseResults: Array<
    Promise<hubCommon.IRevertableTaskResult>
  >;
  let processRevertableTasksResults: any[];

  beforeEach(() => {
    formModel = { item: FormItemPublished };
    featureServiceModel = { item: FeatureServiceItem };
    fieldworkerModel = { item: FieldworkerItem };
    requestOptions = { authentication };
    getGroupSharingDetailsResults = {
      modelsToShare: [formModel, featureServiceModel, fieldworkerModel],
      group: ViewGroup
    };
    unshareWithGroupRevertableResults = [
      {
        status: "fullfilled",
        revert: () => Promise.resolve("form"),
        results: { notUnSharedWith: [], itemId: formModel.item.id }
      },
      {
        status: "fullfilled",
        revert: () => Promise.resolve("featureService"),
        results: { notUnSharedWith: [], itemId: featureServiceModel.item.id }
      },
      {
        status: "fullfilled",
        revert: () => Promise.resolve("fieldworker"),
        results: { notUnSharedWith: [], itemId: fieldworkerModel.item.id }
      }
    ];
    unshareWithGroupRevertablePromiseResults = unshareWithGroupRevertableResults.map(
      (result: hubCommon.IRevertableTaskResult) => Promise.resolve(result)
    );
    processRevertableTasksResults = (unshareWithGroupRevertableResults as hubCommon.IRevertableTaskSuccess[]).map(
      ({ results }) => results
    );
  });

  it("should resolve the results from processRevertableTasks", async function() {
    const getGroupSharingDetailsSpy = spyOn(
      getGroupSharingDetails,
      "getGroupSharingDetails"
    ).and.returnValue(Promise.resolve(getGroupSharingDetailsResults));
    const unshareWithGroupRevertableSpy = spyOn(
      unshareWithGroupRevertable,
      "unshareWithGroupRevertable"
    ).and.returnValues(...unshareWithGroupRevertablePromiseResults);
    const processRevertableTasksSpy = spyOn(
      hubCommon,
      "processRevertableTasks"
    ).and.returnValue(Promise.resolve(processRevertableTasksResults));
    const results = await unshareWithGroup(
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
    expect(unshareWithGroupRevertableSpy.calls.count()).toBe(3);
    expect(unshareWithGroupRevertableSpy.calls.argsFor(0)).toEqual([
      formModel,
      ViewGroup,
      requestOptions
    ]);
    expect(unshareWithGroupRevertableSpy.calls.argsFor(1)).toEqual([
      featureServiceModel,
      ViewGroup,
      requestOptions
    ]);
    expect(unshareWithGroupRevertableSpy.calls.argsFor(2)).toEqual([
      fieldworkerModel,
      ViewGroup,
      requestOptions
    ]);
    expect(processRevertableTasksSpy.calls.count()).toBe(1);
    expect(processRevertableTasksSpy.calls.argsFor(0)).toEqual([
      unshareWithGroupRevertablePromiseResults
    ]);
    expect(results).toEqual(processRevertableTasksResults);
  });

  it("should reject if processRevertableTasks rejects", async function(done) {
    const getGroupSharingDetailsSpy = spyOn(
      getGroupSharingDetails,
      "getGroupSharingDetails"
    ).and.returnValue(Promise.resolve(getGroupSharingDetailsResults));
    const unshareWithGroupRevertableSpy = spyOn(
      unshareWithGroupRevertable,
      "unshareWithGroupRevertable"
    ).and.returnValues(...unshareWithGroupRevertablePromiseResults);
    const processRevertableTasksSpy = spyOn(
      hubCommon,
      "processRevertableTasks"
    ).and.returnValue(Promise.reject(new Error("fail")));
    try {
      await unshareWithGroup(formModel.item.id, ViewGroup.id, requestOptions);
      done.fail("Should have rejected");
    } catch (e) {
      expect(getGroupSharingDetailsSpy.calls.count()).toBe(1);
      expect(getGroupSharingDetailsSpy.calls.argsFor(0)).toEqual([
        FormItemPublished.id,
        ViewGroup.id,
        requestOptions
      ]);
      expect(unshareWithGroupRevertableSpy.calls.count()).toBe(3);
      expect(unshareWithGroupRevertableSpy.calls.argsFor(0)).toEqual([
        formModel,
        ViewGroup,
        requestOptions
      ]);
      expect(unshareWithGroupRevertableSpy.calls.argsFor(1)).toEqual([
        featureServiceModel,
        ViewGroup,
        requestOptions
      ]);
      expect(unshareWithGroupRevertableSpy.calls.argsFor(2)).toEqual([
        fieldworkerModel,
        ViewGroup,
        requestOptions
      ]);
      expect(processRevertableTasksSpy.calls.count()).toBe(1);
      expect(processRevertableTasksSpy.calls.argsFor(0)).toEqual([
        unshareWithGroupRevertablePromiseResults
      ]);
      expect(e).toEqual(
        new Error(
          `Failed to unshare survey ${formModel.item.id} items with group ${
            ViewGroup.id
          }`
        )
      );
      done();
    }
  });
});
