import { getEditUrl } from "../src";
import { IItem } from "@esri/arcgis-rest-types";

describe("getEditUrl", () => {
  it("gets the edit url for a site item", () => {
    expect(getEditUrl({ url: "foobar" } as IItem)).toBe("foobar/edit");
  });
});
