import { mockUserSession } from "../test-helpers/fake-user-session";

import * as portal from "../../src/rest/portal/wrappers";
import { failSafeUpdate } from "../../src/items/fail-safe-update";
import { IModel } from "../../src/hub-types";
import {
  describe,
  it,
  expect,
  afterEach,
  vi,
} from "vitest";

afterEach(() => vi.restoreAllMocks());

describe("failSafeUpdate", () => {
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
      type: "Hub Site Application",
    },
    data: { foo: "bar", baz: { boop: "beep" } },
  };

  it("updates item", async () => {
    const updateItemSpy = vi
      .spyOn(portal as any, "updateItem")
      .mockReturnValue(Promise.resolve({ id: model.item.id, success: true }));

    const res = await failSafeUpdate(model, {
      authentication: mockUserSession,
    });

    expect(res.success).toBeTruthy("returned success");
    expect((updateItemSpy as any).mock.calls.length).toBe(1);
  });

  it("never fails", async () => {
    const updateItemSpy = vi
      .spyOn(portal as any, "updateItem")
      .mockImplementation(() => Promise.reject({ success: false }));

    let res: any;
    try {
      res = await failSafeUpdate(model, {
        authentication: mockUserSession,
      });
    } catch (_) {
      throw new Error("failSafeUpdate rejected");
    }

    expect(res.success).toBeTruthy("returned success");
    expect((updateItemSpy as any).mock.calls.length).toBe(1);
  });
});
