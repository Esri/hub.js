import * as portal from "@esri/arcgis-rest-portal";
import { unprotectModel, IModel } from "../../src";
import { mockUserSession } from "../test-helpers/fake-user-session";

describe("unprotectModel", function() {
  it("", async function() {
    const unprotectItemSpy = spyOn(portal, "unprotectItem").and.returnValue(
      Promise.resolve({ success: true })
    );

    const model: IModel = {
      item: {
        id: "someId",
        protected: false,
        owner: "owner",
        created: 123,
        modified: 123,
        tags: [],
        numViews: 3,
        size: 3,
        title: "title",
        type: "Hub Site Application"
      },
      data: { foo: "bar", baz: { boop: "beep" } }
    };

    const result = await unprotectModel(model, {
      authentication: mockUserSession
    });
    expect(result.success).toBeTruthy("returned success");
    expect(unprotectItemSpy.calls.count()).toBe(
      0,
      "Unprotect not called on already unprotected item"
    );

    unprotectItemSpy.calls.reset();

    model.item.protected = true;
    const result2 = await unprotectModel(model, {
      authentication: mockUserSession
    });
    expect(result2.success).toBeTruthy("returned success");
    expect(unprotectItemSpy.calls.count()).toBe(
      1,
      "Unprotect called on protected item"
    );
  });
});
