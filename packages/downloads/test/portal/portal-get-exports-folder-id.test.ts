import * as portal from "@esri/arcgis-rest-portal";
import { UserSession } from "@esri/arcgis-rest-auth";
import { getExportsFolderId } from "../../src/portal/portal-get-exports-folder-id";

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

  it("userContent failure", async done => {
    try {
      spyOn(portal, "getUserContent").and.callFake(async () => {
        return Promise.reject(new Error("5xx"));
      });

      await getExportsFolderId(authentication);
      fail();
    } catch (err) {
      expect(err.message).toEqual("5xx");
      expect(portal.getUserContent).toHaveBeenCalledTimes(1);
      expect((portal.getUserContent as any).calls.first().args).toEqual([
        { authentication }
      ]);
    } finally {
      done();
    }
  });

  it("createFolder failure", async done => {
    try {
      spyOn(portal, "getUserContent").and.callFake(async () => {
        return Promise.resolve({ folders: [] });
      });

      spyOn(portal, "createFolder").and.callFake(async () => {
        return Promise.reject(new Error("5xx"));
      });

      spyOn(portal, "removeItem").and.callFake(async () => {
        return Promise.resolve();
      });

      await getExportsFolderId(authentication);
      fail();
    } catch (err) {
      expect(err.message).toEqual("5xx");
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
    } finally {
      done();
    }
  });

  it("succeeds without existing exports folder", async done => {
    try {
      spyOn(portal, "getUserContent").and.callFake(async () => {
        return Promise.resolve({ folders: [] });
      });

      spyOn(portal, "createFolder").and.callFake(async () => {
        return Promise.resolve({ folder: { id: "export-folder-id" } });
      });

      const result = await getExportsFolderId(authentication);
      expect(result).toBe("export-folder-id");
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
    } catch (err) {
      expect(err).toEqual(undefined);
    } finally {
      done();
    }
  });

  it("succeeds with existing exports folder", async done => {
    try {
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

      const result = await getExportsFolderId(authentication);
      expect(result).toBe("export-folder-id");

      expect(portal.getUserContent).toHaveBeenCalledTimes(1);
      expect((portal.getUserContent as any).calls.first().args).toEqual([
        { authentication }
      ]);
      expect(portal.createFolder).toHaveBeenCalledTimes(0);
    } catch (err) {
      expect(err).toEqual(undefined);
    } finally {
      done();
    }
  });
});
