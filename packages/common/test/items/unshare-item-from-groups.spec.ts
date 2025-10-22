// make ESM namespace spyable
vi.mock("@esri/arcgis-rest-portal", async (importOriginal: any) => {
  const mod = await importOriginal();
  return Object.assign({}, mod, {
    unshareItemWithGroup: vi.fn(),
  });
});

import * as portal from "@esri/arcgis-rest-portal";
import { mockUserSession } from "../test-helpers/fake-user-session";
import { unshareItemFromGroups } from "../../src/items/unshare-item-from-groups";
import { afterEach, describe, expect, it, vi } from "vitest";

describe("unshareItemFromGroups", function () {
  afterEach(() => vi.restoreAllMocks());

  it("delegates to arcgis-rest-js with owner", async function () {
    const unshareItemSpy = vi
      .spyOn(portal as any, "unshareItemWithGroup")
      .mockImplementation((itemId: string) =>
        Promise.resolve({
          notUnsharedFrom: [],
          itemId,
        })
      );

    const responses = await unshareItemFromGroups(
      "item-id",
      ["grp1", "grp2"],
      {
        authentication: mockUserSession,
      } as any,
      "bob"
    );

    expect(unshareItemSpy).toHaveBeenCalledTimes(2);
    expect((unshareItemSpy.mock.calls[0][0] as any).groupId).toEqual("grp1");
    expect((unshareItemSpy.mock.calls[1][0] as any).groupId).toEqual("grp2");
    expect(responses.length).toBe(2);
    expect(responses[0].notUnsharedFrom?.length).toBe(0);
  });
  it("delegates to arcgis-rest-js without owner", async function () {
    const unshareItemSpy = vi
      .spyOn(portal as any, "unshareItemWithGroup")
      .mockImplementation((itemId: string) =>
        Promise.resolve({
          notUnsharedFrom: [],
          itemId,
        })
      );

    const responses = await unshareItemFromGroups("item-id", ["grp1", "grp2"], {
      authentication: mockUserSession,
    } as any);

    expect(unshareItemSpy).toHaveBeenCalledTimes(2);
    expect((unshareItemSpy.mock.calls[0][0] as any).groupId).toEqual("grp1");
    expect((unshareItemSpy.mock.calls[1][0] as any).groupId).toEqual("grp2");
    expect(responses.length).toBe(2);
    expect(responses[0].notUnsharedFrom?.length).toBe(0);
  });

  it("throws when fails to unshare", async () => {
    const unshareItemSpy = vi
      .spyOn(portal as any, "unshareItemWithGroup")
      .mockImplementation(() =>
        Promise.reject(new Error("unshare from groups failed"))
      );
    try {
      await unshareItemFromGroups("item-id", ["grp1"], {
        authentication: mockUserSession,
      } as any);
    } catch (err) {
      const error = err as { message?: string };
      expect(unshareItemSpy).toHaveBeenCalled();
      expect(error.message).toBe(
        "Error unsharing item: item-id with group: grp1"
      );
    }
  });
});
