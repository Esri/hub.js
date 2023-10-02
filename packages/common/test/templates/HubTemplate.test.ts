import { ArcGISContextManager } from "../../src/ArcGISContextManager";
import { HubTemplate } from "../../src/templates/HubTemplate";
import { initContextManager } from "./fixtures";
import { IHubTemplate } from "../../src/core/types/IHubTemplate";
import { getProp } from "../../src/objects/get-prop";
import * as editModule from "../../src/templates/edit";
import * as fetchModule from "../../src/templates/fetch";
import * as getEditorConfigModule from "../../src/core/schemas/getEditorConfig";
import * as enrichEntityModule from "../../src/core/enrichEntity";

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

  describe("IWithEditorBehavior", () => {
    describe("getEditorConfig", () => {
      it("delegates to the schema subsystem", async () => {
        const getEditorConfigSpy = spyOn(
          getEditorConfigModule,
          "getEditorConfig"
        ).and.callFake(() => Promise.resolve({ fake: "config" }));

        const chk = HubTemplate.fromJson(
          { id: "00c", name: "Test Template" },
          authdCtxMgr.context
        );
        const result = await chk.getEditorConfig(
          "i18n.Scope",
          "hub:template:edit"
        );
        expect(result).toEqual({ fake: "config" } as any);
        expect(getEditorConfigSpy).toHaveBeenCalledTimes(1);
        expect(getEditorConfigSpy).toHaveBeenCalledWith(
          "i18n.Scope",
          "hub:template:edit",
          chk.toJson(),
          authdCtxMgr.context
        );
      });
    });

    describe("toEditor", () => {
      it("optionally enriches the entity", async () => {
        const enrichEntitySpy = spyOn(
          enrichEntityModule,
          "enrichEntity"
        ).and.returnValue(Promise.resolve({}));
        const chk = HubTemplate.fromJson({ id: "00c" }, authdCtxMgr.context);
        await chk.toEditor({}, ["someEnrichment AS _someEnrichment"]);
        expect(enrichEntitySpy).toHaveBeenCalledTimes(1);
      });
      it("transforms the entity to an editor object", async () => {
        const chk = HubTemplate.fromJson(
          { id: "00c", name: "Test Template" },
          authdCtxMgr.context
        );
        const result = await chk.toEditor();

        // NOTE: additional transform tests should be added here
        expect(result.id).toEqual("00c");
        expect(result.name).toEqual("Test Template");
      });
    });

    describe("fromEditor:", () => {
      let createSpy: jasmine.Spy;
      beforeEach(() => {
        createSpy = spyOn(editModule, "createTemplate").and.callFake(() =>
          Promise.resolve({ id: "00c" })
        );
      });

      it("handles simple value change", async () => {
        const chk = HubTemplate.fromJson(
          { id: "00c", name: "Test Template" },
          authdCtxMgr.context
        );
        // 1. spy on the instance .save method and return void
        const saveSpy = spyOn(chk, "save").and.returnValue(Promise.resolve());
        // 2. make changes to the editor
        const editor = await chk.toEditor();
        editor.name = "Updated Name";

        const result = await chk.fromEditor(editor);
        expect(saveSpy).toHaveBeenCalledTimes(1);
        expect(result.name).toEqual("Updated Name");
      });
      it("handles thumbnail change", async () => {
        const chk = HubTemplate.fromJson(
          {
            id: "00c",
            name: "Test Template",
            thumbnailUrl: "https://myserver.com/thumbnail.png",
          },
          authdCtxMgr.context
        );

        // 1. spy on the instance .save method and return void
        const saveSpy = spyOn(chk, "save").and.returnValue(Promise.resolve());
        // 2. make changes to the thumbnail
        const editor = await chk.toEditor();
        editor._thumbnail = {
          blob: "fake blob",
          filename: "thumbnail.png",
        };

        const result = await chk.fromEditor(editor);
        expect(saveSpy).toHaveBeenCalledTimes(1);
        expect(getProp(result, "_thumbnail")).not.toBeDefined();
      });

      it("handles thumbnail clear", async () => {
        const chk = HubTemplate.fromJson(
          {
            id: "00c",
            name: "Test Template",
            thumbnailUrl: "https://myserver.com/thumbnail.png",
          },
          authdCtxMgr.context
        );

        // 1. spy on the instance .save method and return void
        const saveSpy = spyOn(chk, "save").and.returnValue(Promise.resolve());
        // 2. clear the thumbnail
        const editor = await chk.toEditor();
        editor._thumbnail = {};

        const result = await chk.fromEditor(editor);
        expect(saveSpy).toHaveBeenCalledTimes(1);
        expect(getProp(result, "_thumbnail")).not.toBeDefined();
      });

      it("works for Template creation", async () => {
        const chk = HubTemplate.fromJson(
          { name: "Test Template" },
          authdCtxMgr.context
        );
        const editor = await chk.toEditor();

        await chk.fromEditor(editor);
        expect(createSpy).toHaveBeenCalledTimes(1);
      });
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
