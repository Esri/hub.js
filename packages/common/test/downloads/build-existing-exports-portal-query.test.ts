import {
  buildExistingExportsPortalQuery,
  getExportItemTypeKeyword,
  getExportLayerTypeKeyword,
  getSpatialRefTypeKeyword,
  serializeSpatialReference,
} from "../../src";

describe("buildExistingExportsPortalQuery", () => {
  it("builds query with no options", () => {
    const q = buildExistingExportsPortalQuery("123456789");

    expect(q).toEqual(
      '(typekeywords:"exportItem:123456789" AND typekeywords:"exportLayer:null") AND ( (type:"CSV" AND typekeywords:"spatialRefId:4326") OR  (type:"CSV Collection" AND typekeywords:"spatialRefId:4326") OR  (type:"KML" AND typekeywords:"spatialRefId:4326") OR  (type:"KML Collection" AND typekeywords:"spatialRefId:4326") OR  (type:"Shapefile" AND typekeywords:"spatialRefId:4326") OR  (type:"File Geodatabase" AND typekeywords:"spatialRefId:4326") OR  (type:"GeoJson" AND typekeywords:"spatialRefId:4326") OR  (type:"Microsoft Excel" AND typekeywords:"spatialRefId:4326") OR  (type:"Feature Collection" AND typekeywords:"spatialRefId:4326"))'
    );
  });

  it("builds query with layerId", () => {
    const q = buildExistingExportsPortalQuery("123456789", {
      layerId: 2,
    });

    expect(q).toEqual(
      '(typekeywords:"exportItem:123456789" AND typekeywords:"exportLayer:02") AND ( (type:"CSV" AND typekeywords:"spatialRefId:4326") OR  (type:"CSV Collection" AND typekeywords:"spatialRefId:4326") OR  (type:"KML" AND typekeywords:"spatialRefId:4326") OR  (type:"KML Collection" AND typekeywords:"spatialRefId:4326") OR  (type:"Shapefile" AND typekeywords:"spatialRefId:4326") OR  (type:"File Geodatabase" AND typekeywords:"spatialRefId:4326") OR  (type:"GeoJson" AND typekeywords:"spatialRefId:4326") OR  (type:"Microsoft Excel" AND typekeywords:"spatialRefId:4326") OR  (type:"Feature Collection" AND typekeywords:"spatialRefId:4326"))'
    );
  });

  it("scopes query to only some types", () => {
    const q = buildExistingExportsPortalQuery("123456789", {
      layerId: 2,
      onlyTypes: ["CSV Collection", "KML Collection"],
    });

    expect(q).toEqual(
      '(typekeywords:"exportItem:123456789" AND typekeywords:"exportLayer:02") AND ( (type:"CSV Collection" AND typekeywords:"spatialRefId:4326") OR  (type:"KML Collection" AND typekeywords:"spatialRefId:4326"))'
    );
  });

  it("applies spatialRefId selectively based on export type projection support", () => {
    const q = buildExistingExportsPortalQuery("123456789", {
      layerId: 2,
      onlyTypes: ["CSV Collection", "KML Collection"],
      spatialRefId: "10200",
    });

    expect(q).toEqual(
      '(typekeywords:"exportItem:123456789" AND typekeywords:"exportLayer:02") AND ( (type:"CSV Collection" AND typekeywords:"spatialRefId:10200") OR  (type:"KML Collection" AND typekeywords:"spatialRefId:4326"))'
    );
  });
});

describe("serializeSpatialReference", () => {
  it("serializes reference with WKID", () => {
    expect(serializeSpatialReference({ latestWkid: 9393, wkid: 1234 })).toEqual(
      "1234"
    );

    expect(serializeSpatialReference({ wkid: 939393 })).toEqual("939393");
  });

  it("serializes reference with WKT", () => {
    expect(
      serializeSpatialReference({
        latestWkid: 9393,
        wkt: "this is probably a custom spatial reference",
      })
    ).toEqual("dGhpcyBpcyBwcm9iYWJseSBhIGN1c3RvbSBzcGF0aWFsIHJlZmVyZW5jZQ==");

    expect(
      serializeSpatialReference({
        wkt: "this is probably a custom spatial reference",
      })
    ).toEqual("dGhpcyBpcyBwcm9iYWJseSBhIGN1c3RvbSBzcGF0aWFsIHJlZmVyZW5jZQ==");
  });
});

describe("Generating typeKeywords", () => {
  it("item", () => {
    expect(getExportItemTypeKeyword("1234")).toEqual("exportItem:1234");
  });

  it("layer", () => {
    expect(getExportLayerTypeKeyword(2)).toEqual("exportLayer:02");
    expect(getExportLayerTypeKeyword("")).toEqual(`exportLayer:null`);
    expect(getExportLayerTypeKeyword()).toEqual(`exportLayer:null`);
  });

  it("spatial reference", () => {
    expect(
      getSpatialRefTypeKeyword(JSON.stringify({ latestWkid: 9393, wkid: 1234 }))
    ).toEqual("spatialRefId:1234");
  });
});
