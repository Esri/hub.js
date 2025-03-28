import { getSiteEditUrl } from "../src";
import type { IItem } from "@esri/arcgis-rest-portal";

describe("getEditUrl", () => {
  it("gets the edit url for a site item", () => {
    expect(getSiteEditUrl({ url: "foobar" } as IItem)).toBe("foobar/edit");
  });
});
