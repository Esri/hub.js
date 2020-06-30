/* Copyright (c) 2018 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

import * as restPortal from "@esri/arcgis-rest-portal";
import * as hubCommon from "@esri/hub-common";
import { mockUserSession as authentication } from "@esri/hub-common/test/test-helpers/fake-user-session";
import { FormItemPublished } from "../mocks/form-item-published";
import { setAccessRevertable } from "../../src/sharing/set-access-revertable";

describe("setAccessRevertable", function () {
  let model: hubCommon.IModel;
  let setItemAccessResponse: restPortal.ISharingResponse;

  beforeEach(() => {
    model = { item: FormItemPublished };

    setItemAccessResponse = {
      notSharedWith: [],
      itemId: model.item.id
    };
  });

  it("should resolve the IRevertableTaskResult from runRevertableTask", async function () {
    const runRevertableTaskResult: hubCommon.IRevertableTaskResult = {
      status: "fullfilled",
      revert: () => Promise.resolve(),
      results: setItemAccessResponse
    } as hubCommon.IRevertableTaskSuccess;
    const runRevertableTaskSpy = spyOn(hubCommon, "runRevertableTask").and.returnValue(Promise.resolve(runRevertableTaskResult));
    spyOn(restPortal, "setItemAccess").and.returnValue(Promise.resolve(setItemAccessResponse));
    const result = await setAccessRevertable(model, "public", { authentication });
    expect(runRevertableTaskSpy.calls.count()).toBe(1);
    const taskMethod = runRevertableTaskSpy.calls.argsFor(0)[0];
    const revertMethod = runRevertableTaskSpy.calls.argsFor(0)[1];
    expect(typeof taskMethod).toBe("function");
    expect(typeof revertMethod).toBe("function");
    expect(result).toEqual(runRevertableTaskResult);
  });

  describe("task method", function () {
    it("should resolve the ISharingResponse from setItemAccess", async function () {
      const runRevertableTaskResult: hubCommon.IRevertableTaskResult = {
        status: "fullfilled",
        revert: () => Promise.resolve(),
        results: setItemAccessResponse
      } as hubCommon.IRevertableTaskSuccess;
      const runRevertableTaskSpy = spyOn(hubCommon, "runRevertableTask").and.returnValue(Promise.resolve(runRevertableTaskResult));
      const setItemAccessSpy = spyOn(restPortal, "setItemAccess").and.returnValue(Promise.resolve(setItemAccessResponse));
      await setAccessRevertable(model, "public", { authentication });
      const taskMethod = runRevertableTaskSpy.calls.argsFor(0)[0];
      const result = await taskMethod();
      expect(setItemAccessSpy.calls.count()).toBe(1);
      expect(setItemAccessSpy.calls.argsFor(0)).toEqual([{
        id: model.item.id,
        owner: model.item.owner,
        access: "public",
        authentication
      }]);
      expect(result).toEqual(setItemAccessResponse);
    });
  
    it("rejects with an error", async function (done) {
      setItemAccessResponse = {
        notSharedWith: [model.item.id],
        itemId: model.item.id
      };
      const error = new Error(`Failed to set item ${model.item.id} access to public`);
      const runRevertableTaskResult: hubCommon.IRevertableTaskResult = {
        status: "rejected",
        error
      } as hubCommon.IRevertableTaskFailed;
      const runRevertableTaskSpy = spyOn(hubCommon, "runRevertableTask").and.returnValue(Promise.resolve(runRevertableTaskResult));
      const setItemAccessSpy = spyOn(restPortal, "setItemAccess").and.returnValue(Promise.resolve(setItemAccessResponse));
      await setAccessRevertable(model, "public", { authentication });
      const taskMethod = runRevertableTaskSpy.calls.argsFor(0)[0];
      try {
        await taskMethod();
        done.fail("Should have rejected");
      } catch (e) {
        expect(setItemAccessSpy.calls.count()).toBe(1);
        expect(setItemAccessSpy.calls.argsFor(0)).toEqual([{
          id: model.item.id,
          owner: model.item.owner,
          access: "public",
          authentication
        }]);
        expect(e).toEqual(e);
        done();
      }
    });
  });

  describe("revert method", function () {
    it("should resolve the ISharingResponse from setItemAccess", async function () {
      const runRevertableTaskSpy = spyOn(hubCommon, "runRevertableTask").and.returnValue(Promise.resolve());
      const setItemAccessSpy = spyOn(restPortal, "setItemAccess").and.returnValue(Promise.resolve(setItemAccessResponse));
      await setAccessRevertable(model, "public", { authentication });
      const revertMethod = runRevertableTaskSpy.calls.argsFor(0)[1];
      const result = await revertMethod();
      expect(setItemAccessSpy.calls.count()).toBe(1);
      expect(setItemAccessSpy.calls.argsFor(0)).toEqual([{
        id: model.item.id,
        owner: model.item.owner,
        access: model.item.access,
        authentication
      }]);
      expect(result).toEqual(setItemAccessResponse);
    });

    it("should coerce the item access to private when shared", async function () {
      const clone = hubCommon.cloneObject(model);
      clone.item.access = "shared";
      const runRevertableTaskSpy = spyOn(hubCommon, "runRevertableTask").and.returnValue(Promise.resolve());
      const setItemAccessSpy = spyOn(restPortal, "setItemAccess").and.returnValue(Promise.resolve(setItemAccessResponse));
      await setAccessRevertable(clone, "public", { authentication });
      const revertMethod = runRevertableTaskSpy.calls.argsFor(0)[1];
      const result = await revertMethod();
      expect(setItemAccessSpy.calls.count()).toBe(1);
      expect(setItemAccessSpy.calls.argsFor(0)).toEqual([{
        id: model.item.id,
        owner: model.item.owner,
        access: "private",
        authentication
      }]);
      expect(result).toEqual(setItemAccessResponse);
    });
  
    it("suppresses any error", async function () {
      const error = new Error(`Failed to set item ${model.item.id} access to public`);
      const runRevertableTaskResult: hubCommon.IRevertableTaskResult = {
        status: "rejected",
        error
      } as hubCommon.IRevertableTaskFailed;
      const runRevertableTaskSpy = spyOn(hubCommon, "runRevertableTask").and.returnValue(Promise.resolve(runRevertableTaskResult));
      const setItemAccessSpy = spyOn(restPortal, "setItemAccess").and.returnValue(Promise.reject(new Error("Failed")));
      await setAccessRevertable(model, "public", { authentication });
      const revertMethod = runRevertableTaskSpy.calls.argsFor(0)[1];
      const result = await revertMethod();
      expect(setItemAccessSpy.calls.count()).toBe(1);
      expect(setItemAccessSpy.calls.argsFor(0)).toEqual([{
        id: model.item.id,
        owner: model.item.owner,
        access: model.item.access,
        authentication
      }]);
      expect(result).toBeUndefined();
    });
  });
});
