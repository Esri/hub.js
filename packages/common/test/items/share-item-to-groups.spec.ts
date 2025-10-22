vi.mock("@esri/arcgis-rest-portal", async (importOriginal) => ({
  ...(await importOriginal()),
  shareItemWithGroup: vi.fn(),
  searchGroups: vi.fn(),
}));

import * as portal from "@esri/arcgis-rest-portal";
import * as pollModule from "../../src/utils/poll";
import { mockUserSession } from "../test-helpers/fake-user-session";
import { shareItemToGroups } from "../../src/items/share-item-to-groups";

afterEach(() => vi.restoreAllMocks());

describe("shareItemToGroups", () => {
  it("should share to groups", async () => {
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
    const shareItemWithGroupSpy = vi
      .spyOn(portal as any, "shareItemWithGroup")
      .mockResolvedValue(sharingResponse);
    const searchGroupsSpy = vi
      .spyOn(portal as any, "searchGroups")
      .mockResolvedValue(groupResults);
    const pollSpy = vi
      .spyOn(pollModule as any, "poll")
      .mockResolvedValue(groupResults);
    const res = await shareItemToGroups(
      "abc",
      ["31c", "56n"],
      requestOptions,
      "jdoe"
    );
    expect(pollSpy).toHaveBeenCalledTimes(1);
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
    const fnResults = await (pollSpy as any).mock.calls[0][0]();
    expect(fnResults).toEqual(groupResults);
    expect(searchGroupsSpy).toHaveBeenCalledTimes(1);
    expect(searchGroupsSpy).toHaveBeenCalledWith({
      q: `id:(31c OR 56n)`,
      num: 2,
      ...requestOptions,
    });
    const validatorResults = await (pollSpy as any).mock.calls[0][1](
      groupResults
    );
    expect(validatorResults).toEqual(true);
  });

  it("should not poll or share when groups array is empty", async () => {
    const requestOptions = {
      authentication: mockUserSession,
    };
    const shareItemWithGroupSpy = vi
      .spyOn(portal as any, "shareItemWithGroup")
      .mockResolvedValue({ itemId: "abc" });
    const pollSpy = vi
      .spyOn(pollModule as any, "poll")
      .mockResolvedValue({ results: [] });
    const res = await shareItemToGroups("abc", [], requestOptions, "jdoe");
    expect(pollSpy).not.toHaveBeenCalled();
    expect(shareItemWithGroupSpy).not.toHaveBeenCalled();
    expect(res).toEqual([]);
  });

  it("should reject when polling fails", async () => {
    const requestOptions = {
      authentication: mockUserSession,
    };
    vi.spyOn(portal as any, "shareItemWithGroup").mockResolvedValue({
      itemId: "abc",
    });
    const pollSpy = vi
      .spyOn(pollModule as any, "poll")
      .mockRejectedValue(new Error("fail"));

    await expect(
      shareItemToGroups("abc", ["31c", "56n"], requestOptions, "jdoe")
    ).rejects.toThrow("Error sharing item: abc with groups: 31c, 56n");

    expect(pollSpy).toHaveBeenCalledTimes(1);
    expect((pollSpy as any).mock.calls[0][0]).toBeDefined();
    expect((pollSpy as any).mock.calls[0][1]).toBeDefined();
  });

  it("should reject when sharing fails", async () => {
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
    vi.spyOn(portal as any, "shareItemWithGroup")
      .mockImplementationOnce(() => Promise.resolve({ itemId: "abc" }))
      .mockImplementationOnce(() => Promise.reject(new Error("fail")));
    vi.spyOn(pollModule as any, "poll").mockResolvedValue(groupResults);

    await expect(
      shareItemToGroups("abc", ["31c", "56n"], requestOptions, "jdoe")
    ).rejects.toThrow("Error sharing item: abc with group: 56n");
  });
});
