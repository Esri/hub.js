import { IItem } from "@esri/arcgis-rest-types";
import { isDownloadable } from "../src/categories";

describe("isDownloadable", () => {
  const getModel = (type: string, typeKeywords: string[] = []) => {
    const item = {
      type,
      typeKeywords
    } as IItem;
    return item;
  };

  it("returns true for downloadable item type", () => {
    const mockItem = getModel("GeoJson");
    expect(isDownloadable(mockItem)).toBe(true);
  });
  it("returns false for non-downloadable item type without typekeyword", () => {
    const mockItem = getModel("Web Mapping Application", ["map"]);
    expect(isDownloadable(mockItem)).toBe(false);
  });
  it("returns true for non-downloadable item type with 'Data' typekeyword", () => {
    const mockItem = getModel("Web Mapping Application", ["Data"]);
    expect(isDownloadable(mockItem)).toBe(true);
  });
});
