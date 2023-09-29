import { ArcGISContextManager } from "../../src/ArcGISContextManager";
import { HubTemplate } from "../../src/templates/HubTemplate";
import { initContextManager } from "./fixtures";
import * as editModule from "../../src/templates/edit";

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
      let createSpy;
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
});
