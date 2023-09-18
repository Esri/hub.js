import * as PortalModule from "@esri/arcgis-rest-portal";
import { ArcGISContextManager } from "../../src/ArcGISContextManager";
import { MOCK_AUTH } from "../mocks/mock-auth";
import { IHubEditableContent } from "../../src/core/types";
import { HubContent } from "../../src/content/HubContent";
import * as editModule from "../../src/content/edit";
import * as EditConfigModule from "../../src/core/schemas/getEditorConfig";
import { getProp } from "../../src/objects/get-prop";
import * as EnrichEntityModule from "../../src/core/enrichEntity";

describe("HubContent class", () => {
  let authdCtxMgr: ArcGISContextManager;
  // let unauthdCtxMgr: ArcGISContextManager;
  beforeEach(async () => {
    // unauthdCtxMgr = await ArcGISContextManager.create();
    // When we pass in all this information, the context
    // manager will not try to fetch anything, so no need
    // to mock those calls
    authdCtxMgr = await ArcGISContextManager.create({
      authentication: MOCK_AUTH,
      currentUser: {
        username: "casey",
      } as unknown as PortalModule.IUser,
      portal: {
        name: "DC R&D Center",
        id: "BRXFAKE",
        urlKey: "fake-org",
      } as unknown as PortalModule.IPortal,
      portalUrl: "https://myserver.com",
    });
  });
  describe("ctor:", () => {
    it("save calls createContent if object does not have an id", async () => {
      const createSpy = spyOn(editModule, "createContent").and.callFake(
        (p: IHubEditableContent) => {
          return Promise.resolve(p);
        }
      );
      const chk = HubContent.fromJson(
        { name: "Test Content" },
        authdCtxMgr.context
      );
      await chk.save();
      expect(createSpy).toHaveBeenCalledTimes(1);
      expect(chk.toJson().name).toEqual("Test Content");
    });
    it("save calls updateContent if object does not have an id", async () => {
      const updateSpy = spyOn(editModule, "updateContent").and.callFake(
        (p: IHubEditableContent) => {
          return Promise.resolve(p);
        }
      );
      const chk = HubContent.fromJson(
        {
          id: "bc3",
          name: "Test Content",
        },
        authdCtxMgr.context
      );
      await chk.save();
      expect(updateSpy).toHaveBeenCalledTimes(1);
      expect(chk.toJson().name).toEqual("Test Content");
    });
  });
  it("update applies partial changes to internal state", () => {
    const chk = HubContent.fromJson(
      {
        id: "bc3",
        name: "Test Content",
      },
      authdCtxMgr.context
    );
    chk.update({
      name: "Test Content 2",
    });
    expect(chk.toJson().name).toEqual("Test Content 2");

    chk.update({ tags: ["one", "two"] });
    expect(chk.toJson().tags).toEqual(["one", "two"]);
  });
  it("delete", async () => {
    const deleteSpy = spyOn(editModule, "deleteContent").and.callFake(() => {
      return Promise.resolve();
    });
    const chk = HubContent.fromJson(
      {
        id: "bc3",
        name: "Test Content",
      },
      authdCtxMgr.context
    );
    await chk.delete();
    expect(deleteSpy).toHaveBeenCalledTimes(1);

    // all fns should now throw an error
    expect(() => {
      chk.toJson();
    }).toThrowError("Entity is already destroyed.");

    expect(() => {
      chk.update({ name: "Test Content 2" } as IHubEditableContent);
    }).toThrowError("HubContent is already destroyed.");

    // async calls
    try {
      await chk.delete();
    } catch (e) {
      expect(e.message).toEqual("HubContent is already destroyed.");
    }

    try {
      await chk.save();
    } catch (e) {
      expect(e.message).toEqual("HubContent is already destroyed.");
    }
  });
  describe("IWithEditorBehavior:", () => {
    it("getEditorConfig delegates to helper", async () => {
      const spy2 = spyOn(EditConfigModule, "getEditorConfig").and.callFake(
        () => {
          return Promise.resolve({ fake: "config" });
        }
      );
      const chk = HubContent.fromJson(
        {
          id: "bc3",
          name: "Test Content",
        },
        authdCtxMgr.context
      );
      const result = await chk.getEditorConfig(
        "i18n.Scope",
        "hub:content:edit"
      );
      expect(result).toEqual({ fake: "config" } as any);
      expect(spy2).toHaveBeenCalledTimes(1);
      expect(spy2).toHaveBeenCalledWith(
        "i18n.Scope",
        "hub:content:edit",
        chk.toJson(),
        authdCtxMgr.context
      );
    });

    describe("toEditor:", () => {
      it("optionally enriches the entity", async () => {
        const enrichEntitySpy = spyOn(
          EnrichEntityModule,
          "enrichEntity"
        ).and.returnValue(Promise.resolve({}));
        const chk = HubContent.fromJson({ id: "bc3" }, authdCtxMgr.context);
        await chk.toEditor({}, ["someEnrichment AS _someEnrichment"]);

        expect(enrichEntitySpy).toHaveBeenCalledTimes(1);
      });
      it("converts entity to correct structure", async () => {
        const chk = HubContent.fromJson(
          {
            id: "bc3",
            name: "Test Content",
            thumbnailUrl: "https://myserver.com/thumbnail.png",
          },
          authdCtxMgr.context
        );
        const result = await chk.toEditor();
        // NOTE: If additional transforms are added in the class they should have tests here
        expect(result.id).toEqual("bc3");
        expect(result.name).toEqual("Test Content");
        expect(result.thumbnailUrl).toEqual(
          "https://myserver.com/thumbnail.png"
        );
      });
    });

    describe("fromEditor:", () => {
      it("handles simple prop change", async () => {
        const chk = HubContent.fromJson(
          {
            id: "bc3",
            name: "Test Content",
            thumbnailUrl: "https://myserver.com/thumbnail.png",
          },
          authdCtxMgr.context
        );
        // spy on the instance .save method and retrn void
        const saveSpy = spyOn(chk, "save").and.returnValue(Promise.resolve());
        // make changes to the editor
        const editor = await chk.toEditor();
        editor.name = "new name";
        // call fromEditor
        const result = await chk.fromEditor(editor);
        // expect the save method to have been called
        expect(saveSpy).toHaveBeenCalledTimes(1);
        // expect the name to have been updated
        expect(result.name).toEqual("new name");
      });
      it("handles thumbnail change", async () => {
        const chk = HubContent.fromJson(
          {
            id: "bc3",
            name: "Test Content",
            thumbnailUrl: "https://myserver.com/thumbnail.png",
          },
          authdCtxMgr.context
        );
        // spy on the instance .save method and retrn void
        const saveSpy = spyOn(chk, "save").and.returnValue(Promise.resolve());
        // make changes to the editor
        const editor = await chk.toEditor();
        editor.name = "new name";
        editor._thumbnail = {
          blob: "fake blob",
          filename: "thumbnail.png",
        };
        // call fromEditor
        const result = await chk.fromEditor(editor);
        // expect the save method to have been called
        expect(saveSpy).toHaveBeenCalledTimes(1);
        // since thumbnailCache is protected we can't really test that it's set
        // other than via code-coverage
        expect(getProp(result, "_thumbnail")).not.toBeDefined();
      });

      it("handles thumbnail clear", async () => {
        const chk = HubContent.fromJson(
          {
            id: "bc3",
            name: "Test Content",
            thumbnailUrl: "https://myserver.com/thumbnail.png",
          },
          authdCtxMgr.context
        );
        // spy on the instance .save method and retrn void
        const saveSpy = spyOn(chk, "save").and.returnValue(Promise.resolve());
        // make changes to the editor
        const editor = await chk.toEditor();
        editor.name = "new name";
        editor._thumbnail = {};
        // call fromEditor
        const result = await chk.fromEditor(editor);
        // expect the save method to have been called
        expect(saveSpy).toHaveBeenCalledTimes(1);
        // since thumbnailCache is protected we can't really test that it's set
        // other than via code-coverage
        expect(getProp(result, "_thumbnail")).not.toBeDefined();
      });
      it("handles extent from location", async () => {
        const chk = HubContent.fromJson(
          {
            id: "bc3",
            name: "Test Content",
            thumbnailUrl: "https://myserver.com/thumbnail.png",
            extent: [
              [-1, -1],
              [1, 1],
            ],
          },
          authdCtxMgr.context
        );
        // spy on the instance .save method and retrn void
        const saveSpy = spyOn(chk, "save").and.returnValue(Promise.resolve());
        // make changes to the editor
        const editor = await chk.toEditor();
        editor.name = "new name";
        editor.location = {
          extent: [
            [-2, -2],
            [2, 2],
          ],
          type: "custom",
        };
        // call fromEditor
        const result = await chk.fromEditor(editor);
        // expect the save method to have been called
        expect(saveSpy).toHaveBeenCalledTimes(1);
        expect(result.extent).toEqual([
          [-2, -2],
          [2, 2],
        ]);
      });
      it("throws if creating", async () => {
        const chk = HubContent.fromJson(
          {
            name: "Test Content",
            thumbnailUrl: "https://myserver.com/thumbnail.png",
          },
          authdCtxMgr.context
        );
        // spy on the instance .save method and retrn void
        const saveSpy = spyOn(chk, "save").and.returnValue(Promise.resolve());
        // make changes to the editor
        const editor = await chk.toEditor();
        editor.name = "new name";
        // call fromEditor
        try {
          await chk.fromEditor(editor);
        } catch (ex) {
          expect(ex.message).toContain("Cannot create");
          expect(saveSpy).toHaveBeenCalledTimes(0);
        }
      });
    });
  });
});
