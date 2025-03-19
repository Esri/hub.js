import { getDownloadFormats } from "../../src/downloads/getDownloadFormats";
import {
  IFetchDownloadFormatsOptions,
  ServiceDownloadFormat,
} from "../../src/downloads/types";
import * as CanUseExportImageFlowModule from "../../src/downloads/_internal/canUseExportImageFlow";
import * as CanUseHubDownloadApiModule from "../../src/downloads/canUseHubDownloadApi";
import * as GetHubDownloadApiFormatsModule from "../../src/downloads/getHubDownloadApiFormats";
import * as GetExportImageFormatsModule from "../../src/downloads/_internal/format-fetchers/getExportImageFormats";

describe("getDownloadFormats", () => {
  it("should return empty array", () => {
    const options: IFetchDownloadFormatsOptions = {
      entity: {
        id: "123",
        name: "Test Entity",
        type: "Feature Service",
        url: "https://services.arcgis.com/orgid/arcgis/rest/services/ServiceName/FeatureServer/0",
        serverExtractCapability: true,
        severQueryCapability: false,
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
          kind: "content",
        },
      },
      context: {
        serviceStatus: {
          "hub-downloads": "not-available",
        },
      },
    } as any as IFetchDownloadFormatsOptions;
    const result = getDownloadFormats(options);
    expect(result).toEqual([]);
  });

  it("should get base formats from getHubDownloadApiFormats", () => {
    const getHubDownloadApiFormatsSpy = spyOn(
      GetHubDownloadApiFormatsModule,
      "getHubDownloadApiFormats"
    ).and.callThrough();
    const canUseHubDownloadApiSpy = spyOn(
      CanUseHubDownloadApiModule,
      "canUseHubDownloadApi"
    ).and.callThrough();
    const options: IFetchDownloadFormatsOptions = {
      entity: {
        id: "123",
        name: "Test Entity",
        type: "Feature Service",
        url: "https://services.arcgis.com/orgid/arcgis/rest/services/ServiceName/FeatureServer/0",
        serverExtractCapability: true,
        serverExtractFormats: [
          // Out of order
          ServiceDownloadFormat.FILE_GDB,
          ServiceDownloadFormat.CSV,
        ],
        extendedProps: {
          downloads: {
            flowType: "createReplica",
            formats: [
              {
                key: "filegdb",
                hidden: false,
              },
              {
                key: "csv",
                hidden: true,
              },
            ],
          },
          additionalResources: [
            { name: "Resource 1", url: "resource-1-url" },
            { name: "Resource 2", url: "resource-2-url" },
            { isDataSource: true },
            { url: "resource-4-url" },
          ],
          kind: "content",
        },
      },
      context: {
        serviceStatus: {
          "hub-downloads": "online",
        },
      },
    } as any as IFetchDownloadFormatsOptions;
    const result = getDownloadFormats(options);
    expect(canUseHubDownloadApiSpy).toHaveBeenCalled();
    expect(getHubDownloadApiFormatsSpy).toHaveBeenCalled();
    expect(result).toEqual([
      {
        type: "dynamic",
        format: "filegdb",
      },
      {
        type: "static",
        label: "Resource 1",
        url: "resource-1-url",
      },
      {
        type: "static",
        label: "Resource 2",
        url: "resource-2-url",
      },
      {
        type: "static",
        label: "{{dataSource:translate}}",
        url: undefined,
      },
      {
        type: "static",
        label: "{{noTitle:translate}}",
        url: "resource-4-url",
      },
    ] as any);
  });

  it("should get base formats from getExportImageFormats", () => {
    const getExportImageFormatsSpy = spyOn(
      GetExportImageFormatsModule,
      "getExportImageFormats"
    ).and.callThrough();
    const canUseExportImageFlowSpy = spyOn(
      CanUseExportImageFlowModule,
      "canUseExportImageFlow"
    ).and.callThrough();
    const options: IFetchDownloadFormatsOptions = {
      entity: {
        id: "123",
        name: "Test Entity",
        type: "Image Service",
        keywords: ["Tiled Imagery"],
        url: "https://services.arcgis.com/orgid/arcgis/rest/services/ServiceName/FeatureServer/0",
        serverExtractCapability: true,
        extendedProps: {
          downloads: {
            flowType: "exportImage",
            formats: [
              {
                key: "jpg",
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
      },
      context: {
        serviceStatus: {
          "hub-downloads": "offline",
        },
      },
    } as any as IFetchDownloadFormatsOptions;
    const result = getDownloadFormats(options);
    expect(canUseExportImageFlowSpy).toHaveBeenCalled();
    expect(getExportImageFormatsSpy).toHaveBeenCalled();
    expect(result).toEqual([
      {
        type: "static",
        label: "Resource 1",
        url: "resource-1-url",
      },
      {
        type: "static",
        label: "Resource 2",
        url: "resource-2-url",
      },
    ] as any);
  });
});
