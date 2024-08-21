import { getDownloadConfigurationDisplayFormats } from "../../src/downloads/_internal/getDownloadConfigurationDisplayFormats";

describe("getDownloadConfigurationDisplayFormats", () => {
  it("should return download configuration display formats for a feature service", () => {
    const entity = {
      access: "public",
      type: "Feature Service",
      url: "https://services.arcgis.com/123456/arcgis/rest/services/MyService/FeatureServer",
      typeKeywords: [
        "ArcGIS Server",
        "Data",
        "Feature Access",
        "Feature Service",
        "Metadata",
        "Service",
        "Singlelayer",
        "Hosted Service",
      ],
      schedule: {
        mode: "automatic",
      },
      extendedProps: {
        kind: "service",
        downloads: {
          hosted: false,
        },
        additionalResources: [
          {
            url: "withheld",
            isDataSource: false,
          },
          {
            url: "withheld",
            isDataSource: true,
          },
        ],
        serverQueryCapability: true,
        serverExtractCapability: true,
        serverExtractFormats: [
          "csv",
          "shapefile",
          "sqlite",
          "geoPackage",
          "filegdb",
          "featureCollection",
          "geojson",
          "kml",
          "excel",
        ],
      },
      serverQueryCapability: true,
      serverExtractCapability: true,
      serverExtractFormats: [
        "csv",
        "shapefile",
        "sqlite",
        "geoPackage",
        "filegdb",
        "featureCollection",
        "geojson",
        "kml",
        "excel",
      ],
      additionalResources: [
        {
          url: "withheld",
          isDataSource: false,
        },
        {
          url: "withheld",
          isDataSource: true,
        },
      ],
    } as any;

    const result = getDownloadConfigurationDisplayFormats(entity);
    expect(result).toEqual([
      {
        label: "{{shared.fields.download.format.csv:translate}}",
        key: "csv",
        hidden: false,
      },
      {
        label: "{{shared.fields.download.format.shapefile:translate}}",
        key: "shapefile",
        hidden: false,
      },
      {
        label: "{{shared.fields.download.format.geojson:translate}}",
        key: "geojson",
        hidden: false,
      },
      {
        label: "{{shared.fields.download.format.kml:translate}}",
        key: "kml",
        hidden: false,
      },
      {
        label: "{{shared.fields.download.format.filegdb:translate}}",
        key: "filegdb",
        hidden: false,
      },
      {
        label: "{{shared.fields.download.format.featureCollection:translate}}",
        key: "featureCollection",
        hidden: false,
      },
      {
        label: "{{shared.fields.download.format.excel:translate}}",
        key: "excel",
        hidden: false,
      },
      {
        label: "{{shared.fields.download.format.geoPackage:translate}}",
        key: "geoPackage",
        hidden: false,
      },
      {
        label: "{{shared.fields.download.format.sqlite:translate}}",
        key: "sqlite",
        hidden: false,
      },
      {
        label: "{{shared.fields.download.noTitle:translate}}",
        key: "additionalResource::0",
        hidden: false,
      },
      {
        label: "{{shared.fields.download.dataSource:translate}}",
        key: "additionalResource::1",
        hidden: false,
      },
    ]);
  });

  it("should return paging download configuration display formats for feature service", () => {
    const entity = {
      access: "public",
      type: "Feature Service",
      url: "https://services.arcgis.com/123456/arcgis/rest/services/MyService/FeatureServer",
      typeKeywords: [
        "ArcGIS Server",
        "Data",
        "Feature Access",
        "Feature Service",
        "Metadata",
        "Service",
        "Singlelayer",
        "Hosted Service",
      ],
      schedule: {
        mode: "automatic",
      },
      extendedProps: {
        kind: "service",
        additionalResources: [
          {
            url: "withheld",
            isDataSource: true,
          },
        ],
        downloads: {
          hosted: false,
        },
        serverQueryCapability: false,
        serverExtractCapability: false,
        serverExtractFormats: [
          "csv",
          "shapefile",
          "sqlite",
          "geoPackage",
          "filegdb",
          "featureCollection",
          "geojson",
          "kml",
          "excel",
        ],
      },
      serverQueryCapability: false,
      serverExtractCapability: false,
      serverExtractFormats: [
        "csv",
        "shapefile",
        "sqlite",
        "geoPackage",
        "filegdb",
        "featureCollection",
        "geojson",
        "kml",
        "excel",
      ],
      additionalResources: [
        {
          url: "withheld",
          isDataSource: false,
        },
        {
          url: "withheld",
          isDataSource: true,
        },
      ],
    } as any;

    const result = getDownloadConfigurationDisplayFormats(entity);
    expect(result).toEqual([
      {
        label: "{{shared.fields.download.format.csv:translate}}",
        key: "csv",
        hidden: false,
      },
      {
        label: "{{shared.fields.download.format.shapefile:translate}}",
        key: "shapefile",
        hidden: false,
      },
      {
        label: "{{shared.fields.download.format.geojson:translate}}",
        key: "geojson",
        hidden: false,
      },
      {
        label: "{{shared.fields.download.format.kml:translate}}",
        key: "kml",
        hidden: false,
      },
      {
        label: "{{shared.fields.download.format.filegdb:translate}}",
        key: "filegdb",
        hidden: false,
      },
      {
        label: "{{shared.fields.download.format.featureCollection:translate}}",
        key: "featureCollection",
        hidden: false,
      },
      {
        label: "{{shared.fields.download.format.excel:translate}}",
        key: "excel",
        hidden: false,
      },
      {
        label: "{{shared.fields.download.format.geoPackage:translate}}",
        key: "geoPackage",
        hidden: false,
      },
      {
        label: "{{shared.fields.download.format.sqlite:translate}}",
        key: "sqlite",
        hidden: false,
      },
    ]);
  });
});
