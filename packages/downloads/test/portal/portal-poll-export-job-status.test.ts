import * as portal from "@esri/arcgis-rest-portal";
import { UserSession } from "@esri/arcgis-rest-auth";
import { portalPollExportJobStatus } from "../../src/portal/portal-poll-export-job-status";
import * as EventEmitter from "eventemitter3";

function delay(milliseconds: number) {
  return new Promise(resolve => setTimeout(resolve, milliseconds));
}

class RestJsError extends Error {
  code: string;
  constructor(message: string, code: string) {
    super(message);
    Object.setPrototypeOf(this, RestJsError.prototype);
    this.code = code;
  }
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
      spyOn(portal, "getItemStatus").and.returnValue(
        new Promise((resolve, reject) => {
          resolve({
            status: "failed",
            statusMessage: "Export failed"
          });
        })
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
      expect(mockEventEmitter.emit as any).toHaveBeenCalledTimes(1);
      expect((mockEventEmitter.emit as any).calls.first().args).toEqual([
        "download-idExportError",
        {
          detail: {
            metadata: {
              errors: [new Error("Export failed")],
              status: "error"
            }
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
            metadata: {
              errors: [new Error("Not Found")],
              status: "error"
            }
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

  describe("export-completed handling errors", () => {
    it("updateItem failure", async done => {
      try {
        spyOn(portal, "getItemStatus").and.callFake(async () => {
          return Promise.resolve({ status: "completed" });
        });

        spyOn(portal, "updateItem").and.callFake(async () => {
          return Promise.reject(new Error("5xx"));
        });

        spyOn(portal, "removeItem").and.callFake(async () => {
          return Promise.resolve();
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
        expect(portal.updateItem).toHaveBeenCalledTimes(1);
        expect((portal.updateItem as any).calls.first().args).toEqual([
          {
            item: {
              id: "download-id",
              typeKeywords: `export:abcdef0123456789abcdef0123456789_0,modified:1000,spatialRefId:undefined`
            },
            authentication
          }
        ]);
        expect(portal.removeItem).toHaveBeenCalledTimes(1);
        expect((portal.removeItem as any).calls.first().args).toEqual([
          {
            id: "download-id",
            authentication
          }
        ]);
        expect(mockEventEmitter.emit as any).toHaveBeenCalledTimes(1);
        expect((mockEventEmitter.emit as any).calls.first().args).toEqual([
          "download-idExportError",
          {
            detail: {
              metadata: { errors: [new Error("5xx")], status: "error" }
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

    it("setItemAccess failure", async done => {
      try {
        spyOn(portal, "getItemStatus").and.callFake(async () => {
          return Promise.resolve({ status: "completed" });
        });

        spyOn(portal, "updateItem").and.callFake(async () => {
          return Promise.resolve();
        });

        spyOn(portal, "setItemAccess").and.callFake(async () => {
          return Promise.reject(new Error("5xx"));
        });

        spyOn(portal, "removeItem").and.callFake(async () => {
          return Promise.resolve();
        });

        const mockEventEmitter = new EventEmitter();
        spyOn(mockEventEmitter, "emit");
        portalPollExportJobStatus({
          downloadId: "download-id",
          jobId: "test-id",
          datasetId: "abcdef0123456789abcdef0123456789_0",
          format: "CSV",
          authentication,
          exportCreated: 1000,
          pollingInterval: 10,
          eventEmitter: mockEventEmitter
        });

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
        expect(portal.updateItem).toHaveBeenCalledTimes(1);
        expect((portal.updateItem as any).calls.first().args).toEqual([
          {
            item: {
              id: "download-id",
              typeKeywords: `export:abcdef0123456789abcdef0123456789_0,modified:1000,spatialRefId:undefined`
            },
            authentication
          }
        ]);
        expect(portal.setItemAccess).toHaveBeenCalledTimes(1);
        expect((portal.setItemAccess as any).calls.first().args).toEqual([
          {
            id: "download-id",
            authentication,
            access: "private"
          }
        ]);
        expect(portal.removeItem).toHaveBeenCalledTimes(1);
        expect((portal.removeItem as any).calls.first().args).toEqual([
          {
            id: "download-id",
            authentication
          }
        ]);
        expect(mockEventEmitter.emit as any).toHaveBeenCalledTimes(1);
        expect((mockEventEmitter.emit as any).calls.first().args).toEqual([
          "download-idExportError",
          {
            detail: {
              metadata: { errors: [new Error("5xx")], status: "error" }
            }
          }
        ]);
      } catch (err) {
        expect(err).toEqual(undefined);
      } finally {
        done();
      }
    });

    it("userContent failure", async done => {
      try {
        spyOn(portal, "getItemStatus").and.callFake(async () => {
          return Promise.resolve({ status: "completed" });
        });

        spyOn(portal, "updateItem").and.callFake(async () => {
          return Promise.resolve();
        });

        spyOn(portal, "setItemAccess").and.callFake(async () => {
          return Promise.resolve();
        });

        spyOn(portal, "getUserContent").and.callFake(async () => {
          return Promise.reject(new Error("5xx"));
        });

        spyOn(portal, "removeItem").and.callFake(async () => {
          return Promise.resolve();
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
        expect(portal.updateItem).toHaveBeenCalledTimes(1);
        expect((portal.updateItem as any).calls.first().args).toEqual([
          {
            item: {
              id: "download-id",
              typeKeywords: `export:abcdef0123456789abcdef0123456789_0,modified:1000,spatialRefId:undefined`
            },
            authentication
          }
        ]);
        expect(portal.setItemAccess).toHaveBeenCalledTimes(1);
        expect((portal.setItemAccess as any).calls.first().args).toEqual([
          {
            id: "download-id",
            authentication,
            access: "private"
          }
        ]);
        expect(portal.getUserContent).toHaveBeenCalledTimes(1);
        expect((portal.getUserContent as any).calls.first().args).toEqual([
          { authentication }
        ]);
        expect(portal.removeItem).toHaveBeenCalledTimes(1);
        expect((portal.removeItem as any).calls.first().args).toEqual([
          {
            id: "download-id",
            authentication
          }
        ]);
        expect(mockEventEmitter.emit as any).toHaveBeenCalledTimes(1);
        expect((mockEventEmitter.emit as any).calls.first().args).toEqual([
          "download-idExportError",
          {
            detail: {
              metadata: { errors: [new Error("5xx")], status: "error" }
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

    it("createFolder failure", async done => {
      try {
        spyOn(portal, "getItemStatus").and.callFake(async () => {
          return Promise.resolve({ status: "completed" });
        });

        spyOn(portal, "updateItem").and.callFake(async () => {
          return Promise.resolve();
        });

        spyOn(portal, "setItemAccess").and.callFake(async () => {
          return Promise.resolve();
        });

        spyOn(portal, "getUserContent").and.callFake(async () => {
          return Promise.resolve({ folders: [] });
        });

        spyOn(portal, "createFolder").and.callFake(async () => {
          return Promise.reject(new Error("5xx"));
        });

        spyOn(portal, "removeItem").and.callFake(async () => {
          return Promise.resolve();
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
        expect(portal.updateItem).toHaveBeenCalledTimes(1);
        expect((portal.updateItem as any).calls.first().args).toEqual([
          {
            item: {
              id: "download-id",
              typeKeywords: `export:abcdef0123456789abcdef0123456789_0,modified:1000,spatialRefId:undefined`
            },
            authentication
          }
        ]);
        expect(portal.setItemAccess).toHaveBeenCalledTimes(1);
        expect((portal.setItemAccess as any).calls.first().args).toEqual([
          {
            id: "download-id",
            authentication,
            access: "private"
          }
        ]);
        expect(portal.getUserContent).toHaveBeenCalledTimes(1);
        expect((portal.getUserContent as any).calls.first().args).toEqual([
          { authentication }
        ]);
        expect(portal.createFolder).toHaveBeenCalledTimes(1);
        expect((portal.createFolder as any).calls.first().args).toEqual([
          {
            title: "item-exports",
            authentication
          }
        ]);
        expect(portal.removeItem).toHaveBeenCalledTimes(1);
        expect((portal.removeItem as any).calls.first().args).toEqual([
          {
            id: "download-id",
            authentication
          }
        ]);
        expect(mockEventEmitter.emit as any).toHaveBeenCalledTimes(1);
        expect((mockEventEmitter.emit as any).calls.first().args).toEqual([
          "download-idExportError",
          {
            detail: {
              metadata: { errors: [new Error("5xx")], status: "error" }
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

    it("moveItem failure", async done => {
      try {
        spyOn(portal, "getItemStatus").and.callFake(async () => {
          return Promise.resolve({ status: "completed" });
        });

        spyOn(portal, "updateItem").and.callFake(async () => {
          return Promise.resolve();
        });

        spyOn(portal, "setItemAccess").and.callFake(async () => {
          return Promise.resolve();
        });

        spyOn(portal, "getUserContent").and.callFake(async () => {
          return Promise.resolve({ folders: [] });
        });

        spyOn(portal, "createFolder").and.callFake(async () => {
          return Promise.resolve({ folder: { id: "export-folder-id" } });
        });
        spyOn(portal, "moveItem").and.callFake(async () => {
          return Promise.reject(new Error("5xx"));
        });

        spyOn(portal, "removeItem").and.callFake(async () => {
          return Promise.resolve();
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
        expect(portal.updateItem).toHaveBeenCalledTimes(1);
        expect((portal.updateItem as any).calls.first().args).toEqual([
          {
            item: {
              id: "download-id",
              typeKeywords: `export:abcdef0123456789abcdef0123456789_0,modified:1000,spatialRefId:undefined`
            },
            authentication
          }
        ]);
        expect(portal.setItemAccess).toHaveBeenCalledTimes(1);
        expect((portal.setItemAccess as any).calls.first().args).toEqual([
          {
            id: "download-id",
            authentication,
            access: "private"
          }
        ]);
        expect(portal.getUserContent).toHaveBeenCalledTimes(1);
        expect((portal.getUserContent as any).calls.first().args).toEqual([
          { authentication }
        ]);
        expect(portal.createFolder).toHaveBeenCalledTimes(1);
        expect((portal.createFolder as any).calls.first().args).toEqual([
          {
            title: "item-exports",
            authentication
          }
        ]);
        expect(portal.moveItem).toHaveBeenCalledTimes(1);
        expect((portal.moveItem as any).calls.first().args).toEqual([
          {
            itemId: "download-id",
            folderId: "export-folder-id",
            authentication
          }
        ]);
        expect(portal.removeItem).toHaveBeenCalledTimes(1);
        expect((portal.removeItem as any).calls.first().args).toEqual([
          {
            id: "download-id",
            authentication
          }
        ]);
        expect(mockEventEmitter.emit as any).toHaveBeenCalledTimes(1);
        expect((mockEventEmitter.emit as any).calls.first().args).toEqual([
          "download-idExportError",
          {
            detail: {
              metadata: { errors: [new Error("5xx")], status: "error" }
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
  });

  describe("exported-completed, successful handling", () => {
    it("succeeds without existing exports folder", async done => {
      try {
        spyOn(portal, "getItemStatus").and.returnValues(
          new Promise((resolve, reject) => {
            resolve({
              status: "progress"
            });
          }),
          new Promise((resolve, reject) => {
            resolve({
              status: "completed"
            });
          })
        );

        spyOn(portal, "updateItem").and.callFake(async () => {
          return Promise.resolve();
        });

        spyOn(portal, "setItemAccess").and.callFake(async () => {
          return Promise.resolve();
        });

        spyOn(portal, "getUserContent").and.callFake(async () => {
          return Promise.resolve({ folders: [] });
        });

        spyOn(portal, "createFolder").and.callFake(async () => {
          return Promise.resolve({ folder: { id: "export-folder-id" } });
        });

        spyOn(portal, "moveItem").and.callFake(async () => {
          return Promise.resolve();
        });

        spyOn(portal, "removeItem").and.callFake(async () => {
          return Promise.resolve();
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
        expect(portal.getItemStatus).toHaveBeenCalledTimes(2);
        expect((portal.getItemStatus as any).calls.first().args).toEqual([
          {
            id: "download-id",
            jobId: "test-id",
            jobType: "export",
            authentication
          }
        ]);
        expect(portal.updateItem).toHaveBeenCalledTimes(1);
        expect((portal.updateItem as any).calls.first().args).toEqual([
          {
            item: {
              id: "download-id",
              typeKeywords: `export:abcdef0123456789abcdef0123456789_0,modified:1000,spatialRefId:undefined`
            },
            authentication
          }
        ]);
        expect(portal.setItemAccess).toHaveBeenCalledTimes(1);
        expect((portal.setItemAccess as any).calls.first().args).toEqual([
          {
            id: "download-id",
            authentication,
            access: "private"
          }
        ]);
        expect(portal.getUserContent).toHaveBeenCalledTimes(1);
        expect((portal.getUserContent as any).calls.first().args).toEqual([
          { authentication }
        ]);
        expect(portal.createFolder).toHaveBeenCalledTimes(1);
        expect((portal.createFolder as any).calls.first().args).toEqual([
          {
            title: "item-exports",
            authentication
          }
        ]);
        expect(portal.moveItem).toHaveBeenCalledTimes(1);
        expect((portal.moveItem as any).calls.first().args).toEqual([
          {
            itemId: "download-id",
            folderId: "export-folder-id",
            authentication
          }
        ]);
        expect(portal.removeItem).toHaveBeenCalledTimes(0);

        expect(mockEventEmitter.emit as any).toHaveBeenCalledTimes(1);
        expect((mockEventEmitter.emit as any).calls.first().args[0]).toEqual(
          "download-idExportComplete"
        );
        const {
          detail: {
            metadata: { downloadId, status, downloadUrl, lastModified }
          }
        } = (mockEventEmitter.emit as any).calls.first().args[1];
        expect(downloadId).toEqual("download-id");
        expect(status).toEqual("ready");
        expect(downloadUrl).toEqual(
          "http://portal.com/sharing/rest/content/items/download-id/data?token=123"
        );
        expect(
          /^[0-9]{4}-[0-9]{2}-[0-9]{2}T[0-9]{2}:[0-9]{2}:[0-9]{2}.[0-9]{3}Z$/.test(
            lastModified
          )
        ).toEqual(true);
        expect(poller.pollTimer === null).toEqual(true);
      } catch (err) {
        expect(err).toEqual(undefined);
      } finally {
        done();
      }
    });

    it("succeeds with existing exports folder", async done => {
      try {
        spyOn(portal, "getItemStatus").and.returnValues(
          new Promise((resolve, reject) => {
            resolve({
              status: "progress"
            });
          }),
          new Promise((resolve, reject) => {
            resolve({
              status: "completed"
            });
          })
        );

        spyOn(portal, "updateItem").and.returnValue(
          new Promise((resolve, reject) => {
            resolve();
          })
        );

        spyOn(portal, "setItemAccess").and.returnValue(
          new Promise((resolve, reject) => {
            resolve();
          })
        );

        spyOn(portal, "getUserContent").and.returnValue(
          new Promise((resolve, reject) => {
            resolve({
              folders: [
                {
                  id: "export-folder-id",
                  title: "item-exports"
                }
              ]
            });
          })
        );

        spyOn(portal, "createFolder");

        spyOn(portal, "moveItem").and.returnValue(
          new Promise((resolve, reject) => {
            resolve();
          })
        );

        spyOn(portal, "removeItem").and.returnValue(
          new Promise((resolve, reject) => {
            resolve();
          })
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
        expect(portal.getItemStatus).toHaveBeenCalledTimes(2);
        expect((portal.getItemStatus as any).calls.first().args).toEqual([
          {
            id: "download-id",
            jobId: "test-id",
            jobType: "export",
            authentication
          }
        ]);
        expect(portal.updateItem).toHaveBeenCalledTimes(1);
        expect((portal.updateItem as any).calls.first().args).toEqual([
          {
            item: {
              id: "download-id",
              typeKeywords: `export:abcdef0123456789abcdef0123456789_0,modified:1000,spatialRefId:undefined`
            },
            authentication
          }
        ]);
        expect(portal.setItemAccess).toHaveBeenCalledTimes(1);
        expect((portal.setItemAccess as any).calls.first().args).toEqual([
          {
            id: "download-id",
            authentication,
            access: "private"
          }
        ]);
        expect(portal.getUserContent).toHaveBeenCalledTimes(1);
        expect((portal.getUserContent as any).calls.first().args).toEqual([
          { authentication }
        ]);
        expect(portal.createFolder).toHaveBeenCalledTimes(0);
        expect(portal.moveItem).toHaveBeenCalledTimes(1);
        expect((portal.moveItem as any).calls.first().args).toEqual([
          {
            itemId: "download-id",
            folderId: "export-folder-id",
            authentication
          }
        ]);
        expect(portal.removeItem).toHaveBeenCalledTimes(0);

        expect(mockEventEmitter.emit as any).toHaveBeenCalledTimes(1);
        expect((mockEventEmitter.emit as any).calls.first().args[0]).toEqual(
          "download-idExportComplete"
        );
        const {
          detail: {
            metadata: { downloadId, status, downloadUrl, lastModified }
          }
        } = (mockEventEmitter.emit as any).calls.first().args[1];
        expect(downloadId).toEqual("download-id");
        expect(status).toEqual("ready");
        expect(downloadUrl).toEqual(
          "http://portal.com/sharing/rest/content/items/download-id/data?token=123"
        );
        expect(
          /^[0-9]{4}-[0-9]{2}-[0-9]{2}T[0-9]{2}:[0-9]{2}:[0-9]{2}.[0-9]{3}Z$/.test(
            lastModified
          )
        ).toEqual(true);
        expect(poller.pollTimer === null).toEqual(true);
      } catch (err) {
        expect(err).toEqual(undefined);
      } finally {
        done();
      }
    });

    it("succeeds without moving download", async done => {
      try {
        spyOn(portal, "getItemStatus").and.callFake(async () => {
          return Promise.resolve({ status: "completed" });
        });

        spyOn(portal, "updateItem").and.callFake(async () => {
          return Promise.resolve();
        });

        spyOn(portal, "setItemAccess").and.callFake(async () => {
          return Promise.resolve();
        });

        spyOn(portal, "getUserContent").and.callFake(async () => {
          return Promise.resolve({ folders: [] });
        });

        spyOn(portal, "createFolder").and.callFake(async () => {
          return Promise.resolve({ folder: { id: "export-folder-id" } });
        });

        spyOn(portal, "moveItem").and.callFake(async () => {
          return Promise.reject(new RestJsError("Already moved", "CONT_0011"));
        });

        spyOn(portal, "removeItem").and.callFake(async () => {
          return Promise.resolve();
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
        expect(portal.updateItem).toHaveBeenCalledTimes(1);
        expect((portal.updateItem as any).calls.first().args).toEqual([
          {
            item: {
              id: "download-id",
              typeKeywords: `export:abcdef0123456789abcdef0123456789_0,modified:1000,spatialRefId:undefined`
            },
            authentication
          }
        ]);
        expect(portal.setItemAccess).toHaveBeenCalledTimes(1);
        expect((portal.setItemAccess as any).calls.first().args).toEqual([
          {
            id: "download-id",
            authentication,
            access: "private"
          }
        ]);
        expect(portal.getUserContent).toHaveBeenCalledTimes(1);
        expect((portal.getUserContent as any).calls.first().args).toEqual([
          { authentication }
        ]);
        expect(portal.createFolder).toHaveBeenCalledTimes(1);
        expect((portal.createFolder as any).calls.first().args).toEqual([
          {
            title: "item-exports",
            authentication
          }
        ]);
        expect(portal.moveItem).toHaveBeenCalledTimes(1);
        expect((portal.moveItem as any).calls.first().args).toEqual([
          {
            itemId: "download-id",
            folderId: "export-folder-id",
            authentication
          }
        ]);
        expect(portal.removeItem).toHaveBeenCalledTimes(0);
        expect(mockEventEmitter.emit as any).toHaveBeenCalledTimes(1);
        expect((mockEventEmitter.emit as any).calls.first().args[0]).toEqual(
          "download-idExportComplete"
        );
        const {
          detail: {
            metadata: { downloadId, status, downloadUrl, lastModified }
          }
        } = (mockEventEmitter.emit as any).calls.first().args[1];
        expect(downloadId).toEqual("download-id");
        expect(status).toEqual("ready");
        expect(downloadUrl).toEqual(
          "http://portal.com/sharing/rest/content/items/download-id/data?token=123"
        );
        expect(
          /^[0-9]{4}-[0-9]{2}-[0-9]{2}T[0-9]{2}:[0-9]{2}:[0-9]{2}.[0-9]{3}Z$/.test(
            lastModified
          )
        ).toEqual(true);
        expect(poller.pollTimer === null).toEqual(true);
      } catch (err) {
        expect(err).toEqual(undefined);
      } finally {
        done();
      }
    });

    it("succeeds with spatialRefId", async done => {
      try {
        spyOn(portal, "getItemStatus").and.returnValues(
          new Promise((resolve, reject) => {
            resolve({
              status: "progress"
            });
          }),
          new Promise((resolve, reject) => {
            resolve({
              status: "completed"
            });
          })
        );

        spyOn(portal, "updateItem").and.returnValue(
          new Promise((resolve, reject) => {
            resolve();
          })
        );

        spyOn(portal, "setItemAccess").and.returnValue(
          new Promise((resolve, reject) => {
            resolve();
          })
        );

        spyOn(portal, "getUserContent").and.returnValue(
          new Promise((resolve, reject) => {
            resolve({ folders: [] });
          })
        );

        spyOn(portal, "createFolder").and.returnValue(
          new Promise((resolve, reject) => {
            resolve({ folder: { id: "export-folder-id" } });
          })
        );

        spyOn(portal, "moveItem").and.returnValue(
          new Promise((resolve, reject) => {
            resolve();
          })
        );

        spyOn(portal, "removeItem").and.returnValue(
          new Promise((resolve, reject) => {
            resolve();
          })
        );
        const mockEventEmitter = new EventEmitter();
        spyOn(mockEventEmitter, "emit");
        const poller = portalPollExportJobStatus({
          downloadId: "download-id",
          jobId: "test-id",
          datasetId: "abcdef0123456789abcdef0123456789_0",
          format: "CSV",
          spatialRefId: "4326",
          authentication,
          exportCreated: 1000,
          pollingInterval: 10,
          eventEmitter: mockEventEmitter
        });

        expect(poller.pollTimer !== null).toEqual(true);
        await delay(100);
        expect(portal.getItemStatus).toHaveBeenCalledTimes(2);
        expect((portal.getItemStatus as any).calls.first().args).toEqual([
          {
            id: "download-id",
            jobId: "test-id",
            jobType: "export",
            authentication
          }
        ]);
        expect(portal.updateItem).toHaveBeenCalledTimes(1);
        expect((portal.updateItem as any).calls.first().args).toEqual([
          {
            item: {
              id: "download-id",
              typeKeywords: `export:abcdef0123456789abcdef0123456789_0,modified:1000,spatialRefId:4326`
            },
            authentication
          }
        ]);
        expect(portal.setItemAccess).toHaveBeenCalledTimes(1);
        expect((portal.setItemAccess as any).calls.first().args).toEqual([
          {
            id: "download-id",
            authentication,
            access: "private"
          }
        ]);
        expect(portal.getUserContent).toHaveBeenCalledTimes(1);
        expect((portal.getUserContent as any).calls.first().args).toEqual([
          { authentication }
        ]);
        expect(portal.createFolder).toHaveBeenCalledTimes(1);
        expect((portal.createFolder as any).calls.first().args).toEqual([
          {
            title: "item-exports",
            authentication
          }
        ]);
        expect(portal.moveItem).toHaveBeenCalledTimes(1);
        expect((portal.moveItem as any).calls.first().args).toEqual([
          {
            itemId: "download-id",
            folderId: "export-folder-id",
            authentication
          }
        ]);
        expect(portal.removeItem).toHaveBeenCalledTimes(0);

        expect(mockEventEmitter.emit as any).toHaveBeenCalledTimes(1);
        expect((mockEventEmitter.emit as any).calls.first().args[0]).toEqual(
          "download-idExportComplete"
        );
        const {
          detail: {
            metadata: { downloadId, status, downloadUrl, lastModified }
          }
        } = (mockEventEmitter.emit as any).calls.first().args[1];
        expect(downloadId).toEqual("download-id");
        expect(status).toEqual("ready");
        expect(downloadUrl).toEqual(
          "http://portal.com/sharing/rest/content/items/download-id/data?token=123"
        );
        expect(
          /^[0-9]{4}-[0-9]{2}-[0-9]{2}T[0-9]{2}:[0-9]{2}:[0-9]{2}.[0-9]{3}Z$/.test(
            lastModified
          )
        ).toEqual(true);
        expect(poller.pollTimer === null).toEqual(true);
      } catch (err) {
        expect(err).toEqual(undefined);
      } finally {
        done();
      }
    });
  });
});
