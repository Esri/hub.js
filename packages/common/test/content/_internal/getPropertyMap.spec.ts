import { describe, it, expect, vi, afterEach } from "vitest";
import { getPropertyMap } from "../../../src/content/_internal/getPropertyMap";
import * as getBasePropertyMapModule from "../../../src/core/_internal/getBasePropertyMap";

describe("getPropertyMap for content entity", () => {
  afterEach(() => vi.restoreAllMocks());
  it("returns an array of property mappings including content-specific keys", () => {
    const map = getPropertyMap();
    // Should be an array
    expect(Array.isArray(map)).toBe(true);

    // Should include permissions mapping
    expect(map.find((m) => m.entityKey === "permissions")).toEqual({
      entityKey: "permissions",
      storeKey: "data.permissions",
    });

    // Should include licenseInfo mapping
    expect(map.find((m) => m.entityKey === "licenseInfo")).toEqual({
      entityKey: "licenseInfo",
      storeKey: "item.licenseInfo",
    });

    // Should include size mapping
    expect(map.find((m) => m.entityKey === "size")).toEqual({
      entityKey: "size",
      storeKey: "item.size",
    });

    // Should include view mapping to item.properties.view
    expect(map.find((m) => m.entityKey === "view")).toEqual({
      entityKey: "view",
      storeKey: "item.properties.view",
    });
  });

  it("adds view mapping if not present in base property map", () => {
    vi.spyOn(getBasePropertyMapModule, "getBasePropertyMap").mockReturnValue(
      [] as any
    );

    const map = getPropertyMap();
    const view = map.find((m) => m.entityKey === "view");
    expect(view).toEqual({
      entityKey: "view",
      storeKey: "item.properties.view",
    });
  });
});
