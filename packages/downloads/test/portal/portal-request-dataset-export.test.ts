import * as portal from "@esri/arcgis-rest-portal";
import { portalRequestDatasetExport } from "../../src/portal/portal-request-dataset-export";

const authentication = {
  username: "portal-user",
  portal: "http://portal.com/sharing/rest",
  token: "123",
} as any;
authentication.getToken = () =>
  new Promise((resolve) => {
    resolve("123");
  });

describe("portalRequestDatasetExport", () => {
  it("exportItem fails", async (done) => {
    try {
      spyOn(portal, "exportItem").and.returnValue(
        new Promise((resolve, reject) => {
          reject(new Error("5xx"));
        })
      );

      const result = await portalRequestDatasetExport({
        datasetId: "abcdef0123456789abcdef0123456789_0",
        format: "CSV",
        authentication,
        title: "test-export",
      });
      expect(result).toBeUndefined();
    } catch (err) {
      const error = err as { message?: string };
      expect(error.message).toEqual("5xx");
      expect(portal.exportItem).toHaveBeenCalledTimes(1);
      expect((portal.exportItem as any).calls.first().args).toEqual([
        {
          id: "abcdef0123456789abcdef0123456789",
          exportFormat: "CSV",
          exportParameters: { layers: [Object({ id: 0, where: undefined })] },
          title: "test-export",
          authentication,
        },
      ]);
    } finally {
      done();
    }
  });

  it("succeeds", async (done) => {
    try {
      spyOn(portal, "exportItem").and.returnValue(
        new Promise((resolve, reject) => {
          resolve({
            size: 1000,
            jobId: "job-id",
            exportItemId: "abcdef",
          });
        })
      );

      const result = await portalRequestDatasetExport({
        datasetId: "abcdef0123456789abcdef0123456789_0",
        format: "CSV",
        authentication,
        title: "test-export",
      });
      expect(portal.exportItem).toHaveBeenCalledTimes(1);
      expect((portal.exportItem as any).calls.first().args).toEqual([
        {
          id: "abcdef0123456789abcdef0123456789",
          exportFormat: "CSV",
          exportParameters: { layers: [Object({ id: 0, where: undefined })] },
          title: "test-export",
          authentication,
        },
      ]);
      expect(result).toBeDefined();
      expect(result.downloadId).toEqual("abcdef");
      expect(result.jobId).toEqual("job-id");
      expect(result.size).toEqual(1000);
      expect(typeof result.exportCreated === "number").toEqual(true);
    } catch (err) {
      const error = err as { message?: string };
      expect(error).toBeUndefined();
    } finally {
      done();
    }
  });

  it("succeeds, dataset has no layer id", async (done) => {
    try {
      spyOn(portal, "exportItem").and.returnValue(
        new Promise((resolve, reject) => {
          resolve({
            size: 1000,
            jobId: "job-id",
            exportItemId: "abcdef",
          });
        })
      );

      const result = await portalRequestDatasetExport({
        datasetId: "abcdef0123456789abcdef0123456789",
        format: "CSV",
        authentication,
        title: "test-export",
      });
      expect(portal.exportItem).toHaveBeenCalledTimes(1);
      expect((portal.exportItem as any).calls.first().args).toEqual([
        {
          id: "abcdef0123456789abcdef0123456789",
          exportFormat: "CSV",
          exportParameters: {},
          title: "test-export",
          authentication,
        },
      ]);
      expect(result).toBeDefined();
      expect(result.downloadId).toEqual("abcdef");
      expect(result.jobId).toEqual("job-id");
      expect(result.size).toEqual(1000);
      expect(typeof result.exportCreated === "number").toEqual(true);
    } catch (err) {
      const error = err as { message?: string };
      expect(error).toBeUndefined();
    } finally {
      done();
    }
  });

  it("succeeds, uses single layer and spatialRefId", async (done) => {
    try {
      spyOn(portal, "exportItem").and.returnValue(
        new Promise((resolve, reject) => {
          resolve({
            size: 1000,
            jobId: "job-id",
            exportItemId: "abcdef",
          });
        })
      );

      const result = await portalRequestDatasetExport({
        datasetId: "abcdef0123456789abcdef0123456789_0",
        format: "CSV",
        authentication,
        spatialRefId: "4326",
        title: "test-export",
      });
      expect(portal.exportItem).toHaveBeenCalledTimes(1);
      expect((portal.exportItem as any).calls.first().args).toEqual([
        {
          id: "abcdef0123456789abcdef0123456789",
          exportFormat: "CSV",
          exportParameters: {
            layers: [Object({ id: 0, where: undefined })],
            targetSR: { wkid: 4326 },
          },
          title: "test-export",
          authentication,
        },
      ]);
      expect(result).toBeDefined();
      expect(result.downloadId).toEqual("abcdef");
      expect(result.jobId).toEqual("job-id");
      expect(result.size).toEqual(1000);
      expect(typeof result.exportCreated === "number").toEqual(true);
    } catch (err) {
      const error = err as { message?: string };
      expect(error).toBeUndefined();
    } finally {
      done();
    }
  });

  it("succeeds, uses no layers and spatialRefId", async (done) => {
    try {
      spyOn(portal, "exportItem").and.returnValue(
        new Promise((resolve, reject) => {
          resolve({
            size: 1000,
            jobId: "job-id",
            exportItemId: "abcdef",
          });
        })
      );

      const result = await portalRequestDatasetExport({
        datasetId: "abcdef0123456789abcdef0123456789",
        format: "CSV",
        authentication,
        spatialRefId: "4326",
        title: "test-export",
      });
      expect(portal.exportItem).toHaveBeenCalledTimes(1);
      expect((portal.exportItem as any).calls.first().args).toEqual([
        {
          id: "abcdef0123456789abcdef0123456789",
          exportFormat: "CSV",
          exportParameters: {
            targetSR: { wkid: 4326 },
          },
          title: "test-export",
          authentication,
        },
      ]);
      expect(result).toBeDefined();
      expect(result.downloadId).toEqual("abcdef");
      expect(result.jobId).toEqual("job-id");
      expect(result.size).toEqual(1000);
      expect(typeof result.exportCreated === "number").toEqual(true);
    } catch (err) {
      const error = err as { message?: string };
      expect(error).toBeUndefined();
    } finally {
      done();
    }
  });

  it("succeeds, uses where", async (done) => {
    try {
      spyOn(portal, "exportItem").and.returnValue(
        new Promise((resolve, reject) => {
          resolve({
            size: 1000,
            jobId: "job-id",
            exportItemId: "abcdef",
          });
        })
      );

      const result = await portalRequestDatasetExport({
        datasetId: "abcdef0123456789abcdef0123456789_0",
        format: "CSV",
        authentication,
        spatialRefId: "4326",
        title: "test-export",
        where: "1=1",
      });
      expect(portal.exportItem).toHaveBeenCalledTimes(1);
      expect((portal.exportItem as any).calls.first().args).toEqual([
        {
          id: "abcdef0123456789abcdef0123456789",
          exportFormat: "CSV",
          exportParameters: {
            layers: [Object({ id: 0, where: "1=1" })],
            targetSR: { wkid: 4326 },
          },
          title: "test-export",
          authentication,
        },
      ]);
      expect(result).toBeDefined();
      expect(result.downloadId).toEqual("abcdef");
      expect(result.jobId).toEqual("job-id");
      expect(result.size).toEqual(1000);
      expect(typeof result.exportCreated === "number").toEqual(true);
    } catch (err) {
      const error = err as { message?: string };
      expect(error).toBeUndefined();
    } finally {
      done();
    }
  });
});
