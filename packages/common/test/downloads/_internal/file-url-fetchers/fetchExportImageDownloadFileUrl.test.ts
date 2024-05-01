import * as requestModule from "@esri/arcgis-rest-request";
import {
  DownloadOperationStatus,
  IFetchDownloadFileUrlOptions,
} from "../../../../src/downloads/types";
import { fetchExportImageDownloadFileUrl } from "../../../../src/downloads/_internal/file-url-fetchers/fetchExportImageDownloadFileUrl";

describe("fetchExportImageDownloadFileUrl", () => {
  it("should call progressCallback with PENDING and COMPLETED statuses", async () => {
    const requestSpy = spyOn(requestModule, "request").and.returnValue(
      Promise.resolve({ href: "result-url" })
    );
    const progressCallback = jasmine
      .createSpy("progressCallback")
      .and.callFake((_status: DownloadOperationStatus): any => null);

    const options = {
      entity: { type: "Image Service", url: "http://example-service.com" },
      format: "png",
      context: { requestOptions: {} },
      progressCallback,
    } as unknown as IFetchDownloadFileUrlOptions;

    const result = await fetchExportImageDownloadFileUrl(options);
    expect(result).toBe("result-url");

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
      Promise.resolve({ href: "result-url" })
    );

    const options = {
      entity: { type: "Image Service", url: "http://example-service.com" },
      format: "png",
      context: { requestOptions: {} },
    } as unknown as IFetchDownloadFileUrlOptions;

    const result = await fetchExportImageDownloadFileUrl(options);
    expect(result).toBe("result-url");

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
      Promise.resolve({ href: "result-url" })
    );

    const options = {
      entity: { type: "Image Service", url: "http://example-service.com" },
      format: "png",
      context: { requestOptions: {} },
      geometry: { type: "point" },
    } as unknown as IFetchDownloadFileUrlOptions;

    const result = await fetchExportImageDownloadFileUrl(options);
    expect(result).toBe("result-url");

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
      Promise.resolve({ href: "result-url" })
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
    } as unknown as IFetchDownloadFileUrlOptions;

    const result = await fetchExportImageDownloadFileUrl(options);
    expect(result).toBe("result-url");

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
