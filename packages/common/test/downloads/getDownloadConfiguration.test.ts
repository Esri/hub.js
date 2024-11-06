import { getDownloadConfiguration } from "../../src/downloads/getDownloadConfiguration";
import { IHubEditableContent } from "../../src/core/types/IHubEditableContent";

describe("getDownloadConfiguration", () => {
  it("should return the current download configuration for the entity using createReplica", () => {
    const entity: IHubEditableContent = {
      id: "123",
      name: "Test Entity",
      type: "Feature Service",
      url: "https://services.arcgis.com/orgid/arcgis/rest/services/ServiceName/FeatureServer/0",
      serverExtractCapability: true,
      extendedProps: {
        downloads: {
          flowType: "createReplica",
          formats: [
            {
              key: "filegdb",
              hidden: false,
            },
          ],
        },
        additionalResources: [
          { name: "Resource 1", url: "resource-1-url" },
          { name: "Resource 2", url: "resource-2-url" },
        ],
        kind: "content",
      },
    } as any as IHubEditableContent;
    const downloadConfig = getDownloadConfiguration(entity);
    expect(downloadConfig).toEqual({
      flowType: "createReplica",
      formats: [
        {
          key: "additionalResource::0",
          hidden: false,
        },
        {
          key: "additionalResource::1",
          hidden: false,
        },
      ],
    });
  });

  it("should return the current download configuration for the entity using paging", () => {
    const entity: IHubEditableContent = {
      url: "https://www.arcgis.com/arcgis/rest/services/Hosted/FeatureServer/0",
      serverExtractCapability: false,
      serverQueryCapability: true,
      access: "public",
    } as any as IHubEditableContent;
    const downloadConfig = getDownloadConfiguration(entity);
    expect(downloadConfig).toEqual({
      flowType: "paging",
      formats: [
        {
          key: "csv",
          hidden: false,
        },
        {
          key: "shapefile",
          hidden: false,
        },
        {
          key: "geojson",
          hidden: false,
        },
        {
          key: "kml",
          hidden: false,
        },
      ],
    });
  });

  it("should return the current download configuration for the entity using fgdb", () => {
    const entity: IHubEditableContent = {
      url: "https://www.self-hosted-server.com/arcgis/rest/services/Hosted/FeatureServer/0",
      extendedProps: {
        serverExtractCapability: true,
      },
      serverQueryCapability: true,
      access: "public",
    } as any as IHubEditableContent;
    const downloadConfig = getDownloadConfiguration(entity);
    expect(downloadConfig).toEqual({
      flowType: "fgdb",
      formats: [
        {
          key: "csv",
          hidden: false,
        },
        {
          key: "shapefile",
          hidden: false,
        },
        {
          key: "geojson",
          hidden: false,
        },
        {
          key: "kml",
          hidden: false,
        },
        {
          key: "filegdb",
          hidden: false,
        },
      ],
    });
  });

  it("should return the current download configuration for the entity using exportImage", () => {
    const entity: IHubEditableContent = {
      id: "123",
      name: "Test Entity",
      type: "Image Service",
      keywords: ["Tiled Imagery"],
      url: "https://services.arcgis.com/orgid/arcgis/rest/services/ServiceName/FeatureServer/0",
      serverExtractCapability: false,
      access: "public",
    } as any as IHubEditableContent;
    const downloadConfig = getDownloadConfiguration(entity);
    expect(downloadConfig).toEqual({
      flowType: "exportImage",
      formats: [
        {
          key: "jpg",
          hidden: false,
        },
        {
          key: "png",
          hidden: false,
        },
        {
          key: "png8",
          hidden: false,
        },
        {
          key: "png24",
          hidden: false,
        },
      ],
    });
  });
});
