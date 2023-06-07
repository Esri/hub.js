import { IItem } from "@esri/arcgis-rest-portal";
import { getItemIdentifier } from "../../src";

describe("getItemIdentifier:", () => {
  it("returns id by default", () => {
    const item = {
      id: "3ef",
    } as unknown as IItem;
    expect(getItemIdentifier(item)).toBe("3ef");
  });
  it("returns slug if defined", () => {
    const item = {
      id: "3ef",
      properties: {
        slug: "myorg|the-slug",
      },
    } as unknown as IItem;
    expect(getItemIdentifier(item)).toBe("myorg::the-slug");
  });
});
