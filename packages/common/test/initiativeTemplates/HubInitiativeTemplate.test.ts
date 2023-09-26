import * as PortalModule from "@esri/arcgis-rest-portal";
import {
  ArcGISContextManager,
  Catalog,
  getProp,
  IHubInitiativeTemplate,
  IHubInitiativeTemplateEditor,
} from "../../src";
import { MOCK_AUTH } from "../mocks/mock-auth";
import * as editModule from "../../src/initiativeTemplates/edit";
import * as fetchModule from "../../src/initiativeTemplates/fetch";
import * as viewModule from "../../src/initiativeTemplates/view";
import * as EditConfigModule from "../../src/core/schemas/getEditorConfig";
import { HubInitiativeTemplate } from "../../src/initiativeTemplates/HubInitiativeTemplate";
import * as EnrichEntityModule from "../../src/core/enrichEntity";

describe("HubInitiativeTemplate Class: ", () => {
  let authdCtxMgr: ArcGISContextManager;
  let unauthdCtxMgr: ArcGISContextManager;
  beforeEach(async () => {
    unauthdCtxMgr = await ArcGISContextManager.create();
    // When we pass in all this information, the context
    // manager will not try to fetch anything, so no need
    // to mock those calls
    authdCtxMgr = await ArcGISContextManager.create({
      authentication: MOCK_AUTH,
      currentUser: {
        username: "casey",
        privileges: ["portal:user:shareToGroup"],
      } as unknown as PortalModule.IUser,
      portal: {
        name: "DC R&D Center",
        id: "BRXFAKE",
        urlKey: "fake-org",
      } as unknown as PortalModule.IPortal,
      portalUrl: "https://myserver.com",
    });
  });

  describe("static methods:", () => {
    it("loads from minimal json", () => {
      const createSpy = spyOn(editModule, "createInitiativeTemplate");
      const chk = HubInitiativeTemplate.fromJson(
        { name: "Test Initiative Template" },
        authdCtxMgr.context
      );

      expect(createSpy).not.toHaveBeenCalled();
      expect(chk.toJson().name).toEqual("Test Initiative Template");
      // adds empty permissions and catalog
      const json = chk.toJson();
      expect(json.permissions).toEqual([]);
      expect(json.catalog).toEqual({ schemaVersion: 0 });
    });
    it("loads based on identifier", async () => {
      const fetchSpy = spyOn(
        fetchModule,
        "fetchInitiativeTemplate"
      ).and.callFake((id: string) => {
        return Promise.resolve({
          id,
          name: "Test Initiative Template",
        });
      });

      const chk = await HubInitiativeTemplate.fetch("3ef", authdCtxMgr.context);
      expect(fetchSpy).toHaveBeenCalledTimes(1);
      expect(chk.toJson().id).toBe("3ef");
      expect(chk.toJson().name).toBe("Test Initiative Template");
    });

    it("handle load missing projects", async () => {
      const fetchSpy = spyOn(
        fetchModule,
        "fetchInitiativeTemplate"
      ).and.callFake((id: string) => {
        const err = new Error(
          "CONT_0001: Item does not exist or is inaccessible."
        );
        return Promise.reject(err);
      });
      try {
        await HubInitiativeTemplate.fetch("3ef", authdCtxMgr.context);
      } catch (ex) {
        expect(fetchSpy).toHaveBeenCalledTimes(1);
        expect((ex as any).message).toBe("Initiative Template not found.");
      }
    });

    it("handle load errors", async () => {
      const fetchSpy = spyOn(
        fetchModule,
        "fetchInitiativeTemplate"
      ).and.callFake((id: string) => {
        const err = new Error("ZOMG!");
        return Promise.reject(err);
      });
      try {
        await HubInitiativeTemplate.fetch("3ef", authdCtxMgr.context);
      } catch (ex) {
        expect(fetchSpy).toHaveBeenCalledTimes(1);
        expect((ex as any).message).toBe("ZOMG!");
      }
    });

    // it("returns editorConfig", async () => {
    //   const spy = spyOn(schemasModule, "getEntityEditorSchemas").and.callFake(
    //     () => {
    //       return Promise.resolve({ schema: {}, uiSchema: {} });
    //     }
    //   );

    //   await HubInitiativeTemplate.getEditorConfig("test.scope", "hub:initiativeTemplate:edit");
    //   expect(spy).toHaveBeenCalledTimes(1);
    //   expect(spy).toHaveBeenCalledWith("test.scope", "hub:initiativeTemplate:edit", []);
    // });

    // it("returns editorConfig integrating options", async () => {
    //   const spy = spyOn(schemasModule, "getEntityEditorSchemas").and.callFake(
    //     () => {
    //       return Promise.resolve({ schema: {}, uiSchema: {} });
    //     }
    //   );

    //   const opts: UiSchemaElementOptions[] = [];

    //   await HubInitiativeTemplate.getEditorConfig("test.scope", "hub:initiativeTemplate:edit", opts);
    //   expect(spy).toHaveBeenCalledTimes(1);
    //   expect(spy).toHaveBeenCalledWith("test.scope", "hub:initiativeTemplate:edit", opts);
    // });
  });

  it("convertToCardModel: delegates to the initiativeTemplateToCardModel util", async () => {
    const spy = spyOn(viewModule, "initiativeTemplateToCardModel");

    const chk = await HubInitiativeTemplate.fromJson(
      { name: "Test Project" },
      authdCtxMgr.context
    );
    await chk.convertToCardModel();

    expect(spy).toHaveBeenCalledTimes(1);
  });

  it("save call createInitiativeTemplate if object does not have an id", async () => {
    const createSpy = spyOn(
      editModule,
      "createInitiativeTemplate"
    ).and.callFake((p: IHubInitiativeTemplate) => {
      return Promise.resolve(p);
    });
    const chk = await HubInitiativeTemplate.fromJson(
      { name: "Test Initiative Template" },
      authdCtxMgr.context
    );
    await chk.save();
    expect(createSpy).toHaveBeenCalledTimes(1);
    expect(chk.toJson().name).toEqual("Test Initiative Template");
  });

  it("create saves the instance if passed true", async () => {
    const createSpy = spyOn(
      editModule,
      "createInitiativeTemplate"
    ).and.callFake((p: IHubInitiativeTemplate) => {
      p.id = "3ef";
      return Promise.resolve(p);
    });
    const chk = await HubInitiativeTemplate.create(
      { name: "Test Initiative Template" },
      authdCtxMgr.context,
      true
    );

    expect(createSpy).toHaveBeenCalledTimes(1);
    expect(chk.toJson().name).toEqual("Test Initiative Template");
  });

  it("create does not save by default", async () => {
    const createSpy = spyOn(editModule, "createInitiativeTemplate");
    const chk = await HubInitiativeTemplate.create(
      { name: "Test Initiative Template" },
      authdCtxMgr.context
    );

    expect(createSpy).not.toHaveBeenCalled();
    expect(chk.toJson().name).toEqual("Test Initiative Template");
  });

  it("update applies partial chagnes to internal state", () => {
    const chk = HubInitiativeTemplate.fromJson(
      { name: "Test Initiative Template", catalog: { schemaVersion: 0 } },
      authdCtxMgr.context
    );
    chk.update({
      name: "Test Initiative Template 2",
      permissions: [
        {
          permission: "hub:initiativeTemplate:create",
          collaborationType: "group",
          collaborationId: "3ef",
        },
      ],
      catalog: { schemaVersion: 2 },
    });
    expect(chk.toJson().name).toEqual("Test Initiative Template 2");
    expect(chk.toJson().catalog).toEqual({ schemaVersion: 2 });

    chk.update({ tags: ["one", "two"] });
    expect(chk.toJson().tags).toEqual(["one", "two"]);
  });

  it("save updates if object has id", async () => {
    const updateSpy = spyOn(
      editModule,
      "updateInitiativeTemplate"
    ).and.callFake((p: IHubInitiativeTemplate) => {
      return Promise.resolve(p);
    });
    const chk = HubInitiativeTemplate.fromJson(
      {
        id: "bc3",
        name: "Test Project",
        catalog: { schemaVersion: 0 },
      },
      authdCtxMgr.context
    );
    await chk.save();
    expect(updateSpy).toHaveBeenCalledTimes(1);
  });

  it("delete", async () => {
    const deleteSpy = spyOn(
      editModule,
      "deleteInitiativeTemplate"
    ).and.callFake(() => {
      return Promise.resolve();
    });
    const chk = HubInitiativeTemplate.fromJson(
      { name: "Test Initiative Template" },
      authdCtxMgr.context
    );
    await chk.delete();
    expect(deleteSpy).toHaveBeenCalledTimes(1);
    // all fns should now throw an error
    expect(() => {
      chk.toJson();
    }).toThrowError("Entity is already destroyed.");

    expect(() => {
      chk.update({ name: "Test Project 2" } as IHubInitiativeTemplate);
    }).toThrowError("HubInitiativeTemplate is already destroyed.");

    // async calls
    try {
      await chk.delete();
    } catch (e) {
      expect((e as any).message).toEqual(
        "HubInitiativeTemplate is already destroyed."
      );
    }

    try {
      await chk.save();
    } catch (e) {
      expect((e as any).message).toEqual(
        "HubInitiativeTemplate is already destroyed."
      );
    }
  });

  it("internal instance accessors", () => {
    const chk = HubInitiativeTemplate.fromJson(
      { name: "Test Initiative Template", catalog: { schemaVersion: 0 } },
      authdCtxMgr.context
    );

    expect(chk.catalog instanceof Catalog).toBeTruthy();
  });

  it("setting catalog updates catalog instance", () => {
    const chk = HubInitiativeTemplate.fromJson(
      { name: "Test Initiative Template", catalog: { schemaVersion: 0 } },
      authdCtxMgr.context
    );
    chk.update({ catalog: { schemaVersion: 2 } });
    expect(chk.toJson().catalog).toEqual({ schemaVersion: 2 });
    expect(chk.catalog.schemaVersion).toEqual(2);
  });

  describe("IWithEditorBehavior:", () => {
    it("getEditorConfig delegates to helper", async () => {
      const spy = spyOn(EditConfigModule, "getEditorConfig").and.callFake(
        () => {
          return Promise.resolve({ fake: "config" });
        }
      );
      const chk = HubInitiativeTemplate.fromJson(
        {
          id: "bc3",
          name: "Test Entity",
        },
        authdCtxMgr.context
      );
      const result = await chk.getEditorConfig(
        "i18n.Scope",
        "hub:initiativeTemplate:edit"
      );
      expect(result).toEqual({ fake: "config" } as any);
      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveBeenCalledWith(
        "i18n.Scope",
        "hub:initiativeTemplate:edit",
        chk.toJson(),
        authdCtxMgr.context
      );
    });

    describe("toEditor", () => {
      it("optionally enriches the entity", async () => {
        const enrichEntitySpy = spyOn(
          EnrichEntityModule,
          "enrichEntity"
        ).and.returnValue(Promise.resolve({}));
        const chk = HubInitiativeTemplate.fromJson(
          { id: "bc3" },
          authdCtxMgr.context
        );
        await chk.toEditor({}, ["someEnrichment AS _someEnrichment"]);
        expect(enrichEntitySpy).toHaveBeenCalledTimes(1);
      });
      it("toEditor converst entity to correct structure", async () => {
        const chk = HubInitiativeTemplate.fromJson(
          {
            id: "bc3",
            name: "Test Entity",
            thumbnailUrl: "https://myserver.com/thumbnail.png",
          },
          authdCtxMgr.context
        );
        const result = await chk.toEditor();
        // NOTE: If additional transforms are added in the class they should have tests here
        expect(result.id).toEqual("bc3");
        expect(result.name).toEqual("Test Entity");
        expect(result.thumbnailUrl).toEqual(
          "https://myserver.com/thumbnail.png"
        );
      });
    });

    describe("fromEditor:", () => {
      let updateSpy: jasmine.Spy;
      let createSpy: jasmine.Spy;
      beforeEach(() => {
        updateSpy = spyOn(editModule, "updateInitiativeTemplate").and.callFake(
          (p: IHubInitiativeTemplate) => {
            return Promise.resolve(p);
          }
        );
        createSpy = spyOn(editModule, "createInitiativeTemplate").and.callFake(
          (e: any) => {
            e.id = "3ef";
            return Promise.resolve(e);
          }
        );
      });
      it("handles simple prop change", async () => {
        const chk = HubInitiativeTemplate.fromJson(
          {
            id: "bc3",
            name: "Test Entity",
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
        const chk = HubInitiativeTemplate.fromJson(
          {
            id: "bc3",
            name: "Test Entity",
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
        const chk = HubInitiativeTemplate.fromJson(
          {
            id: "bc3",
            name: "Test Entity",
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

      it("works on create", async () => {
        const chk = HubInitiativeTemplate.fromJson(
          {
            name: "Test Entity",
          },
          authdCtxMgr.context
        );
        const editor = await chk.toEditor();

        await chk.fromEditor(editor);
        expect(createSpy).toHaveBeenCalledTimes(1);
      });
    });
  });
});
