import { failSafeUpdate, IModel } from "../../src";
import { mockUserSession } from "../test-helpers/fake-user-session";

import * as portal from "@esri/arcgis-rest-portal";

describe("failSafeUpdate", function() {
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

  it("updates item", async function() {
    const updateItemSpy = spyOn(portal, "updateItem").and.returnValue(
      Promise.resolve({ id: model.item.id, success: true })
    );

    const res = await failSafeUpdate(model, {
      authentication: mockUserSession
    });

    expect(res.success).toBeTruthy("returned success");
    expect(updateItemSpy.calls.count()).toBe(1, "updateItem called");
  });

  it("never fails", async function() {
    const updateItemSpy = spyOn(portal, "updateItem").and.returnValue(
      Promise.reject({ success: false })
    );

    let res;
    try {
      res = await failSafeUpdate(model, {
        authentication: mockUserSession
      });
    } catch (_) {
      fail(Error("failSafeUpdate rejected"));
    }

    expect(res.success).toBeTruthy("returned success");
    expect(updateItemSpy.calls.count()).toBe(1, "updateItem called");
  });
});
