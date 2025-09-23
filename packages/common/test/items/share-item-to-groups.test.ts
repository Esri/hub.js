import * as portal from "@esri/arcgis-rest-portal";
import * as pollModule from "../../src/utils/poll";
import { mockUserSession } from "../test-helpers/fake-user-session";
import { shareItemToGroups } from "../../src/items/share-item-to-groups";

describe("shareItemToGroups", function () {
  it("should share to groups", async function () {
    const groups = [
      { id: "31c", capabilities: [] },
      { id: "56n", capabilities: ["updateitemcontrol"] },
    ];
    const requestOptions = {
      authentication: mockUserSession,
    };
    const groupResults = {
      results: groups,
    };
    const sharingResponse = { itemId: "abc" };
    const shareItemWithGroupSpy = spyOn(
      portal,
      "shareItemWithGroup"
    ).and.returnValue(Promise.resolve(sharingResponse));
    const searchGroupsSpy = spyOn(portal, "searchGroups").and.returnValue(
      Promise.resolve(groupResults)
    );
    const pollSpy = spyOn(pollModule, "poll").and.returnValue(
      Promise.resolve(groupResults)
    );
    const res = await shareItemToGroups(
      "abc",
      ["31c", "56n"],
      requestOptions,
      "jdoe"
    );
    expect(pollSpy).toHaveBeenCalledTimes(1);
    expect(pollSpy).toHaveBeenCalledWith(
      jasmine.any(Function),
      jasmine.any(Function)
    );
    expect(shareItemWithGroupSpy).toHaveBeenCalledTimes(2);
    expect(shareItemWithGroupSpy).toHaveBeenCalledWith({
      ...requestOptions,
      id: "abc",
      groupId: "31c",
      owner: "jdoe",
      confirmItemControl: false,
    });
    expect(shareItemWithGroupSpy).toHaveBeenCalledWith({
      ...requestOptions,
      id: "abc",
      groupId: "56n",
      owner: "jdoe",
      confirmItemControl: true,
    });
    expect(res).toEqual([sharingResponse, sharingResponse]);
    const fnResults = await pollSpy.calls.argsFor(0)[0]();
    expect(fnResults).toEqual(groupResults);
    expect(searchGroupsSpy).toHaveBeenCalledTimes(1);
    expect(searchGroupsSpy).toHaveBeenCalledWith({
      q: `id:(31c OR 56n)`,
      num: 2,
      ...requestOptions,
    });
    const validatorResults = await pollSpy.calls.argsFor(0)[1](groupResults);
    expect(validatorResults).toEqual(true);
  });
  it("should not poll or share when groups array is empty", async function () {
    const groups = [
      { id: "31c", capabilities: [] },
      { id: "56n", capabilities: ["updateitemcontrol"] },
    ];
    const requestOptions = {
      authentication: mockUserSession,
    };
    const groupResults = {
      results: groups,
    };
    const sharingResponse = { itemId: "abc" };
    const shareItemWithGroupSpy = spyOn(
      portal,
      "shareItemWithGroup"
    ).and.returnValue(Promise.resolve(sharingResponse));
    const pollSpy = spyOn(pollModule, "poll").and.returnValue(
      Promise.resolve(groupResults)
    );
    const res = await shareItemToGroups("abc", [], requestOptions, "jdoe");
    expect(pollSpy).not.toHaveBeenCalled();
    expect(shareItemWithGroupSpy).not.toHaveBeenCalled();
    expect(res).toEqual([]);
  });
  it("should reject when polling fails", async function () {
    const requestOptions = {
      authentication: mockUserSession,
    };
    const sharingResponse = { itemId: "abc" };
    const shareItemWithGroupSpy = spyOn(
      portal,
      "shareItemWithGroup"
    ).and.returnValue(Promise.resolve(sharingResponse));
    const pollSpy = spyOn(pollModule, "poll").and.returnValue(
      Promise.reject(new Error("fail"))
    );
    try {
      await shareItemToGroups("abc", ["31c", "56n"], requestOptions, "jdoe");
      fail("not rejected");
    } catch (e) {
      const error = e as { message?: string };
      expect(error.message).toEqual(
        "Error sharing item: abc with groups: 31c, 56n"
      );
    }
    expect(pollSpy).toHaveBeenCalledTimes(1);
    expect(pollSpy).toHaveBeenCalledWith(
      jasmine.any(Function),
      jasmine.any(Function)
    );
    expect(shareItemWithGroupSpy).toHaveBeenCalledTimes(0);
  });
  it("should reject when sharing fails", async function () {
    const groups = [
      { id: "31c", capabilities: [] },
      { id: "56n", capabilities: ["updateitemcontrol"] },
    ];
    const requestOptions = {
      authentication: mockUserSession,
    };
    const groupResults = {
      results: groups,
    };
    const sharingResponse = { itemId: "abc" };
    const shareItemWithGroupSpy = spyOn(
      portal,
      "shareItemWithGroup"
    ).and.returnValues(
      Promise.resolve(sharingResponse),
      Promise.reject(new Error("fail"))
    );
    const pollSpy = spyOn(pollModule, "poll").and.returnValue(
      Promise.resolve(groupResults)
    );
    try {
      await shareItemToGroups("abc", ["31c", "56n"], requestOptions, "jdoe");
      fail("not rejected");
    } catch (e) {
      const error = e as { message?: string };
      expect(error.message).toEqual("Error sharing item: abc with group: 56n");
    }
    expect(pollSpy).toHaveBeenCalledTimes(1);
    expect(pollSpy).toHaveBeenCalledWith(
      jasmine.any(Function),
      jasmine.any(Function)
    );
    expect(shareItemWithGroupSpy).toHaveBeenCalledTimes(2);
    expect(shareItemWithGroupSpy).toHaveBeenCalledWith({
      ...requestOptions,
      id: "abc",
      groupId: "31c",
      owner: "jdoe",
      confirmItemControl: false,
    });
    expect(shareItemWithGroupSpy).toHaveBeenCalledWith({
      ...requestOptions,
      id: "abc",
      groupId: "56n",
      owner: "jdoe",
      confirmItemControl: true,
    });
  });
});
