import * as portal from "@esri/arcgis-rest-portal";
import { UserSession } from "@esri/arcgis-rest-auth";
import * as folderHelper from "../../src/portal/portal-get-exports-folder-id";
import { exportSuccessHandler } from "../../src/portal/portal-export-success-handler";
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

  describe("export-completed handling errors", () => {
    it("updateItem failure", async done => {
      try {
        spyOn(portal, "updateItem").and.callFake(async () => {
          return Promise.reject(new Error("5xx"));
        });

        spyOn(portal, "removeItem").and.callFake(async () => {
          return Promise.resolve();
        });

        const mockEventEmitter = new EventEmitter();
        await exportSuccessHandler({
          downloadId: "download-id",
          datasetId: "abcdef0123456789abcdef0123456789_0",
          authentication,
          exportCreated: 1000,
          eventEmitter: mockEventEmitter
        });
        throw new Error("should have errored");
      } catch (err) {
        expect(err.message).toBe("5xx");
      } finally {
        expect(portal.updateItem).toHaveBeenCalledTimes(1);
        expect((portal.updateItem as any).calls.first().args).toEqual([
          {
            item: {
              id: "download-id",
              typekeywords: `exportItem:abcdef0123456789abcdef0123456789,exportLayer:0,modified:1000,spatialRefId:undefined`
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
        done();
      }
    });

    it("setItemAccess failure", async done => {
      try {
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

        await exportSuccessHandler({
          downloadId: "download-id",
          datasetId: "abcdef0123456789abcdef0123456789_0",
          authentication,
          exportCreated: 1000,
          eventEmitter: mockEventEmitter
        });
        throw new Error("should have errored");
      } catch (err) {
        expect(err.message).toEqual("5xx");
        expect(portal.updateItem).toHaveBeenCalledTimes(1);
        expect((portal.updateItem as any).calls.first().args).toEqual([
          {
            item: {
              id: "download-id",
              typekeywords: `exportItem:abcdef0123456789abcdef0123456789,exportLayer:0,modified:1000,spatialRefId:undefined`
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
      } finally {
        done();
      }
    });

    it("getExportsFolderId failure", async done => {
      try {
        spyOn(portal, "updateItem").and.callFake(async () => {
          return Promise.resolve();
        });

        spyOn(portal, "setItemAccess").and.callFake(async () => {
          return Promise.resolve();
        });

        spyOn(folderHelper, "getExportsFolderId").and.callFake(async () => {
          return Promise.reject(new Error("5xx"));
        });

        spyOn(portal, "removeItem").and.callFake(async () => {
          return Promise.resolve();
        });

        const mockEventEmitter = new EventEmitter();

        await exportSuccessHandler({
          downloadId: "download-id",
          datasetId: "abcdef0123456789abcdef0123456789_0",
          authentication,
          exportCreated: 1000,
          eventEmitter: mockEventEmitter
        });
        throw new Error("should have errored");
      } catch (err) {
        expect(err.message).toEqual("5xx");
        expect(portal.updateItem).toHaveBeenCalledTimes(1);
        expect((portal.updateItem as any).calls.first().args).toEqual([
          {
            item: {
              id: "download-id",
              typekeywords: `exportItem:abcdef0123456789abcdef0123456789,exportLayer:0,modified:1000,spatialRefId:undefined`
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
        expect(folderHelper.getExportsFolderId).toHaveBeenCalledTimes(1);
        expect(
          (folderHelper.getExportsFolderId as any).calls.first().args
        ).toEqual([authentication]);
        expect(portal.removeItem).toHaveBeenCalledTimes(1);
        expect((portal.removeItem as any).calls.first().args).toEqual([
          {
            id: "download-id",
            authentication
          }
        ]);
      } finally {
        done();
      }
    });

    it("moveItem failure", async done => {
      try {
        spyOn(portal, "updateItem").and.callFake(async () => {
          return Promise.resolve();
        });

        spyOn(portal, "setItemAccess").and.callFake(async () => {
          return Promise.resolve();
        });

        spyOn(folderHelper, "getExportsFolderId").and.callFake(async () => {
          return Promise.resolve("export-folder-id");
        });

        spyOn(portal, "moveItem").and.callFake(async () => {
          return Promise.reject(new Error("5xx"));
        });

        spyOn(portal, "removeItem").and.callFake(async () => {
          return Promise.resolve();
        });

        const mockEventEmitter = new EventEmitter();

        await exportSuccessHandler({
          downloadId: "download-id",
          datasetId: "abcdef0123456789abcdef0123456789_0",
          authentication,
          exportCreated: 1000,
          eventEmitter: mockEventEmitter
        });
        throw new Error("should have errored");
      } catch (err) {
        expect(err.message).toEqual("5xx");
        expect(portal.updateItem).toHaveBeenCalledTimes(1);
        expect((portal.updateItem as any).calls.first().args).toEqual([
          {
            item: {
              id: "download-id",
              typekeywords: `exportItem:abcdef0123456789abcdef0123456789,exportLayer:0,modified:1000,spatialRefId:undefined`
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
        expect(folderHelper.getExportsFolderId).toHaveBeenCalledTimes(1);
        expect(
          (folderHelper.getExportsFolderId as any).calls.first().args
        ).toEqual([authentication]);
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
      } finally {
        done();
      }
    });
  });

  describe("exported-completed, successful handling", () => {
    it("succeeds without moving download", async done => {
      try {
        spyOn(portal, "updateItem").and.callFake(async () => {
          return Promise.resolve();
        });

        spyOn(portal, "setItemAccess").and.callFake(async () => {
          return Promise.resolve();
        });

        spyOn(folderHelper, "getExportsFolderId").and.callFake(async () => {
          return Promise.resolve("export-folder-id");
        });

        spyOn(portal, "moveItem").and.callFake(async () => {
          return Promise.reject(new RestJsError("Already moved", "CONT_0011"));
        });

        spyOn(portal, "removeItem").and.callFake(async () => {
          return Promise.resolve();
        });

        const mockEventEmitter = new EventEmitter();
        spyOn(mockEventEmitter, "emit");
        await exportSuccessHandler({
          downloadId: "download-id",
          datasetId: "abcdef0123456789abcdef0123456789_0",
          authentication,
          exportCreated: 1000,
          eventEmitter: mockEventEmitter
        });

        await delay(100);
        expect(portal.updateItem).toHaveBeenCalledTimes(1);
        expect((portal.updateItem as any).calls.first().args).toEqual([
          {
            item: {
              id: "download-id",
              typekeywords: `exportItem:abcdef0123456789abcdef0123456789,exportLayer:0,modified:1000,spatialRefId:undefined`
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
        expect(folderHelper.getExportsFolderId).toHaveBeenCalledTimes(1);
        expect(
          (folderHelper.getExportsFolderId as any).calls.first().args
        ).toEqual([authentication]);
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

        spyOn(portal, "updateItem").and.callFake(async () => {
          return Promise.resolve();
        });

        spyOn(portal, "setItemAccess").and.callFake(async () => {
          return Promise.resolve();
        });

        spyOn(folderHelper, "getExportsFolderId").and.callFake(async () => {
          return Promise.resolve("export-folder-id");
        });

        spyOn(portal, "moveItem").and.callFake(async () => {
          return Promise.resolve();
        });

        spyOn(portal, "removeItem").and.callFake(async () => {
          return Promise.resolve();
        });

        const mockEventEmitter = new EventEmitter();
        spyOn(mockEventEmitter, "emit");
        await exportSuccessHandler({
          downloadId: "download-id",
          datasetId: "abcdef0123456789abcdef0123456789_0",
          authentication,
          exportCreated: 1000,
          eventEmitter: mockEventEmitter,
          spatialRefId: "3857"
        });

        await delay(100);
        expect(portal.updateItem).toHaveBeenCalledTimes(1);
        expect((portal.updateItem as any).calls.first().args).toEqual([
          {
            item: {
              id: "download-id",
              typekeywords: `exportItem:abcdef0123456789abcdef0123456789,exportLayer:0,modified:1000,spatialRefId:3857`
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
        expect(folderHelper.getExportsFolderId).toHaveBeenCalledTimes(1);
        expect(
          (folderHelper.getExportsFolderId as any).calls.first().args
        ).toEqual([authentication]);
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
      } catch (err) {
        expect(err).toEqual(undefined);
      } finally {
        done();
      }
    });

    it("succeeds with multilayer dataset", async done => {
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

        spyOn(folderHelper, "getExportsFolderId").and.callFake(async () => {
          return Promise.resolve("export-folder-id");
        });

        spyOn(portal, "moveItem").and.callFake(async () => {
          return Promise.resolve();
        });

        spyOn(portal, "removeItem").and.callFake(async () => {
          return Promise.resolve();
        });

        const mockEventEmitter = new EventEmitter();
        spyOn(mockEventEmitter, "emit");
        await exportSuccessHandler({
          downloadId: "download-id",
          datasetId: "abcdef0123456789abcdef0123456789",
          authentication,
          exportCreated: 1000,
          eventEmitter: mockEventEmitter
        });

        await delay(100);
        expect(portal.updateItem).toHaveBeenCalledTimes(1);
        expect((portal.updateItem as any).calls.first().args).toEqual([
          {
            item: {
              id: "download-id",
              typekeywords: `exportItem:abcdef0123456789abcdef0123456789,exportLayer:null,modified:1000,spatialRefId:undefined`
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
        expect(folderHelper.getExportsFolderId).toHaveBeenCalledTimes(1);
        expect(
          (folderHelper.getExportsFolderId as any).calls.first().args
        ).toEqual([authentication]);
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
      } catch (err) {
        expect(err).toEqual(undefined);
      } finally {
        done();
      }
    });
  });
});
