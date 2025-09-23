import * as portal from "@esri/arcgis-rest-portal";
import { mockUserSession } from "../test-helpers/fake-user-session";
import { _unprotectAndRemoveGroup } from "../../src/groups/_unprotect-and-remove-group";

describe("_unprotectAndRemoveGroup", function () {
  it("unprotects and removes a group", async function () {
    const unprotectGroupSpy = spyOn(portal, "unprotectGroup").and.returnValue(
      Promise.resolve({ success: true })
    );
    const removeGroupSpy = spyOn(portal, "removeGroup").and.returnValue(
      Promise.resolve({ success: true })
    );

    const res = await _unprotectAndRemoveGroup({
      id: "foo-baz",
      authentication: mockUserSession,
    });

    expect(res.success).toBeTruthy("resolves to success:true");
    expect(unprotectGroupSpy.calls.count()).toBe(1, "unprotect called");
    expect(removeGroupSpy.calls.count()).toBe(1, "remove called");
  });

  it("is impervious to failures", async function () {
    spyOn(portal, "unprotectGroup").and.returnValue(Promise.reject());
    spyOn(portal, "removeGroup").and.returnValue(Promise.reject());

    let res;
    try {
      res = await _unprotectAndRemoveGroup({
        id: "foo-baz",
        authentication: mockUserSession,
      });
    } catch (_) {
      fail(Error("function rejected"));
    }

    expect(res.success).toBeTruthy("resolves to success:true");
  });
});
