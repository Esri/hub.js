import * as getModelModule from "../../src/models";
import { getModelFromOptions } from "../../src";

describe("getModelFromOptions", function () {
  const itemIdFromOptions = "item-id-from-options";
  const itemIdFromApi = "item-id-from-api";
  it("returns model when provided", async function () {
    const options = {
      itemModel: {
        item: {
          id: itemIdFromOptions,
        },
        data: {},
      },
    };

    const getModelSpy = spyOn(getModelModule, "getModel").and.returnValue(
      Promise.resolve({
        item: {
          id: itemIdFromApi,
        },
        data: {},
      })
    );

    const result = await getModelFromOptions("item", options);

    expect(getModelSpy.calls.count()).toBe(0, "getModel not called");
    expect(result.item.id).toBe(itemIdFromOptions, "correct model returned");
  });

  it("fetches model when id provided", async function () {
    const options = {
      itemId: itemIdFromApi,
    };

    const getModelSpy = spyOn(getModelModule, "getModel").and.returnValue(
      Promise.resolve({
        item: {
          id: itemIdFromApi,
        },
        data: {},
      })
    );

    const result = await getModelFromOptions("item", options);

    expect(getModelSpy.calls.count()).toBe(1, "getModel called");
    expect(result.item.id).toBe(itemIdFromApi, "correct model returned");
  });

  it("throws when neither id nor model provided", async function () {
    const options = {};

    const getModelSpy = spyOn(getModelModule, "getModel").and.returnValue(
      Promise.resolve({
        item: {
          id: itemIdFromApi,
        },
        data: {},
      })
    );

    expect(() => getModelFromOptions("item", options)).toThrowError();
    expect(getModelSpy.calls.count()).toBe(0, "getModel NOT called");
  });
});
