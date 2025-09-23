import * as portal from "@esri/arcgis-rest-portal";
import { mockUserSession } from "../test-helpers/fake-user-session";
import { unshareItemFromGroups } from "../../src/items/unshare-item-from-groups";

describe("unshareItemFromGroups", function () {
  it("delegates to arcgis-rest-js with owner", async function () {
    const unshareItemSpy = spyOn(portal, "unshareItemWithGroup").and.callFake(
      (itemId: string) =>
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
      },
      "bob"
    );

    expect(unshareItemSpy.calls.count()).toEqual(2);
    expect(unshareItemSpy.calls.argsFor(0)[0].groupId).toEqual("grp1");
    expect(unshareItemSpy.calls.argsFor(1)[0].groupId).toEqual("grp2");
    expect(responses.length).toBe(2);
    expect(responses[0].notUnsharedFrom?.length).toBe(0);
  });
  it("delegates to arcgis-rest-js without owner", async function () {
    const unshareItemSpy = spyOn(portal, "unshareItemWithGroup").and.callFake(
      (itemId: string) =>
        Promise.resolve({
          notUnsharedFrom: [],
          itemId,
        })
    );

    const responses = await unshareItemFromGroups("item-id", ["grp1", "grp2"], {
      authentication: mockUserSession,
    });

    expect(unshareItemSpy.calls.count()).toEqual(2);
    expect(unshareItemSpy.calls.argsFor(0)[0].groupId).toEqual("grp1");
    expect(unshareItemSpy.calls.argsFor(1)[0].groupId).toEqual("grp2");
    expect(responses.length).toBe(2);
    expect(responses[0].notUnsharedFrom?.length).toBe(0);
  });

  it("throws when fails to unshare", async () => {
    const unshareItemSpy = spyOn(portal, "unshareItemWithGroup").and.callFake(
      () => Promise.reject(new Error("unshare from groups failed"))
    );
    try {
      await unshareItemFromGroups("item-id", ["grp1"], {
        authentication: mockUserSession,
      });
    } catch (err) {
      const error = err as { message?: string };
      expect(unshareItemSpy).toHaveBeenCalled();
      expect(error.message).toBe(
        "Error unsharing item: item-id with group: grp1"
      );
    }
  });
});
