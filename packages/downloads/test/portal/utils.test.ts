import { IItem } from "@esri/arcgis-rest-portal";
import { DownloadFormats } from "../../src/download-format";
import { isDownloadEnabled } from "../../src/portal/utils";

describe("isDownloadEnabled", () => {
  it("true if item and format downloads are implicitly enabled", done => {
    const item: IItem = {
      id: "id",
      owner: "owner",
      tags: ["tag"],
      created: 1000,
      modified: 2000,
      numViews: 1,
      size: 1,
      title: "title",
      type: "type"
    };

    expect(isDownloadEnabled(item, DownloadFormats.Shapefile)).toBeTruthy();
    expect(isDownloadEnabled(item, DownloadFormats.CSV)).toBeTruthy();
    expect(isDownloadEnabled(item, DownloadFormats.KML)).toBeTruthy();
    expect(isDownloadEnabled(item, DownloadFormats.GeoJson)).toBeTruthy();
    expect(isDownloadEnabled(item, DownloadFormats.Excel)).toBeTruthy();
    expect(
      isDownloadEnabled(item, DownloadFormats["File Geodatabase"])
    ).toBeTruthy();
    expect(
      isDownloadEnabled(item, DownloadFormats["Feature Collection"])
    ).toBeTruthy();
    expect(
      isDownloadEnabled(item, DownloadFormats["Scene Package"])
    ).toBeTruthy();
    done();
  });

  it("true if item download is explicitly enabled and format downloads are implicitly enabled", done => {
    const item: IItem = {
      id: "id",
      owner: "owner",
      tags: ["tag"],
      created: 1000,
      modified: 2000,
      numViews: 1,
      size: 1,
      title: "title",
      type: "type",
      properties: {
        downloadsConfig: {
          enabled: true
        }
      }
    };

    expect(isDownloadEnabled(item, DownloadFormats.Shapefile)).toBeTruthy();
    expect(isDownloadEnabled(item, DownloadFormats.CSV)).toBeTruthy();
    expect(isDownloadEnabled(item, DownloadFormats.KML)).toBeTruthy();
    expect(isDownloadEnabled(item, DownloadFormats.GeoJson)).toBeTruthy();
    expect(isDownloadEnabled(item, DownloadFormats.Excel)).toBeTruthy();
    expect(
      isDownloadEnabled(item, DownloadFormats["File Geodatabase"])
    ).toBeTruthy();
    expect(
      isDownloadEnabled(item, DownloadFormats["Feature Collection"])
    ).toBeTruthy();
    expect(
      isDownloadEnabled(item, DownloadFormats["Scene Package"])
    ).toBeTruthy();
    done();
  });

  it("true if item download is implicitly enabled and format downloads are explicitly enabled", done => {
    const item: IItem = {
      id: "id",
      owner: "owner",
      tags: ["tag"],
      created: 1000,
      modified: 2000,
      numViews: 1,
      size: 1,
      title: "title",
      type: "type",
      properties: {
        downloadsConfig: {
          formats: {
            shapefile: {
              enabled: true
            },
            csv: {
              enabled: true
            },
            kml: {
              enabled: true
            },
            geojson: {
              enabled: true
            },
            excel: {
              enabled: true
            },
            "file geodatabase": {
              enabled: true
            },
            "feature collection": {
              enabled: true
            },
            "scene package": {
              enabled: true
            }
          }
        }
      }
    };

    expect(isDownloadEnabled(item, DownloadFormats.Shapefile)).toBeTruthy();
    expect(isDownloadEnabled(item, DownloadFormats.CSV)).toBeTruthy();
    expect(isDownloadEnabled(item, DownloadFormats.KML)).toBeTruthy();
    expect(isDownloadEnabled(item, DownloadFormats.GeoJson)).toBeTruthy();
    expect(isDownloadEnabled(item, DownloadFormats.Excel)).toBeTruthy();
    expect(
      isDownloadEnabled(item, DownloadFormats["File Geodatabase"])
    ).toBeTruthy();
    expect(
      isDownloadEnabled(item, DownloadFormats["Feature Collection"])
    ).toBeTruthy();
    expect(
      isDownloadEnabled(item, DownloadFormats["Scene Package"])
    ).toBeTruthy();
    done();
  });

  it("true if item download is explicitly enabled and format downloads are explicitly enabled", done => {
    const item: IItem = {
      id: "id",
      owner: "owner",
      tags: ["tag"],
      created: 1000,
      modified: 2000,
      numViews: 1,
      size: 1,
      title: "title",
      type: "type",
      properties: {
        downloadsConfig: {
          enabled: true,
          formats: {
            shapefile: {
              enabled: true
            },
            csv: {
              enabled: true
            },
            kml: {
              enabled: true
            },
            geojson: {
              enabled: true
            },
            excel: {
              enabled: true
            },
            "file geodatabase": {
              enabled: true
            },
            "feature collection": {
              enabled: true
            },
            "scene package": {
              enabled: true
            }
          }
        }
      }
    };

    expect(isDownloadEnabled(item, DownloadFormats.Shapefile)).toBeTruthy();
    expect(isDownloadEnabled(item, DownloadFormats.CSV)).toBeTruthy();
    expect(isDownloadEnabled(item, DownloadFormats.KML)).toBeTruthy();
    expect(isDownloadEnabled(item, DownloadFormats.GeoJson)).toBeTruthy();
    expect(isDownloadEnabled(item, DownloadFormats.Excel)).toBeTruthy();
    expect(
      isDownloadEnabled(item, DownloadFormats["File Geodatabase"])
    ).toBeTruthy();
    expect(
      isDownloadEnabled(item, DownloadFormats["Feature Collection"])
    ).toBeTruthy();
    expect(
      isDownloadEnabled(item, DownloadFormats["Scene Package"])
    ).toBeTruthy();
    done();
  });

  it("false if item download is explicitly disabled and format downloads are implicitly enabled", done => {
    const item: IItem = {
      id: "id",
      owner: "owner",
      tags: ["tag"],
      created: 1000,
      modified: 2000,
      numViews: 1,
      size: 1,
      title: "title",
      type: "type",
      properties: {
        downloadsConfig: {
          enabled: false
        }
      }
    };

    expect(isDownloadEnabled(item, DownloadFormats.Shapefile)).toBeFalsy();
    expect(isDownloadEnabled(item, DownloadFormats.CSV)).toBeFalsy();
    expect(isDownloadEnabled(item, DownloadFormats.KML)).toBeFalsy();
    expect(isDownloadEnabled(item, DownloadFormats.GeoJson)).toBeFalsy();
    expect(isDownloadEnabled(item, DownloadFormats.Excel)).toBeFalsy();
    expect(
      isDownloadEnabled(item, DownloadFormats["File Geodatabase"])
    ).toBeFalsy();
    expect(
      isDownloadEnabled(item, DownloadFormats["Feature Collection"])
    ).toBeFalsy();
    expect(
      isDownloadEnabled(item, DownloadFormats["Scene Package"])
    ).toBeFalsy();
    done();
  });

  it("false if item download is explicitly disabled and format downloads are explicitly enabled", done => {
    const item: IItem = {
      id: "id",
      owner: "owner",
      tags: ["tag"],
      created: 1000,
      modified: 2000,
      numViews: 1,
      size: 1,
      title: "title",
      type: "type",
      properties: {
        downloadsConfig: {
          enabled: false,
          formats: {
            shapefile: {
              enabled: true
            },
            csv: {
              enabled: true
            },
            kml: {
              enabled: true
            },
            geojson: {
              enabled: true
            },
            excel: {
              enabled: true
            },
            "file geodatabase": {
              enabled: true
            },
            "feature collection": {
              enabled: true
            },
            "scene package": {
              enabled: true
            }
          }
        }
      }
    };

    expect(isDownloadEnabled(item, DownloadFormats.Shapefile)).toBeFalsy();
    expect(isDownloadEnabled(item, DownloadFormats.CSV)).toBeFalsy();
    expect(isDownloadEnabled(item, DownloadFormats.KML)).toBeFalsy();
    expect(isDownloadEnabled(item, DownloadFormats.GeoJson)).toBeFalsy();
    expect(isDownloadEnabled(item, DownloadFormats.Excel)).toBeFalsy();
    expect(
      isDownloadEnabled(item, DownloadFormats["File Geodatabase"])
    ).toBeFalsy();
    expect(
      isDownloadEnabled(item, DownloadFormats["Feature Collection"])
    ).toBeFalsy();
    expect(
      isDownloadEnabled(item, DownloadFormats["Scene Package"])
    ).toBeFalsy();
    done();
  });

  it("false if item download is implictly enabled and format downloads are explicitly disabled", done => {
    const item: IItem = {
      id: "id",
      owner: "owner",
      tags: ["tag"],
      created: 1000,
      modified: 2000,
      numViews: 1,
      size: 1,
      title: "title",
      type: "type",
      properties: {
        downloadsConfig: {
          formats: {
            shapefile: {
              enabled: true
            },
            csv: {
              enabled: false
            },
            kml: {
              enabled: true
            },
            geojson: {
              enabled: false
            },
            excel: {
              enabled: true
            },
            "file geodatabase": {
              enabled: false
            },
            "feature collection": {
              enabled: true
            },
            "scene package": {
              enabled: false
            }
          }
        }
      }
    };

    expect(isDownloadEnabled(item, DownloadFormats.Shapefile)).toBeTruthy();
    expect(isDownloadEnabled(item, DownloadFormats.CSV)).toBeFalsy();
    expect(isDownloadEnabled(item, DownloadFormats.KML)).toBeTruthy();
    expect(isDownloadEnabled(item, DownloadFormats.GeoJson)).toBeFalsy();
    expect(isDownloadEnabled(item, DownloadFormats.Excel)).toBeTruthy();
    expect(
      isDownloadEnabled(item, DownloadFormats["File Geodatabase"])
    ).toBeFalsy();
    expect(
      isDownloadEnabled(item, DownloadFormats["Feature Collection"])
    ).toBeTruthy();
    expect(
      isDownloadEnabled(item, DownloadFormats["Scene Package"])
    ).toBeFalsy();
    done();
  });

  it("false if item download is explicitly enabled and format downloads are explicitly disabled", done => {
    const item: IItem = {
      id: "id",
      owner: "owner",
      tags: ["tag"],
      created: 1000,
      modified: 2000,
      numViews: 1,
      size: 1,
      title: "title",
      type: "type",
      properties: {
        downloadsConfig: {
          enabled: true,
          formats: {
            shapefile: {
              enabled: false
            },
            csv: {
              enabled: true
            },
            kml: {
              enabled: false
            },
            geojson: {
              enabled: true
            },
            excel: {
              enabled: false
            },
            "file geodatabase": {
              enabled: true
            },
            "feature collection": {
              enabled: false
            },
            "scene package": {
              enabled: true
            }
          }
        }
      }
    };

    expect(isDownloadEnabled(item, DownloadFormats.Shapefile)).toBeFalsy();
    expect(isDownloadEnabled(item, DownloadFormats.CSV)).toBeTruthy();
    expect(isDownloadEnabled(item, DownloadFormats.KML)).toBeFalsy();
    expect(isDownloadEnabled(item, DownloadFormats.GeoJson)).toBeTruthy();
    expect(isDownloadEnabled(item, DownloadFormats.Excel)).toBeFalsy();
    expect(
      isDownloadEnabled(item, DownloadFormats["File Geodatabase"])
    ).toBeTruthy();
    expect(
      isDownloadEnabled(item, DownloadFormats["Feature Collection"])
    ).toBeFalsy();
    expect(
      isDownloadEnabled(item, DownloadFormats["Scene Package"])
    ).toBeTruthy();
    done();
  });
});
