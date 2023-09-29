import { ArcGISContextManager } from "../../src/ArcGISContextManager";
import { HubTemplate } from "../../src/templates/HubTemplate";
import { initContextManager } from "./fixtures";
import { IHubTemplate } from "../../src/core/types/IHubTemplate";
import * as editModule from "../../src/templates/edit";
import * as fetchModule from "../../src/templates/fetch";

describe("HubTemplate Class", () => {
  let authdCtxMgr: ArcGISContextManager;
  beforeEach(async () => {
    authdCtxMgr = await initContextManager();
  });

  describe("static methods", () => {
    describe("fromJson", () => {
      it("creates a HubTemplate instance from a partial IHubTemplate object", () => {
        const instance = HubTemplate.fromJson(
          { name: "Mock Template" },
          authdCtxMgr.context
        );

        const json = instance.toJson();
        expect(json.name).toEqual("Mock Template");
        expect(json.permissions).toEqual([]);
        expect(json.catalog).toEqual({ schemaVersion: 0 });
      });
    });

    describe("create", () => {
      let createSpy: any;
      beforeEach(() => {
        createSpy = spyOn(editModule, "createTemplate").and.callFake(() =>
          Promise.resolve({ id: "00c" })
        );
      });
      afterEach(() => createSpy.calls.reset());

      it("saves the instance when prompted to", async () => {
        await HubTemplate.create(
          { name: "Test Template" },
          authdCtxMgr.context,
          true // save
        );
        expect(createSpy).toHaveBeenCalledTimes(1);
      });
      it("does not save by default", async () => {
        await HubTemplate.create(
          { name: "Test Template" },
          authdCtxMgr.context
        );
        expect(createSpy).not.toHaveBeenCalled();
      });
    });

    describe("fetch", () => {
      it("fetches the Template backing item", async () => {
        const fetchSpy = spyOn(fetchModule, "fetchTemplate").and.callFake(() =>
          Promise.resolve({ id: "00c" })
        );

        const chk = await HubTemplate.fetch("00c", authdCtxMgr.context);

        expect(fetchSpy).toHaveBeenCalledTimes(1);
        expect(chk.toJson().id).toBe("00c");
      });
      it("catches errors when attempting to fetch missing or inaccessible templates", async () => {
        const fetchSpy = spyOn(fetchModule, "fetchTemplate").and.callFake(() =>
          Promise.reject(
            new Error("CONT_0001: Item does not exist or is inaccessible.")
          )
        );

        try {
          await HubTemplate.fetch("00c", authdCtxMgr.context);
        } catch (ex) {
          expect(fetchSpy).toHaveBeenCalledTimes(1);
          expect((ex as any).message).toBe("Template 00c not found.");
        }
      });
      it("catches other errors", async () => {
        const fetchSpy = spyOn(fetchModule, "fetchTemplate").and.callFake(() =>
          Promise.reject(new Error("error"))
        );

        try {
          await HubTemplate.fetch("00c", authdCtxMgr.context);
        } catch (ex) {
          expect(fetchSpy).toHaveBeenCalledTimes(1);
          expect((ex as any).message).toBe("error");
        }
      });
    });
  });

  describe("save", () => {
    it("creates a backing item for a template entity if one does not already exist", async () => {
      const createSpy = spyOn(editModule, "createTemplate").and.callFake(() =>
        Promise.resolve()
      );

      const chk = HubTemplate.fromJson(
        { name: "Test Template" },
        authdCtxMgr.context
      );
      await chk.save();

      expect(createSpy).toHaveBeenCalledTimes(1);
    });
    it("updates the backing item of the template entity if it already exists", async () => {
      const updateSpy = spyOn(editModule, "updateTemplate").and.callFake(() =>
        Promise.resolve()
      );

      const chk = HubTemplate.fromJson(
        { id: "00c", name: "Test Template" },
        authdCtxMgr.context
      );
      await chk.save();

      expect(updateSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe("update", () => {
    it("updates the instance's internal entity state", async () => {
      const chk = HubTemplate.fromJson(
        { id: "00c", name: "Test Template" },
        authdCtxMgr.context
      );
      await chk.update({
        name: "Test Template Updated",
      });

      expect(chk.toJson().name).toBe("Test Template Updated");
    });
  });

  describe("delete", () => {
    let deleteSpy: any;
    let chk: any;
    beforeEach(() => {
      deleteSpy = spyOn(editModule, "deleteTemplate").and.callFake(() =>
        Promise.resolve()
      );
      chk = HubTemplate.fromJson(
        { id: "00c", name: "Test Template" },
        authdCtxMgr.context
      );
    });

    it("deletes the Hub Template's backing item", async () => {
      await chk.delete();
      expect(deleteSpy).toHaveBeenCalledTimes(1);
    });
    it("sets isDestroyed to true so that all other methods throw an error", async () => {
      const destroyedError = "HubTemplate is already destroyed.";
      expect(chk.isDestroyed).toBeFalsy();

      await chk.delete();

      expect(chk.isDestroyed).toBeTruthy();
      expect(() => {
        chk.toJson();
      }).toThrowError("Entity is already destroyed.");
      expect(() => {
        chk.update({} as IHubTemplate);
      }).toThrowError(destroyedError);
      try {
        await chk.delete();
      } catch (e) {
        expect((e as any).message).toEqual(destroyedError);
      }
      try {
        await chk.save();
      } catch (e) {
        expect((e as any).message).toEqual(destroyedError);
      }
    });
  });
});
