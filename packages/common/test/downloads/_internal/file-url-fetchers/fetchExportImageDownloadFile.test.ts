import * as requestModule from "@esri/arcgis-rest-request";
import {
  DownloadOperationStatus,
  IFetchDownloadFileOptions,
} from "../../../../src/downloads/types";
import { fetchExportImageDownloadFile } from "../../../../src/downloads/_internal/file-url-fetchers/fetchExportImageDownloadFile";

describe("fetchExportImageDownloadFile", () => {
  it("should call progressCallback with PENDING and COMPLETED statuses", async () => {
    const requestSpy = spyOn(requestModule, "request").and.returnValue(
      Promise.resolve({ size: 1000 } as Blob)
    );
    const progressCallback = jasmine
      .createSpy("progressCallback")
      .and.callFake((_status: DownloadOperationStatus): any => null);

    const options = {
      entity: { type: "Image Service", url: "http://example-service.com" },
      format: "png",
      context: { requestOptions: {} },
      progressCallback,
    } as unknown as IFetchDownloadFileOptions;

    const result = await fetchExportImageDownloadFile(options);
    expect(result).toBe({
      type: "blob",
      filename: "entity-name.png",
      blob: { size: 1000 } as Blob,
    });

    expect(progressCallback).toHaveBeenCalledTimes(2);
    expect(progressCallback).toHaveBeenCalledWith(
      DownloadOperationStatus.PENDING
    );
    expect(progressCallback).toHaveBeenCalledWith(
      DownloadOperationStatus.COMPLETED
    );

    expect(requestSpy).toHaveBeenCalledTimes(1);
    expect(requestSpy).toHaveBeenCalledWith(
      "http://example-service.com/exportImage",
      {
        httpMethod: "GET",
        params: {
          format: "png",
          mosaicRule:
            '{"ascending":true,"mosaicMethod":"esriMosaicNorthwest","mosaicOperation":"MT_FIRST"}',
        },
      }
    );
  });

  it("handles when no progressCallback is passed", async () => {
    const requestSpy = spyOn(requestModule, "request").and.returnValue(
      Promise.resolve({ size: 1000 } as Blob)
    );

    const options = {
      entity: { type: "Image Service", url: "http://example-service.com" },
      format: "png",
      context: { requestOptions: {} },
    } as unknown as IFetchDownloadFileOptions;

    const result = await fetchExportImageDownloadFile(options);
    expect(result).toBe({
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
          format: "png",
          mosaicRule:
            '{"ascending":true,"mosaicMethod":"esriMosaicNorthwest","mosaicOperation":"MT_FIRST"}',
        },
      }
    );
  });

  it("handles a non-extent geometry", async () => {
    const requestSpy = spyOn(requestModule, "request").and.returnValue(
      Promise.resolve({ size: 1000 } as Blob)
    );

    const options = {
      entity: { type: "Image Service", url: "http://example-service.com" },
      format: "png",
      context: { requestOptions: {} },
      geometry: { type: "point" },
    } as unknown as IFetchDownloadFileOptions;

    const result = await fetchExportImageDownloadFile(options);
    expect(result).toBe({
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
          format: "png",
          mosaicRule:
            '{"ascending":true,"mosaicMethod":"esriMosaicNorthwest","mosaicOperation":"MT_FIRST"}',
        },
      }
    );
  });

  it("handles an extent geometry", async () => {
    const requestSpy = spyOn(requestModule, "request").and.returnValue(
      Promise.resolve({ size: 1000 } as Blob)
    );

    const options = {
      entity: { type: "Image Service", url: "http://example-service.com" },
      format: "png",
      context: { requestOptions: {} },
      geometry: {
        type: "extent",
        xmin: 0,
        xmax: 1,
        ymin: 0,
        ymax: 1,
        spatialReference: { wkid: 4326 },
      },
    } as unknown as IFetchDownloadFileOptions;

    const result = await fetchExportImageDownloadFile(options);
    expect(result).toBe({
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
          format: "png",
          mosaicRule:
            '{"ascending":true,"mosaicMethod":"esriMosaicNorthwest","mosaicOperation":"MT_FIRST"}',
          bbox: "0,0,1,1",
          bboxSR: "4326",
          imageSR: "4326",
        },
      }
    );
  });
});
