import * as portal from "@esri/arcgis-rest-portal";
import { UserSession } from "@esri/arcgis-rest-auth";
import { portalPollExportJobStatus } from "../../src/portal/portal-poll-export-job-status";
import * as EventEmitter from "eventemitter3";
import * as exportHelper from "../../src/portal/portal-export-success-handler";
import ExportCompletionError from "../../src/portal/portal-export-completion-error";
function delay(milliseconds: number) {
  return new Promise(resolve => setTimeout(resolve, milliseconds));
}

describe("portalPollExportJobStatus", () => {
  const authentication = new UserSession({
    username: "portal-user",
    portal: "http://portal.com/sharing/rest",
    token: "123"
  });
  authentication.getToken = () =>
    new Promise(resolve => {
      resolve("123");
    });

  it("handle export failure", async done => {
    try {
      spyOn(portal, "getItemStatus").and.callFake(async () => {
        return Promise.resolve({
          status: "failed",
          statusMessage: "Export failed"
        });
      });

      const mockEventEmitter = new EventEmitter();
      spyOn(mockEventEmitter, "emit");
      const poller = portalPollExportJobStatus({
        downloadId: "download-id",
        jobId: "test-id",
        datasetId: "abcdef0123456789abcdef0123456789_0",
        format: "CSV",
        authentication,
        exportCreated: 1000,
        pollingInterval: 10,
        eventEmitter: mockEventEmitter
      });
      expect(poller.pollTimer !== null).toEqual(true);
      await delay(100);
      expect(portal.getItemStatus).toHaveBeenCalledTimes(1);
      expect((portal.getItemStatus as any).calls.first().args).toEqual([
        {
          id: "download-id",
          jobId: "test-id",
          jobType: "export",
          authentication
        }
      ]);
      expect(mockEventEmitter.emit as any).toHaveBeenCalledTimes(1);
      expect((mockEventEmitter.emit as any).calls.first().args).toEqual([
        "download-idExportError",
        {
          detail: {
            error: new Error("Export failed"),
            metadata: { status: "error", errors: [new Error("Export failed")] }
          }
        }
      ]);
      expect(poller.pollTimer === null).toEqual(true);
    } catch (err) {
      expect(err).toEqual(undefined);
    } finally {
      done();
    }
  });

  it("handle polling error", async done => {
    try {
      spyOn(portal, "getItemStatus").and.callFake(async () => {
        return Promise.reject(new Error("Not Found"));
      });

      const mockEventEmitter = new EventEmitter();
      spyOn(mockEventEmitter, "emit");
      const poller = portalPollExportJobStatus({
        downloadId: "download-id",
        jobId: "test-id",
        datasetId: "abcdef0123456789abcdef0123456789_0",
        format: "CSV",
        authentication,
        exportCreated: 1000,
        pollingInterval: 10,
        eventEmitter: mockEventEmitter
      });

      expect(poller.pollTimer !== null).toEqual(true);
      await delay(100);
      expect(portal.getItemStatus).toHaveBeenCalledTimes(1);
      expect((portal.getItemStatus as any).calls.first().args).toEqual([
        {
          id: "download-id",
          jobId: "test-id",
          jobType: "export",
          authentication
        }
      ]);
      expect(mockEventEmitter.emit as any).toHaveBeenCalledTimes(1);
      expect((mockEventEmitter.emit as any).calls.first().args).toEqual([
        "download-idPollingError",
        {
          detail: {
            error: new Error("Not Found"),
            metadata: { status: "error", errors: [new Error("Not Found")] }
          }
        }
      ]);
      expect(poller.pollTimer === null).toEqual(true);
    } catch (err) {
      expect(err).toEqual(undefined);
    } finally {
      done();
    }
  });

  it("handle job incomplete", async done => {
    try {
      spyOn(portal, "getItemStatus").and.callFake(async () => {
        return Promise.resolve({ status: "in progress" });
      });

      const mockEventEmitter = new EventEmitter();
      spyOn(mockEventEmitter, "emit");
      const poller = portalPollExportJobStatus({
        downloadId: "download-id",
        jobId: "test-id",
        datasetId: "abcdef0123456789abcdef0123456789_0",
        format: "CSV",
        authentication,
        exportCreated: 1000,
        pollingInterval: 10,
        eventEmitter: mockEventEmitter
      });

      expect(poller.pollTimer !== null).toEqual(true);
      await delay(100);
      expect((portal.getItemStatus as any).calls.count()).toBeGreaterThan(1);
      expect((portal.getItemStatus as any).calls.first().args).toEqual([
        {
          id: "download-id",
          jobId: "test-id",
          jobType: "export",
          authentication
        }
      ]);
      expect(mockEventEmitter.emit as any).toHaveBeenCalledTimes(0);
      expect(poller.pollTimer === null).toEqual(false);
      poller.disablePoll();
    } catch (err) {
      expect(err).toEqual(undefined);
    } finally {
      (portal.getItemStatus as any).calls.reset();
      done();
    }
  });

  it("exportSuccessHandler other failure", async done => {
    try {
      spyOn(portal, "getItemStatus").and.callFake(async () => {
        return Promise.resolve({ status: "completed" });
      });

      spyOn(exportHelper, "exportSuccessHandler").and.callFake(
        async (params: any) => {
          return Promise.reject(new ExportCompletionError("5xx"));
        }
      );

      const mockEventEmitter = new EventEmitter();
      spyOn(mockEventEmitter, "emit");
      const poller = portalPollExportJobStatus({
        downloadId: "download-id",
        jobId: "test-id",
        datasetId: "abcdef0123456789abcdef0123456789_0",
        format: "CSV",
        authentication,
        exportCreated: 1000,
        pollingInterval: 10,
        eventEmitter: mockEventEmitter
      });
      expect(poller.pollTimer !== null).toEqual(true);
      await delay(100);
      expect(portal.getItemStatus).toHaveBeenCalledTimes(1);
      expect((portal.getItemStatus as any).calls.first().args).toEqual([
        {
          id: "download-id",
          jobId: "test-id",
          jobType: "export",
          authentication
        }
      ]);
      expect(exportHelper.exportSuccessHandler).toHaveBeenCalledTimes(1);
      expect(
        (exportHelper.exportSuccessHandler as any).calls.first().args
      ).toEqual([
        {
          authentication,
          downloadId: "download-id",
          datasetId: "abcdef0123456789abcdef0123456789_0",
          exportCreated: 1000,
          format: "CSV",
          spatialRefId: undefined,
          eventEmitter: mockEventEmitter
        }
      ]);

      expect(mockEventEmitter.emit as any).toHaveBeenCalledTimes(1);
      expect((mockEventEmitter.emit as any).calls.first().args).toEqual([
        "download-idExportError",
        {
          detail: {
            error: new Error("5xx"),
            metadata: { status: "error", errors: [new Error("5xx")] }
          }
        }
      ]);
      expect(poller.pollTimer === null).toEqual(true);
    } catch (err) {
      expect(err).toEqual(undefined);
    } finally {
      done();
    }
  });

  it("exportSuccessHandler other failure", async done => {
    try {
      spyOn(portal, "getItemStatus").and.callFake(async () => {
        return Promise.resolve({ status: "completed" });
      });

      spyOn(exportHelper, "exportSuccessHandler").and.callFake(
        async (params: any) => {
          expect(portal.getItemStatus).toHaveBeenCalledTimes(1);
          return Promise.reject(new Error("5xx"));
        }
      );

      const mockEventEmitter = new EventEmitter();
      spyOn(mockEventEmitter, "emit");
      const poller = portalPollExportJobStatus({
        downloadId: "download-id",
        jobId: "test-id",
        datasetId: "abcdef0123456789abcdef0123456789_0",
        format: "CSV",
        authentication,
        exportCreated: 1000,
        pollingInterval: 10,
        eventEmitter: mockEventEmitter
      });
      expect(poller.pollTimer !== null).toEqual(true);
      await delay(100);
      expect(portal.getItemStatus).toHaveBeenCalledTimes(1);
      expect((portal.getItemStatus as any).calls.first().args).toEqual([
        {
          id: "download-id",
          jobId: "test-id",
          jobType: "export",
          authentication
        }
      ]);
      expect(exportHelper.exportSuccessHandler).toHaveBeenCalledTimes(1);
      expect(
        (exportHelper.exportSuccessHandler as any).calls.first().args
      ).toEqual([
        {
          authentication,
          downloadId: "download-id",
          datasetId: "abcdef0123456789abcdef0123456789_0",
          exportCreated: 1000,
          format: "CSV",
          spatialRefId: undefined,
          eventEmitter: mockEventEmitter
        }
      ]);
      expect(mockEventEmitter.emit as any).toHaveBeenCalledTimes(1);
      expect((mockEventEmitter.emit as any).calls.first().args).toEqual([
        "download-idPollingError",
        {
          detail: {
            error: new Error("5xx"),
            metadata: { status: "error", errors: [new Error("5xx")] }
          }
        }
      ]);
      expect(poller.pollTimer === null).toEqual(true);
    } catch (err) {
      expect(err).toEqual(undefined);
    } finally {
      done();
    }
  });

  it("exportSuccessHandler success", async done => {
    try {
      spyOn(portal, "getItemStatus").and.callFake(async () => {
        return Promise.resolve({ status: "completed" });
      });

      const mockEventEmitter = new EventEmitter();
      spyOn(mockEventEmitter, "emit");
      spyOn(exportHelper, "exportSuccessHandler").and.callFake(async () => {
        mockEventEmitter.emit(`download-idExportComplete`);
        return Promise.resolve();
      });

      const poller = portalPollExportJobStatus({
        downloadId: "download-id",
        jobId: "test-id",
        datasetId: "abcdef0123456789abcdef0123456789_0",
        format: "CSV",
        authentication,
        exportCreated: 1000,
        pollingInterval: 10,
        eventEmitter: mockEventEmitter
      });
      expect(poller.pollTimer !== null).toEqual(true);
      await delay(100);
      expect(portal.getItemStatus).toHaveBeenCalledTimes(1);
      expect((portal.getItemStatus as any).calls.first().args).toEqual([
        {
          id: "download-id",
          jobId: "test-id",
          jobType: "export",
          authentication
        }
      ]);
      expect(mockEventEmitter.emit as any).toHaveBeenCalledTimes(1);
      expect(poller.pollTimer === null).toEqual(true);
    } catch (err) {
      expect(err).toEqual(undefined);
    } finally {
      done();
    }
  });
});
