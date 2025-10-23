import {
  describe,
  it,
  expect,
} from "vitest";
import { IItem } from "@esri/arcgis-rest-portal";
import { getItemIdentifier } from "../../src/items/getItemIdentifier";

describe("getItemIdentifier:", () => {
  const item = {
    id: "3ef",
  } as unknown as IItem;
  const properties = {
    slug: "myorg|the-slug",
  };
  const itemWithSlug = { ...item, properties };
  it("returns id by default", () => {
    expect(getItemIdentifier(item)).toBe("3ef");
  });
  it("returns slug if defined", () => {
    expect(getItemIdentifier(itemWithSlug)).toBe("myorg::the-slug");
  });
  it("injects id into slug if requested", () => {
    expect(getItemIdentifier(itemWithSlug, true)).toBe("the-slug~3ef");
  });
});
