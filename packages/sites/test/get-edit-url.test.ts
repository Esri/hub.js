import { getSiteEditUrl } from "../src";
import { IItem } from "@esri/arcgis-rest-types";

describe("getEditUrl", () => {
  it("gets the edit url for a site item", () => {
    expect(getSiteEditUrl({ url: "foobar" } as IItem)).toBe("foobar/edit");
  });
});
