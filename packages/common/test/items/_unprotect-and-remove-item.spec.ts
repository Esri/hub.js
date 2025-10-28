// make ESM namespace spyable
vi.mock("@esri/arcgis-rest-portal", async (importOriginal: any) => {
  const mod = await importOriginal();
  return Object.assign({}, mod, {
    unprotectItem: vi.fn(),
    removeItem: vi.fn(),
  });
});

import * as portal from "@esri/arcgis-rest-portal";
import { mockUserSession } from "../test-helpers/fake-user-session";
import { _unprotectAndRemoveItem } from "../../src/items/_unprotect-and-remove-item";
import { afterEach, describe, expect, it, vi } from "vitest";

describe("_unprotectAndRemoveItem", function () {
  afterEach(() => vi.restoreAllMocks());

  it("unprotects and removes a group", async function () {
    const unprotectItemSpy = vi
      .spyOn(portal as any, "unprotectItem")
      .mockResolvedValue({ success: true } as any);
    const removeItemSpy = vi
      .spyOn(portal as any, "removeItem")
      .mockResolvedValue({ success: true } as any);

    const res = await _unprotectAndRemoveItem({
      id: "foo-baz",
      authentication: mockUserSession,
    } as any);

    expect(res.success).toBeTruthy();
    expect(unprotectItemSpy).toHaveBeenCalledTimes(1);
    expect(removeItemSpy).toHaveBeenCalledTimes(1);
  });

  it("is impervious to failures", async function () {
    vi.spyOn(portal as any, "unprotectItem").mockRejectedValue(undefined);
    vi.spyOn(portal as any, "removeItem").mockRejectedValue(undefined);

    let res;
    try {
      res = await _unprotectAndRemoveItem({
        id: "foo-baz",
        authentication: mockUserSession,
      } as any);
    } catch (_) {
      throw new Error("function rejected");
    }

    expect(res.success).toBeTruthy();
  });
});
