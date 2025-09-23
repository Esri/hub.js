import * as portal from "@esri/arcgis-rest-portal";
import { mockUserSession } from "../test-helpers/fake-user-session";
import { _unprotectAndRemoveItem } from "../../src/items/_unprotect-and-remove-item";

describe("_unprotectAndRemoveItem", function () {
  it("unprotects and removes a group", async function () {
    const unprotectItemSpy = spyOn(portal, "unprotectItem").and.returnValue(
      Promise.resolve({ success: true })
    );
    const removeItemSpy = spyOn(portal, "removeItem").and.returnValue(
      Promise.resolve({ success: true })
    );

    const res = await _unprotectAndRemoveItem({
      id: "foo-baz",
      authentication: mockUserSession,
    });

    expect(res.success).toBeTruthy("resolves to success:true");
    expect(unprotectItemSpy.calls.count()).toBe(1, "unprotect called");
    expect(removeItemSpy.calls.count()).toBe(1, "remove called");
  });

  it("is impervious to failures", async function () {
    spyOn(portal, "unprotectItem").and.returnValue(Promise.reject());
    spyOn(portal, "removeItem").and.returnValue(Promise.reject());

    let res;
    try {
      res = await _unprotectAndRemoveItem({
        id: "foo-baz",
        authentication: mockUserSession,
      });
    } catch (_) {
      fail(Error("function rejected"));
    }

    expect(res.success).toBeTruthy("resolves to success:true");
  });
});
