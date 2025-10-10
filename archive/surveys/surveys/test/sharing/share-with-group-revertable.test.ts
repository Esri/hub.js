/* Copyright (c) 2018 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

import * as restPortal from "@esri/arcgis-rest-portal";
import * as hubCommon from "@esri/hub-common";
import { mockUserSession as authentication } from "@esri/hub-common/test/test-helpers/fake-user-session";
import * as FormItemPublished from "../../../common/test/mocks/items/form-item-published.json";
import * as ViewGroup from "../../../common/test/mocks/groups/view-group.json";
import { shareWithGroupRevertable } from "../../src/sharing/share-with-group-revertable";

describe("shareWithGroupRevertable", function () {
  let model: hubCommon.IModel;
  let unshareWithGroupResponse: restPortal.ISharingResponse;
  let shareItemWithGroupResponse: restPortal.ISharingResponse;
  let group: restPortal.IGroup;

  beforeEach(() => {
    model = { item: FormItemPublished };

    unshareWithGroupResponse = {
      notUnsharedFrom: [],
      itemId: model.item.id,
    };

    shareItemWithGroupResponse = {
      notSharedWith: [],
      itemId: model.item.id,
    };

    group = ViewGroup as restPortal.IGroup;
  });

  it("should resolve the IRevertableTaskResult from runRevertableTask", async function () {
    const runRevertableTaskResult: hubCommon.IRevertableTaskResult = {
      status: "fullfilled",
      revert: () => Promise.resolve(),
      results: shareItemWithGroupResponse,
    } as hubCommon.IRevertableTaskSuccess;
    const runRevertableTaskSpy = spyOn(
      hubCommon,
      "runRevertableTask"
    ).and.returnValue(Promise.resolve(runRevertableTaskResult));
    spyOn(restPortal, "shareItemWithGroup").and.returnValue(
      Promise.resolve(shareItemWithGroupResponse)
    );
    const result = await shareWithGroupRevertable(model, group, {
      authentication,
    });
    expect(runRevertableTaskSpy.calls.count()).toBe(1);
    const taskMethod = runRevertableTaskSpy.calls.argsFor(0)[0];
    const revertMethod = runRevertableTaskSpy.calls.argsFor(0)[1];
    expect(typeof taskMethod).toBe("function");
    expect(typeof revertMethod).toBe("function");
    expect(result).toEqual(runRevertableTaskResult);
  });

  describe("task method", function () {
    it("should resolve the ISharingResponse from shareItemWithGroup for update groups", async function () {
      const runRevertableTaskResult: hubCommon.IRevertableTaskResult = {
        status: "fullfilled",
        revert: () => Promise.resolve(),
        results: shareItemWithGroupResponse,
      } as hubCommon.IRevertableTaskSuccess;
      const runRevertableTaskSpy = spyOn(
        hubCommon,
        "runRevertableTask"
      ).and.returnValue(Promise.resolve(runRevertableTaskResult));
      const shareItemWithGroupSpy = spyOn(
        restPortal,
        "shareItemWithGroup"
      ).and.returnValue(Promise.resolve(shareItemWithGroupResponse));
      const isUpdateGroupSpy = spyOn(
        hubCommon,
        "isUpdateGroup"
      ).and.returnValue(true);
      await shareWithGroupRevertable(model, group, { authentication });
      const taskMethod = runRevertableTaskSpy.calls.argsFor(0)[0];
      const result = await taskMethod();
      expect(isUpdateGroupSpy.calls.count()).toBe(1);
      expect(isUpdateGroupSpy.calls.argsFor(0)).toEqual([group]);
      expect(shareItemWithGroupSpy.calls.count()).toBe(1);
      expect(shareItemWithGroupSpy.calls.argsFor(0)).toEqual([
        {
          id: model.item.id,
          owner: model.item.owner,
          groupId: group.id,
          confirmItemControl: true,
          authentication,
        },
      ]);
      expect(result).toEqual(shareItemWithGroupResponse);
    });

    it("should resolve the ISharingResponse from shareItemWithGroup for view groups", async function () {
      const runRevertableTaskResult: hubCommon.IRevertableTaskResult = {
        status: "fullfilled",
        revert: () => Promise.resolve(),
        results: shareItemWithGroupResponse,
      } as hubCommon.IRevertableTaskSuccess;
      const runRevertableTaskSpy = spyOn(
        hubCommon,
        "runRevertableTask"
      ).and.returnValue(Promise.resolve(runRevertableTaskResult));
      const shareItemWithGroupSpy = spyOn(
        restPortal,
        "shareItemWithGroup"
      ).and.returnValue(Promise.resolve(shareItemWithGroupResponse));
      const isUpdateGroupSpy = spyOn(
        hubCommon,
        "isUpdateGroup"
      ).and.returnValue(false);
      await shareWithGroupRevertable(model, group, { authentication });
      const taskMethod = runRevertableTaskSpy.calls.argsFor(0)[0];
      const result = await taskMethod();
      expect(isUpdateGroupSpy.calls.count()).toBe(1);
      expect(isUpdateGroupSpy.calls.argsFor(0)).toEqual([group]);
      expect(shareItemWithGroupSpy.calls.count()).toBe(1);
      expect(shareItemWithGroupSpy.calls.argsFor(0)).toEqual([
        {
          id: model.item.id,
          owner: model.item.owner,
          groupId: group.id,
          confirmItemControl: false,
          authentication,
        },
      ]);
      expect(result).toEqual(shareItemWithGroupResponse);
    });

    it("rejects with an error", async function (done) {
      shareItemWithGroupResponse = {
        notSharedWith: [model.item.id],
        itemId: model.item.id,
      };
      const error = new Error(
        `Failed to share item ${model.item.id} to group ${group.id}`
      );
      const runRevertableTaskResult: hubCommon.IRevertableTaskResult = {
        status: "rejected",
        error,
      } as hubCommon.IRevertableTaskFailed;
      const runRevertableTaskSpy = spyOn(
        hubCommon,
        "runRevertableTask"
      ).and.returnValue(Promise.resolve(runRevertableTaskResult));
      const shareItemWithGroupSpy = spyOn(
        restPortal,
        "shareItemWithGroup"
      ).and.returnValue(Promise.resolve(shareItemWithGroupResponse));
      spyOn(hubCommon, "isUpdateGroup").and.returnValue(false);
      await shareWithGroupRevertable(model, group, { authentication });
      const taskMethod = runRevertableTaskSpy.calls.argsFor(0)[0];
      try {
        await taskMethod();
        done.fail("Should have rejected");
      } catch (e) {
        expect(shareItemWithGroupSpy.calls.count()).toBe(1);
        expect(shareItemWithGroupSpy.calls.argsFor(0)).toEqual([
          {
            id: model.item.id,
            owner: model.item.owner,
            groupId: group.id,
            confirmItemControl: false,
            authentication,
          },
        ]);
        expect(e).toEqual(e);
        done();
      }
    });
  });

  describe("revert method", function () {
    it("should resolve the ISharingResponse from unshareItemWithGroup", async function () {
      const runRevertableTaskSpy = spyOn(
        hubCommon,
        "runRevertableTask"
      ).and.returnValue(Promise.resolve());
      const unshareItemWithGroupSpy = spyOn(
        restPortal,
        "unshareItemWithGroup"
      ).and.returnValue(Promise.resolve(unshareWithGroupResponse));
      await shareWithGroupRevertable(model, group, { authentication });
      const revertMethod = runRevertableTaskSpy.calls.argsFor(0)[1];
      const result = await revertMethod();
      expect(unshareItemWithGroupSpy.calls.count()).toBe(1);
      expect(unshareItemWithGroupSpy.calls.argsFor(0)).toEqual([
        {
          id: model.item.id,
          owner: model.item.owner,
          groupId: group.id,
          authentication,
        },
      ]);
      expect(result).toEqual(unshareWithGroupResponse);
    });

    it("should suppresses any error", async function () {
      const error = new Error(
        `Failed to unshare item ${model.item.id} from group ${group.id}`
      );
      const runRevertableTaskResult: hubCommon.IRevertableTaskResult = {
        status: "rejected",
        error,
      } as hubCommon.IRevertableTaskFailed;
      const runRevertableTaskSpy = spyOn(
        hubCommon,
        "runRevertableTask"
      ).and.returnValue(Promise.resolve(runRevertableTaskResult));
      const unshareItemWithGroupSpy = spyOn(
        restPortal,
        "unshareItemWithGroup"
      ).and.returnValue(Promise.reject(new Error("Failed")));
      await shareWithGroupRevertable(model, group, { authentication });
      const revertMethod = runRevertableTaskSpy.calls.argsFor(0)[1];
      const result = await revertMethod();
      expect(unshareItemWithGroupSpy.calls.count()).toBe(1);
      expect(unshareItemWithGroupSpy.calls.argsFor(0)).toEqual([
        {
          id: model.item.id,
          owner: model.item.owner,
          groupId: group.id,
          authentication,
        },
      ]);
      expect(result).toBeUndefined();
    });
  });
});
