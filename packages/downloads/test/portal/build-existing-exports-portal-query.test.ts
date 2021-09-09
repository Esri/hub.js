import { buildExistingExportsPortalQuery } from "../../src";

describe("buildExistingExportsPortalQuery", () => {
  it("builds query", () => {
    const q = buildExistingExportsPortalQuery("123456789_0", {
      formats: [
        "CSV Collection",
        "KML Collection",
        "Shapefile",
        "File Geodatabase",
        "GeoJson",
        "Microsoft Excel",
        "Feature Collection",
      ],
      spatialRefId: "1234",
    });

    expect(q).toEqual(
      'typekeywords:exportItem:123456789 AND typekeywords:exportLayer:00 AND (type:"CSV Collection" OR type:"KML Collection" OR type:Shapefile OR type:"File Geodatabase" OR type:GeoJson OR type:"Microsoft Excel" OR type:"Feature Collection") AND spatialRefId:1234'
    );
  });
});
