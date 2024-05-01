import * as arcgisRestPortalModule from "@esri/arcgis-rest-portal";
import * as getExportItemDataUrlModule from "../../../../src/downloads/_internal/getExportItemDataUrl";
import { fetchExportItemDownloadFileUrl } from "../../../../src/downloads/_internal/file-url-fetchers/fetchExportItemDownloadFileUrl";
import {
  DownloadOperationStatus,
  IArcGISContext,
  IHubEditableContent,
  ServiceDownloadFormat,
} from "../../../../src";

describe("fetchExportItemDownloadFileUrl", () => {
  let exportItemSpy: jasmine.Spy;
  let getItemStatusSpy: jasmine.Spy;
  let getExportItemDataUrlSpy: jasmine.Spy;
  let mockContext: IArcGISContext;

  beforeEach(() => {
    exportItemSpy = spyOn(arcgisRestPortalModule, "exportItem");
    getItemStatusSpy = spyOn(arcgisRestPortalModule, "getItemStatus");
    getExportItemDataUrlSpy = spyOn(
      getExportItemDataUrlModule,
      "getExportItemDataUrl"
    );
    mockContext = {
      hubRequestOptions: {
        authentication: {
          portal: "https://some-portal.com",
        },
      },
    } as unknown as IArcGISContext;
  });

  it("should throw an error if a geometry is provided", async () => {
    try {
      await fetchExportItemDownloadFileUrl({
        entity: { id: "some-id" } as IHubEditableContent,
        layers: [0],
        format: ServiceDownloadFormat.CSV,
        context: mockContext,
        geometry: {
          x: 1,
          y: 2,
          spatialReference: { wkid: 4326 },
        } as unknown as __esri.Geometry,
      });
      expect(true).toBe(
        false,
        "fetchExportItemDownloadFileUrl should have thrown an error"
      );
    } catch (error) {
      expect(error.message).toBe(
        "Geometric filters are not supported for this type of download"
      );
    }
  });

  it("should throw an error if a where clause is provided", async () => {
    try {
      await fetchExportItemDownloadFileUrl({
        entity: { id: "some-id" } as IHubEditableContent,
        layers: [0],
        format: ServiceDownloadFormat.CSV,
        context: mockContext,
        where: "1=1",
      });
      expect(true).toBe(
        false,
        "fetchExportItemDownloadFileUrl should have thrown an error"
      );
    } catch (error) {
      expect(error.message).toBe(
        "Attribute filters are not supported for this type of download"
      );
    }
  });

  it("should throw error if status is returned as failed", async () => {
    exportItemSpy.and.callFake(async () => ({
      jobId: "some-job-id",
      exportItemId: "some-export-id",
    }));
    getItemStatusSpy.and.callFake(async () => {
      return { status: "failed" };
    });

    try {
      await fetchExportItemDownloadFileUrl({
        entity: { id: "some-id" } as IHubEditableContent,
        layers: [0],
        format: ServiceDownloadFormat.FILE_GDB,
        context: mockContext,
        pollInterval: 0,
      });
      expect(true).toBe(
        false,
        "fetchExportItemDownloadFileUrl should have thrown an error"
      );
    } catch (error) {
      expect(error.message).toBe("Export job failed");
      expect(exportItemSpy).toHaveBeenCalledTimes(1);
      expect(exportItemSpy).toHaveBeenCalledWith({
        id: "some-id",
        exportFormat: "File Geodatabase", // legacy format
        exportParameters: { layers: [{ id: 0 }] },
        authentication: {
          portal: "https://some-portal.com",
        },
      });
      expect(getItemStatusSpy).toHaveBeenCalledTimes(1);
      expect(getItemStatusSpy).toHaveBeenCalledWith({
        id: "some-export-id",
        jobId: "some-job-id",
        jobType: "export",
        authentication: {
          portal: "https://some-portal.com",
        },
      });
      expect(getExportItemDataUrlSpy).toHaveBeenCalledTimes(0);
    }
  });

  it("should update progress on an FGDB download", async () => {
    let pollCount = 0;
    exportItemSpy.and.callFake(async () => ({
      jobId: "some-job-id",
      exportItemId: "some-export-id",
    }));
    getItemStatusSpy.and.callFake(async () => {
      pollCount++;
      if (pollCount === 1) {
        return { status: "processing" };
      } else if (pollCount === 2) {
        return { status: "completed" };
      }
    });
    getExportItemDataUrlSpy.and.callFake(() => "https://some-url.com");
    const progressCallback = jasmine
      .createSpy("progressCallback")
      .and.callFake((_status: DownloadOperationStatus): any => null);
    const result = await fetchExportItemDownloadFileUrl({
      entity: { id: "some-id" } as IHubEditableContent,
      layers: [0],
      format: ServiceDownloadFormat.FILE_GDB,
      context: mockContext,
      progressCallback,
      pollInterval: 0,
    });
    expect(result).toBe("https://some-url.com");

    expect(progressCallback).toHaveBeenCalledTimes(3);
    expect(progressCallback).toHaveBeenCalledWith(
      DownloadOperationStatus.PENDING
    );
    expect(progressCallback).toHaveBeenCalledWith(
      DownloadOperationStatus.PROCESSING
    );
    expect(progressCallback).toHaveBeenCalledWith(
      DownloadOperationStatus.COMPLETED
    );

    expect(exportItemSpy).toHaveBeenCalledTimes(1);
    expect(exportItemSpy).toHaveBeenCalledWith({
      id: "some-id",
      exportFormat: "File Geodatabase", // legacy format
      exportParameters: { layers: [{ id: 0 }] },
      authentication: {
        portal: "https://some-portal.com",
      },
    });
    expect(getItemStatusSpy).toHaveBeenCalledTimes(2);
    expect(getItemStatusSpy).toHaveBeenCalledWith({
      id: "some-export-id",
      jobId: "some-job-id",
      jobType: "export",
      authentication: {
        portal: "https://some-portal.com",
      },
    });
    expect(getExportItemDataUrlSpy).toHaveBeenCalledTimes(1);
    expect(getExportItemDataUrlSpy).toHaveBeenCalledWith(
      "some-export-id",
      mockContext
    );
  });

  it("should fetch export item data url for a CSV download", async () => {
    exportItemSpy.and.callFake(async () => ({
      jobId: "some-job-id",
      exportItemId: "some-export-id",
    }));
    getItemStatusSpy.and.callFake(async () => ({ status: "completed" }));
    getExportItemDataUrlSpy.and.callFake(() => "https://some-url.com");
    const result = await fetchExportItemDownloadFileUrl({
      entity: { id: "some-id" } as IHubEditableContent,
      layers: [0],
      format: ServiceDownloadFormat.CSV,
      context: mockContext,
      pollInterval: 0,
    });
    expect(result).toBe("https://some-url.com");
  });
});
