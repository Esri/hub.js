import * as portal from "@esri/arcgis-rest-portal";
import { UserSession } from "@esri/arcgis-rest-auth";
import { portalRequestDatasetExport } from "../../src/portal/portal-request-dataset-export";

const authentication = new UserSession({
  username: "portal-user",
  portal: "http://portal.com/sharing/rest",
  token: "123"
});
authentication.getToken = () =>
  new Promise(resolve => {
    resolve("123");
  });

describe("portalRequestDatasetExport", () => {
  it("exportItem fails", async done => {
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
        title: "test-export"
      });
      expect(result).toBeUndefined();
    } catch (err) {
      expect(err.message).toEqual("5xx");
      expect(portal.exportItem).toHaveBeenCalledTimes(1);
      expect((portal.exportItem as any).calls.first().args).toEqual([
        {
          id: "abcdef0123456789abcdef0123456789",
          exportFormat: "CSV",
          exportParameters: { layers: [Object({ id: 0, where: undefined })] },
          title: "test-export",
          authentication
        }
      ]);
    } finally {
      done();
    }
  });

  it("succeeds", async done => {
    try {
      spyOn(portal, "exportItem").and.returnValue(
        new Promise((resolve, reject) => {
          resolve({
            size: 1000,
            jobId: "job-id",
            exportItemId: "abcdef"
          });
        })
      );

      const result = await portalRequestDatasetExport({
        datasetId: "abcdef0123456789abcdef0123456789_0",
        format: "CSV",
        authentication,
        title: "test-export"
      });
      expect(portal.exportItem).toHaveBeenCalledTimes(1);
      expect((portal.exportItem as any).calls.first().args).toEqual([
        {
          id: "abcdef0123456789abcdef0123456789",
          exportFormat: "CSV",
          exportParameters: { layers: [Object({ id: 0, where: undefined })] },
          title: "test-export",
          authentication
        }
      ]);
      expect(result).toBeDefined();
      expect(result.downloadId).toEqual("abcdef");
      expect(result.jobId).toEqual("job-id");
      expect(result.size).toEqual(1000);
      expect(typeof result.exportCreated === "number").toEqual(true);
    } catch (err) {
      expect(err).toBeUndefined();
    } finally {
      done();
    }
  });

  it("succeeds, dataset has no layer id", async done => {
    try {
      spyOn(portal, "exportItem").and.returnValue(
        new Promise((resolve, reject) => {
          resolve({
            size: 1000,
            jobId: "job-id",
            exportItemId: "abcdef"
          });
        })
      );

      const result = await portalRequestDatasetExport({
        datasetId: "abcdef0123456789abcdef0123456789",
        format: "CSV",
        authentication,
        title: "test-export"
      });
      expect(portal.exportItem).toHaveBeenCalledTimes(1);
      expect((portal.exportItem as any).calls.first().args).toEqual([
        {
          id: "abcdef0123456789abcdef0123456789",
          exportFormat: "CSV",
          exportParameters: { layers: [Object({ id: 0, where: undefined })] },
          title: "test-export",
          authentication
        }
      ]);
      expect(result).toBeDefined();
      expect(result.downloadId).toEqual("abcdef");
      expect(result.jobId).toEqual("job-id");
      expect(result.size).toEqual(1000);
      expect(typeof result.exportCreated === "number").toEqual(true);
    } catch (err) {
      expect(err).toBeUndefined();
    } finally {
      done();
    }
  });

  it("succeeds, uses spatialRefId", async done => {
    try {
      spyOn(portal, "exportItem").and.returnValue(
        new Promise((resolve, reject) => {
          resolve({
            size: 1000,
            jobId: "job-id",
            exportItemId: "abcdef"
          });
        })
      );

      const result = await portalRequestDatasetExport({
        datasetId: "abcdef0123456789abcdef0123456789_0",
        format: "CSV",
        authentication,
        spatialRefId: "4326",
        title: "test-export"
      });
      expect(portal.exportItem).toHaveBeenCalledTimes(1);
      expect((portal.exportItem as any).calls.first().args).toEqual([
        {
          id: "abcdef0123456789abcdef0123456789",
          exportFormat: "CSV",
          exportParameters: {
            layers: [Object({ id: 0, where: undefined })],
            targetSR: { wkid: 4326 }
          },
          title: "test-export",
          authentication
        }
      ]);
      expect(result).toBeDefined();
      expect(result.downloadId).toEqual("abcdef");
      expect(result.jobId).toEqual("job-id");
      expect(result.size).toEqual(1000);
      expect(typeof result.exportCreated === "number").toEqual(true);
    } catch (err) {
      expect(err).toBeUndefined();
    } finally {
      done();
    }
  });

  it("succeeds, uses where", async done => {
    try {
      spyOn(portal, "exportItem").and.returnValue(
        new Promise((resolve, reject) => {
          resolve({
            size: 1000,
            jobId: "job-id",
            exportItemId: "abcdef"
          });
        })
      );

      const result = await portalRequestDatasetExport({
        datasetId: "abcdef0123456789abcdef0123456789_0",
        format: "CSV",
        authentication,
        spatialRefId: "4326",
        title: "test-export",
        where: "1=1"
      });
      expect(portal.exportItem).toHaveBeenCalledTimes(1);
      expect((portal.exportItem as any).calls.first().args).toEqual([
        {
          id: "abcdef0123456789abcdef0123456789",
          exportFormat: "CSV",
          exportParameters: {
            layers: [Object({ id: 0, where: "1=1" })],
            targetSR: { wkid: 4326 }
          },
          title: "test-export",
          authentication
        }
      ]);
      expect(result).toBeDefined();
      expect(result.downloadId).toEqual("abcdef");
      expect(result.jobId).toEqual("job-id");
      expect(result.size).toEqual(1000);
      expect(typeof result.exportCreated === "number").toEqual(true);
    } catch (err) {
      expect(err).toBeUndefined();
    } finally {
      done();
    }
  });
});
