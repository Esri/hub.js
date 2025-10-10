import { convertToHubFormat } from "../../src/hub/format-converter";
describe("hub-format-converter", () => {
  it("converts CSV to csv", () => {
    const result = convertToHubFormat("CSV");
    expect(result).toEqual("csv");
  });
  it("converts KML to kml", () => {
    const result = convertToHubFormat("KML");
    expect(result).toEqual("kml");
  });
  it("converts Shapefile to shp", () => {
    const result = convertToHubFormat("Shapefile");
    expect(result).toEqual("shp");
  });
  it("converts File Geodatabase to fgdb", () => {
    const result = convertToHubFormat("File Geodatabase");
    expect(result).toEqual("fgdb");
  });
  it("converts GeoJson to geojson", () => {
    const result = convertToHubFormat("GeoJson");
    expect(result).toEqual("geojson");
  });
  it("should throw error on unsupported type", () => {
    try {
      convertToHubFormat("Excel");
    } catch (error) {
      expect(error).toEqual(
        new Error("Unsupported Hub download format: Excel")
      );
    }
  });
});
