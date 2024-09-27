import * as requestModule from "@esri/arcgis-rest-request";
import {
  DownloadOperationStatus,
  IFetchDownloadFileOptions,
  ServiceDownloadFormat,
} from "../../../../src/downloads/types";
import { fetchExportImageDownloadFile } from "../../../../src/downloads/_internal/file-url-fetchers/fetchExportImageDownloadFile";
import { IHubEditableContent, IServiceExtendedProps } from "../../../../src";

describe("fetchExportImageDownloadFile", () => {
  it("should call progressCallback with PENDING statuses", async () => {
    const requestSpy = spyOn(requestModule, "request").and.returnValue(
      Promise.resolve({ size: 1000 } as Blob)
    );
    const progressCallback = jasmine
      .createSpy("progressCallback")
      .and.callFake((_status: DownloadOperationStatus): any => null);

    const options = {
      entity: {
        name: "entity-name",
        type: "Image Service",
        url: "http://example-service.com",
        extendedProps: {
          kind: "service",
          server: {
            extent: {
              xmin: 1,
              xmax: 2,
              ymin: 3,
              ymax: 4,
              spatialReference: { wkid: 4326 } as any,
            },
          },
        } as IServiceExtendedProps,
      } as IHubEditableContent,
      format: ServiceDownloadFormat.JPG,
      context: { requestOptions: {} },
      progressCallback,
    } as unknown as IFetchDownloadFileOptions;

    const result = await fetchExportImageDownloadFile(options);
    expect(result).toEqual({
      type: "blob",
      filename: "entity-name.jpg",
      blob: { size: 1000 } as Blob,
    });

    expect(progressCallback).toHaveBeenCalledTimes(1);
    expect(progressCallback).toHaveBeenCalledWith(
      DownloadOperationStatus.PENDING
    );

    expect(requestSpy).toHaveBeenCalledTimes(1);
    expect(requestSpy).toHaveBeenCalledWith(
      "http://example-service.com/exportImage",
      {
        httpMethod: "GET",
        params: {
          f: "image",
          format: ServiceDownloadFormat.JPG,
          mosaicRule:
            '{"ascending":true,"mosaicMethod":"esriMosaicNorthwest","mosaicOperation":"MT_FIRST"}',
          bbox: "1,3,2,4",
          bboxSR: "4326",
        },
      }
    );
  });

  it("runs when no progressCallback is passed", async () => {
    const requestSpy = spyOn(requestModule, "request").and.returnValue(
      Promise.resolve({ size: 1000 } as Blob)
    );

    const options = {
      entity: {
        name: "entity-name",
        type: "Image Service",
        url: "http://example-service.com",
        extendedProps: {
          kind: "service",
          server: {
            extent: {
              xmin: 1,
              xmax: 2,
              ymin: 3,
              ymax: 4,
              spatialReference: { wkid: 4326 } as any,
            },
          },
        } as IServiceExtendedProps,
      } as IHubEditableContent,
      format: ServiceDownloadFormat.JPG,
      context: { requestOptions: {} },
    } as unknown as IFetchDownloadFileOptions;

    const result = await fetchExportImageDownloadFile(options);
    expect(result).toEqual({
      type: "blob",
      filename: "entity-name.jpg",
      blob: { size: 1000 } as Blob,
    });

    expect(requestSpy).toHaveBeenCalledTimes(1);
    expect(requestSpy).toHaveBeenCalledWith(
      "http://example-service.com/exportImage",
      {
        httpMethod: "GET",
        params: {
          f: "image",
          format: ServiceDownloadFormat.JPG,
          mosaicRule:
            '{"ascending":true,"mosaicMethod":"esriMosaicNorthwest","mosaicOperation":"MT_FIRST"}',
          bbox: "1,3,2,4",
          bboxSR: "4326",
        },
      }
    );
  });

  it("throws an error when the server definition has no extent", async () => {
    spyOn(requestModule, "request").and.returnValue(
      Promise.resolve({ size: 1000 } as Blob)
    );

    const options = {
      entity: {
        name: "entity-name",
        type: "Image Service",
        url: "http://example-service.com",
        extendedProps: {
          kind: "service",
          server: {}, // no extent
        } as IServiceExtendedProps,
      } as IHubEditableContent,
      format: ServiceDownloadFormat.JPG,
      context: { requestOptions: {} },
    } as unknown as IFetchDownloadFileOptions;

    try {
      await fetchExportImageDownloadFile(options);
      expect(true).toBe(false);
    } catch (error) {
      expect(error.message).toBe("Extent required for this download operation");
    }
  });

  it("throws an error when a non-extent geometry is passed", async () => {
    spyOn(requestModule, "request").and.returnValue(
      Promise.resolve({ size: 1000 } as Blob)
    );

    const options = {
      entity: {
        name: "entity-name",
        type: "Image Service",
        url: "http://example-service.com",
        extendedProps: {
          kind: "service",
          server: {
            extent: {
              xmin: 1,
              xmax: 2,
              ymin: 3,
              ymax: 4,
              spatialReference: { wkid: 4326 } as any,
            },
          },
        } as IServiceExtendedProps,
      } as IHubEditableContent,
      format: ServiceDownloadFormat.JPG,
      context: { requestOptions: {} },
      geometry: { type: "point" },
    } as unknown as IFetchDownloadFileOptions;
    try {
      await fetchExportImageDownloadFile(options);
      expect(true).toBe(false);
    } catch (error) {
      expect(error.message).toBe(
        "Only extent geometric filters are supported for this type of download"
      );
    }
  });

  it("filters the download when an extent geometry is passed in", async () => {
    const requestSpy = spyOn(requestModule, "request").and.returnValue(
      Promise.resolve({ size: 1000 } as Blob)
    );

    const options = {
      entity: {
        name: "entity-name",
        type: "Image Service",
        url: "http://example-service.com",
        extendedProps: {
          kind: "service",
          server: {
            extent: {
              xmin: 1,
              xmax: 2,
              ymin: 3,
              ymax: 4,
              spatialReference: { wkid: 4326 } as any,
            },
          },
        } as IServiceExtendedProps,
      } as IHubEditableContent,
      format: ServiceDownloadFormat.JPG,
      context: { requestOptions: {} },
      geometry: {
        type: "extent",
        xmin: 0,
        xmax: 1,
        ymin: 0,
        ymax: 1,
        spatialReference: { wkid: 3857 },
      },
    } as unknown as IFetchDownloadFileOptions;

    const result = await fetchExportImageDownloadFile(options);
    expect(result).toEqual({
      type: "blob",
      filename: "entity-name.jpg",
      blob: { size: 1000 } as Blob,
    });

    expect(requestSpy).toHaveBeenCalledTimes(1);
    expect(requestSpy).toHaveBeenCalledWith(
      "http://example-service.com/exportImage",
      {
        httpMethod: "GET",
        params: {
          f: "image",
          format: ServiceDownloadFormat.JPG,
          mosaicRule:
            '{"ascending":true,"mosaicMethod":"esriMosaicNorthwest","mosaicOperation":"MT_FIRST"}',
          bbox: "0,0,1,1",
          bboxSR: "3857",
        },
      }
    );
  });

  it("uses the server name for the file if the entity name is unavailable", async () => {
    const requestSpy = spyOn(requestModule, "request").and.returnValue(
      Promise.resolve({ size: 1000 } as Blob)
    );

    const options = {
      entity: {
        type: "Image Service",
        url: "http://example-service.com",
        extendedProps: {
          kind: "service",
          server: {
            name: "server-name",
            extent: {
              xmin: 1,
              xmax: 2,
              ymin: 3,
              ymax: 4,
              spatialReference: { wkid: 4326 } as any,
            },
          },
        } as IServiceExtendedProps,
      } as IHubEditableContent,
      format: ServiceDownloadFormat.JPG,
      context: { requestOptions: {} },
    } as unknown as IFetchDownloadFileOptions;

    const result = await fetchExportImageDownloadFile(options);
    expect(result).toEqual({
      type: "blob",
      filename: "server-name.jpg",
      blob: { size: 1000 } as Blob,
    });

    expect(requestSpy).toHaveBeenCalledTimes(1);
    expect(requestSpy).toHaveBeenCalledWith(
      "http://example-service.com/exportImage",
      {
        httpMethod: "GET",
        params: {
          f: "image",
          format: ServiceDownloadFormat.JPG,
          mosaicRule:
            '{"ascending":true,"mosaicMethod":"esriMosaicNorthwest","mosaicOperation":"MT_FIRST"}',
          bbox: "1,3,2,4",
          bboxSR: "4326",
        },
      }
    );
  });

  it("sets the end file extension as .png for other formats in the png family", async () => {
    const requestSpy = spyOn(requestModule, "request").and.returnValue(
      Promise.resolve({ size: 1000 } as Blob)
    );

    const options = {
      entity: {
        name: "entity-name",
        type: "Image Service",
        url: "http://example-service.com",
        extendedProps: {
          kind: "service",
          server: {
            extent: {
              xmin: 1,
              xmax: 2,
              ymin: 3,
              ymax: 4,
              spatialReference: { wkid: 4326 } as any,
            },
          },
        } as IServiceExtendedProps,
      } as IHubEditableContent,
      format: ServiceDownloadFormat.PNG32,
      context: { requestOptions: {} },
    } as unknown as IFetchDownloadFileOptions;

    const result = await fetchExportImageDownloadFile(options);
    expect(result).toEqual({
      type: "blob",
      filename: "entity-name.png",
      blob: { size: 1000 } as Blob,
    });

    expect(requestSpy).toHaveBeenCalledTimes(1);
    expect(requestSpy).toHaveBeenCalledWith(
      "http://example-service.com/exportImage",
      {
        httpMethod: "GET",
        params: {
          f: "image",
          format: ServiceDownloadFormat.PNG32,
          mosaicRule:
            '{"ascending":true,"mosaicMethod":"esriMosaicNorthwest","mosaicOperation":"MT_FIRST"}',
          bbox: "1,3,2,4",
          bboxSR: "4326",
        },
      }
    );
  });
});
