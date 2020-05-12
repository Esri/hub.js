import { _ensureTypeAndTags } from "../src";
import { IModel } from "@esri/hub-common";
import { IItem } from "@esri/arcgis-rest-types";

describe("_ensureTypeAndTags", () => {
  it("adds type and tags when not present", () => {
    const model = { item: {} } as IModel;

    expect(_ensureTypeAndTags(model, false)).toEqual({
      item: {
        type: "Hub Site Application",
        typeKeywords: ["hubSite"]
      } as IItem
    });
  });

  it("adds type but leaves tags alone when present", () => {
    const model = {
      item: {
        type: "Foo Bar",
        typeKeywords: ["hubSite"]
      }
    } as IModel;

    expect(_ensureTypeAndTags(model, false)).toEqual({
      item: {
        type: "Hub Site Application",
        typeKeywords: ["hubSite"]
      } as IItem
    });
  });
});
