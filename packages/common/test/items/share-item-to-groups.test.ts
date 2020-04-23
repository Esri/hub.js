import { shareItemToGroups } from "../../src";
import * as portal from "@esri/arcgis-rest-portal";
import { mockUserSession } from "../test-helpers/fake-user-session";

describe("shareItemToGroups", function() {
  it("delegates to arcgis-rest-js", async function() {
    const shareItemSpy = spyOn(portal, "shareItemWithGroup").and.callFake(
      (itemId: string) =>
        Promise.resolve({
          notSharedWith: [],
          itemId
        })
    );

    const responses = await shareItemToGroups("item-id", ["grp1", "grp2"], {
      authentication: mockUserSession
    });

    expect(shareItemSpy.calls.count()).toEqual(2);
    expect(shareItemSpy.calls.argsFor(0)[0].groupId).toEqual("grp1");
    expect(shareItemSpy.calls.argsFor(1)[0].groupId).toEqual("grp2");
    expect(responses.length).toBe(2);
    expect(responses[0].notSharedWith.length).toBe(0);
  });
});
