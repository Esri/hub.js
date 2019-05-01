import { collection } from "../../../../src/ago/helpers/filters/collection";

describe("collection test", () => {
  it("collection filter should return correct type filter", () => {
    const queryFilters = {
      collection: {
        terms: ["Dataset", "Document"],
        fn: "any"
      }
    };
    const expected =
      '(type:"CSV Collection" OR type:"CSV" OR type:"Feature Collection Template" OR type:"Feature Collection" OR type:"Feature Layer" OR type:"Feature Service" OR type:"File Geodatabase" OR type:"GeoJSON" OR type:"GeoJson" OR type:"KML Collection" OR type:"KML" OR type:"Microsoft Excel" OR type:"Raster Layer" OR type:"Shapefile" OR type:"Stream Service" OR type:"Table" OR type:"CAD Drawing" OR type:"Document Link" OR type:"Hub Page" OR type:"Image" OR type:"iWork Keynote" OR type:"iWork Numbers" OR type:"iWork Pages" OR type:"Microsoft Powerpoint" OR type:"Microsoft Visio" OR type:"Microsoft Word" OR type:"PDF" OR type:"Pro Map" OR type:"Report Template")';
    expect(collection(queryFilters)).toBe(expected);
  });
});
