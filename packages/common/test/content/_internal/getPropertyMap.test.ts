import { getPropertyMap } from "../../../src/content/_internal/getPropertyMap";
import * as getBasePropertyMapModule from "../../../src/core/_internal/getBasePropertyMap";

describe("getPropertyMap for content entity", () => {
  it("returns an array of property mappings including content-specific keys", () => {
    const map = getPropertyMap();
    // Should be an array
    expect(Array.isArray(map)).toBe(true);

    // Should include permissions mapping
    expect(map).toContain(
      jasmine.objectContaining({
        entityKey: "permissions",
        storeKey: "data.permissions",
      })
    );

    // Should include licenseInfo mapping
    expect(map).toContain(
      jasmine.objectContaining({
        entityKey: "licenseInfo",
        storeKey: "item.licenseInfo",
      })
    );

    // Should include size mapping
    expect(map).toContain(
      jasmine.objectContaining({ entityKey: "size", storeKey: "item.size" })
    );

    // Should include view mapping to item.properties.view
    expect(map).toContain(
      jasmine.objectContaining({
        entityKey: "view",
        storeKey: "item.properties.view",
      })
    );
  });

  it("adds view mapping if not present in base property map", () => {
    spyOn(getBasePropertyMapModule, "getBasePropertyMap").and.returnValue([]);

    const map = getPropertyMap();
    expect(map).toContain(
      jasmine.objectContaining({
        entityKey: "view",
        storeKey: "item.properties.view",
      })
    );
  });
});
