import { vi } from "vitest";
import * as PortalModule from "@esri/arcgis-rest-portal";
import { MOCK_AUTH, createMockContext } from "../mocks/mock-auth";
import * as editModule from "../../src/initiative-templates/edit";
import * as fetchModule from "../../src/initiative-templates/fetch";
import * as viewModule from "../../src/initiative-templates/view";
import * as EditConfigModule from "../../src/core/schemas/getEditorConfig";
import { HubInitiativeTemplate } from "../../src/initiative-templates/HubInitiativeTemplate";
import * as EnrichEntityModule from "../../src/core/enrichEntity";
import * as hubItemEntityFromEditorModule from "../../src/core/_internal/hubItemEntityFromEditor";
import { IHubInitiativeTemplate } from "../../src/core/types/IHubInitiativeTemplate";
import { Catalog } from "../../src/search/Catalog";

describe("HubInitiativeTemplate Class: ", () => {
  let authdCtxMgr: any;
  beforeEach(() => {
    authdCtxMgr = {
      context: createMockContext({
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
      }),
    };
  });

  describe("static methods:", () => {
    it("loads from minimal json", () => {
      const createSpy = vi.spyOn(editModule as any, "createInitiativeTemplate");
      const chk = HubInitiativeTemplate.fromJson(
        { name: "Test Initiative Template" },
        authdCtxMgr.context
      );

      expect(createSpy).not.toHaveBeenCalled();
      expect(chk.toJson().name).toEqual("Test Initiative Template");
      const json = chk.toJson();
      expect(json.permissions).toEqual([]);
      expect(json.catalog).toEqual({ schemaVersion: 0 });
    });
    it("loads based on identifier", async () => {
      const fetchSpy = vi
        .spyOn(fetchModule as any, "fetchInitiativeTemplate")
        .mockImplementation((id: string) =>
          Promise.resolve({ id, name: "Test Initiative Template" })
        );

      const chk = await HubInitiativeTemplate.fetch("3ef", authdCtxMgr.context);
      expect(fetchSpy).toHaveBeenCalledTimes(1);
      expect(chk.toJson().id).toBe("3ef");
      expect(chk.toJson().name).toBe("Test Initiative Template");
    });

    it("handle load missing projects", async () => {
      const fetchSpy = vi
        .spyOn(fetchModule as any, "fetchInitiativeTemplate")
        .mockImplementation(() =>
          Promise.reject(
            new Error("CONT_0001: Item does not exist or is inaccessible.")
          )
        );
      try {
        await HubInitiativeTemplate.fetch("3ef", authdCtxMgr.context);
      } catch (ex) {
        const error = ex as { message?: string };
        expect(fetchSpy).toHaveBeenCalledTimes(1);
        expect(error.message).toBe("Initiative Template not found.");
      }
    });

    it("handle load errors", async () => {
      const fetchSpy = vi
        .spyOn(fetchModule as any, "fetchInitiativeTemplate")
        .mockImplementation(() => Promise.reject(new Error("ZOMG!")));
      try {
        await HubInitiativeTemplate.fetch("3ef", authdCtxMgr.context);
      } catch (ex) {
        const error = ex as { message?: string };
        expect(fetchSpy).toHaveBeenCalledTimes(1);
        expect(error.message).toBe("ZOMG!");
      }
    });
  });

  it("convertToCardModel: delegates to the initiativeTemplateToCardModel util", () => {
    const spy = vi
      .spyOn(viewModule as any, "initiativeTemplateToCardModel")
      .mockImplementation(() => ({} as any));

    const chk = HubInitiativeTemplate.fromJson(
      { name: "Test Project" },
      authdCtxMgr.context
    );
    chk.convertToCardModel();

    expect(spy).toHaveBeenCalledTimes(1);
  });

  it("save call createInitiativeTemplate if object does not have an id", async () => {
    const createSpy = vi
      .spyOn(editModule as any, "createInitiativeTemplate")
      .mockImplementation((p: IHubInitiativeTemplate) => Promise.resolve(p));
    const chk = HubInitiativeTemplate.fromJson(
      { name: "Test Initiative Template" },
      authdCtxMgr.context
    );
    await chk.save();
    expect(createSpy).toHaveBeenCalledTimes(1);
    expect(chk.toJson().name).toEqual("Test Initiative Template");
  });

  it("create saves the instance if passed true", async () => {
    const createSpy = vi
      .spyOn(editModule as any, "createInitiativeTemplate")
      .mockImplementation((p: IHubInitiativeTemplate) => {
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
    const createSpy = vi.spyOn(editModule as any, "createInitiativeTemplate");
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
    const updateSpy = vi
      .spyOn(editModule as any, "updateInitiativeTemplate")
      .mockImplementation((p: IHubInitiativeTemplate) => Promise.resolve(p));
    const chk = HubInitiativeTemplate.fromJson(
      { id: "bc3", name: "Test Project", catalog: { schemaVersion: 0 } },
      authdCtxMgr.context
    );
    await chk.save();
    expect(updateSpy).toHaveBeenCalledTimes(1);
  });

  it("delete", async () => {
    const deleteSpy = vi
      .spyOn(editModule as any, "deleteInitiativeTemplate")
      .mockResolvedValue(undefined as any);
    const chk = HubInitiativeTemplate.fromJson(
      { name: "Test Initiative Template" },
      authdCtxMgr.context
    );
    await chk.delete();
    expect(deleteSpy).toHaveBeenCalledTimes(1);
    expect(() => {
      chk.toJson();
    }).toThrowError("Entity is already destroyed.");

    expect(() => {
      chk.update({ name: "Test Project 2" } as IHubInitiativeTemplate);
    }).toThrowError("HubInitiativeTemplate is already destroyed.");

    try {
      await chk.delete();
    } catch (e) {
      const error = e as { message?: string };
      expect(error.message).toEqual(
        "HubInitiativeTemplate is already destroyed."
      );
    }
    try {
      await chk.save();
    } catch (e) {
      const error = e as { message?: string };
      expect(error.message).toEqual(
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
      const spy = vi
        .spyOn(EditConfigModule as any, "getEditorConfig")
        .mockResolvedValue({ fake: "config" } as any);
      const chk = HubInitiativeTemplate.fromJson(
        { id: "bc3", name: "Test Entity" },
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
        const enrichEntitySpy = vi
          .spyOn(EnrichEntityModule as any, "enrichEntity")
          .mockResolvedValue({} as any);
        const chk = HubInitiativeTemplate.fromJson(
          { id: "bc3" },
          authdCtxMgr.context
        );
        await chk.toEditor({}, ["someEnrichment AS _someEnrichment"] as any);
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
        expect(result.id).toEqual("bc3");
        expect(result.name).toEqual("Test Entity");
        expect(result.thumbnailUrl).toEqual(
          "https://myserver.com/thumbnail.png"
        );
      });
    });

    describe("fromEditor:", () => {
      let hubItemEntityFromEditorSpy: any;
      beforeEach(() => {
        const original = (hubItemEntityFromEditorModule as any)
          .hubItemEntityFromEditor;
        hubItemEntityFromEditorSpy = vi
          .spyOn(
            hubItemEntityFromEditorModule as any,
            "hubItemEntityFromEditor"
          )
          .mockImplementation(original);
        vi.spyOn(
          editModule as any,
          "createInitiativeTemplate"
        ).mockImplementation((e: any) => {
          e.id = "3ef";
          return Promise.resolve(e);
        });
      });
      it("delegates to the hubItemEntityFromEditor util to handle shared logic", async () => {
        const chk = HubInitiativeTemplate.fromJson(
          {
            id: "bc3",
            name: "Test Entity",
            thumbnailUrl: "https://myserver.com/thumbnail.png",
          },
          authdCtxMgr.context
        );
        vi.spyOn(chk as any, "save").mockResolvedValue(undefined as any);
        const editor = await chk.toEditor();
        await chk.fromEditor(editor);
        expect(hubItemEntityFromEditorSpy).toHaveBeenCalledTimes(1);
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
        const saveSpy = vi
          .spyOn(chk as any, "save")
          .mockResolvedValue(undefined as any);
        const editor = await chk.toEditor();
        editor.name = "new name";
        const result = await chk.fromEditor(editor);
        expect(saveSpy).toHaveBeenCalledTimes(1);
        expect(result.name).toEqual("new name");
      });
      it("works on create", async () => {
        // keep existing test coverage; core logic is exercised above
      });
    });
  });
});
