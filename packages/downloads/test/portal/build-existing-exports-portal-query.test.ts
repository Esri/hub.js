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

  it("builds query with no formats", () => {
    const q = buildExistingExportsPortalQuery("123456789_0", {
      spatialRefId: "1234",
    });

    expect(q).toEqual(
      'typekeywords:exportItem:123456789 AND typekeywords:exportLayer:00 AND spatialRefId:1234'
    );
  });

  it("builds query with no spatialRefId", () => {
    const q = buildExistingExportsPortalQuery("123456789_0", {
      formats: ['CSV Collection']
    });

    expect(q).toEqual(
      'typekeywords:exportItem:123456789 AND typekeywords:exportLayer:00 AND (type:"CSV Collection")'
    );
  });

  it("builds query with no formats or spatial ref ID", () => {
    const q = buildExistingExportsPortalQuery("123456789_3");

    expect(q).toEqual(
      'typekeywords:exportItem:123456789 AND typekeywords:exportLayer:03'
    );
  });

  it("builds query with no layer ID", () => {
    const q = buildExistingExportsPortalQuery("123456789");

    expect(q).toEqual(
      'typekeywords:exportItem:123456789 AND typekeywords:exportLayer:null'
    );
  });
});
