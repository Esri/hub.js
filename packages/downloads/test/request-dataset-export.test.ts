import { UserSession } from "@esri/arcgis-rest-auth";
import { requestDatasetExport } from "../src/request-dataset-export";
import * as hubExport from "../src/hub/hub-request-dataset-export";
import * as portalExport from "../src/portal/portal-request-dataset-export";

describe("requestDownloadMetadata", () => {
  it("handle hub export", async done => {
    try {
      spyOn(hubExport, "hubRequestDatasetExport").and.returnValue(
        new Promise((resolve, reject) => {
          resolve({
            downloadId:
              "abcdef0123456789abcdef0123456789_0:CSV:4326:undefined:undefined"
          });
        })
      );

      const result = await requestDatasetExport({
        host: "http://hub.com/",
        datasetId: "abcdef0123456789abcdef0123456789_0",
        spatialRefId: "4326",
        format: "CSV"
      });

      expect(hubExport.hubRequestDatasetExport).toHaveBeenCalledTimes(1);
      expect(
        (hubExport.hubRequestDatasetExport as any).calls.first().args
      ).toEqual([
        {
          host: "http://hub.com/",
          datasetId: "abcdef0123456789abcdef0123456789_0",
          format: "CSV",
          spatialRefId: "4326",
          geometry: undefined,
          where: undefined
        }
      ]);

      expect(result).toEqual({
        downloadId:
          "abcdef0123456789abcdef0123456789_0:CSV:4326:undefined:undefined"
      });
    } catch (err) {
      expect(err).toBeUndefined();
    } finally {
      done();
    }
  });

  it("handle portal export", async done => {
    try {
      spyOn(portalExport, "portalRequestDatasetExport").and.returnValue(
        new Promise((resolve, reject) => {
          resolve({
            size: 1000,
            jobId: "job-id",
            downloadId: "abcdef",
            exportCreated: Date.now()
          });
        })
      );

      const authentication = new UserSession({
        username: "portal-user",
        portal: "http://portal.com/sharing/rest",
        token: "123"
      });
      authentication.getToken = () =>
        new Promise(resolve => {
          resolve("123");
        });

      const result = await requestDatasetExport({
        datasetId: "abcdef0123456789abcdef0123456789_0",
        format: "CSV",
        authentication,
        title: "test-export",
        target: "portal",
        spatialRefId: "2227"
      });

      expect(portalExport.portalRequestDatasetExport).toHaveBeenCalledTimes(1);
      expect(
        (portalExport.portalRequestDatasetExport as any).calls.first().args
      ).toEqual([
        {
          datasetId: "abcdef0123456789abcdef0123456789_0",
          format: "CSV",
          title: "test-export",
          authentication,
          spatialRefId: "2227",
          where: undefined
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

  it("handle enterprise export", async done => {
    try {
      spyOn(portalExport, "portalRequestDatasetExport").and.returnValue(
        new Promise((resolve, reject) => {
          resolve({
            size: 1000,
            jobId: "job-id",
            downloadId: "abcdef",
            exportCreated: Date.now()
          });
        })
      );

      const authentication = new UserSession({
        username: "portal-user",
        portal: "http://portal.com/sharing/rest",
        token: "123"
      });
      authentication.getToken = () =>
        new Promise(resolve => {
          resolve("123");
        });

      const result = await requestDatasetExport({
        datasetId: "abcdef0123456789abcdef0123456789_0",
        format: "CSV",
        authentication,
        title: "test-export",
        target: "enterprise",
        spatialRefId: "2227"
      });

      expect(portalExport.portalRequestDatasetExport).toHaveBeenCalledTimes(1);
      expect(
        (portalExport.portalRequestDatasetExport as any).calls.first().args
      ).toEqual([
        {
          datasetId: "abcdef0123456789abcdef0123456789_0",
          format: "CSV",
          title: "test-export",
          authentication,
          spatialRefId: "2227",
          where: undefined
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
