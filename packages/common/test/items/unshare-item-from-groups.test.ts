import { unshareItemFromGroups } from "../../src";
import { UserSession } from "@esri/arcgis-rest-auth";

import * as portal from "@esri/arcgis-rest-portal";

describe("unshareItemFromGroups", function() {
  const TOMORROW = (function() {
    const now = new Date();
    now.setDate(now.getDate() + 1);
    return now;
  })();

  const authentication = new UserSession({
    username: "vader",
    password: "123456",
    token: "fake-token",
    tokenExpires: TOMORROW
  });

  it("delegates to arcgis-rest-js", async function() {
    const unshareItemSpy = spyOn(portal, "unshareItemWithGroup").and.callFake(
      (itemId: string) =>
        Promise.resolve({
          notUnsharedFrom: [],
          itemId
        })
    );

    const responses = await unshareItemFromGroups("item-id", ["grp1", "grp2"], {
      authentication
    });

    expect(unshareItemSpy.calls.count()).toEqual(2);
    expect(unshareItemSpy.calls.argsFor(0)[0].groupId).toEqual("grp1");
    expect(unshareItemSpy.calls.argsFor(1)[0].groupId).toEqual("grp2");
    expect(responses.length).toBe(2);
    expect(responses[0].notUnsharedFrom.length).toBe(0);
  });
});
