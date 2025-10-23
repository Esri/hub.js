import { getModelFromOptions } from "../../src/items/get-model-from-options";
import * as getModelModule from "../../src/models/getModel";
import { afterEach, describe, expect, it, vi } from "vitest";

describe("getModelFromOptions", function () {
  afterEach(() => vi.restoreAllMocks());
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
    } as any;

    const getModelSpy = vi
      .spyOn(getModelModule as any, "getModel")
      .mockResolvedValue({
        item: { id: itemIdFromApi },
        data: {},
      } as any);

    const result = await getModelFromOptions("item", options);

    expect(getModelSpy).toHaveBeenCalledTimes(0);
    expect(result.item.id).toBe(itemIdFromOptions);
  });

  it("fetches model when id provided", async function () {
    const options = {
      itemId: itemIdFromApi,
    } as any;

    const getModelSpy = vi
      .spyOn(getModelModule as any, "getModel")
      .mockResolvedValue({
        item: { id: itemIdFromApi },
        data: {},
      } as any);

    const result = await getModelFromOptions("item", options);

    expect(getModelSpy).toHaveBeenCalledTimes(1);
    expect(result.item.id).toBe(itemIdFromApi);
  });

  it("throws when neither id nor model provided", async function () {
    const options = {} as any;

    const getModelSpy = vi
      .spyOn(getModelModule as any, "getModel")
      .mockResolvedValue({
        item: { id: itemIdFromApi },
        data: {},
      } as any);

    expect(() => getModelFromOptions("item", options)).toThrowError();
    expect(getModelSpy).toHaveBeenCalledTimes(0);
  });
});
