import * as PortalModule from "@esri/arcgis-rest-portal";
import { createMockContext, MOCK_AUTH } from "../mocks/mock-auth";
import { HubPage } from "../../src/pages/HubPage";
import * as HubPagesModule from "../../src/pages/HubPages";
import * as EditConfigModule from "../../src/core/schemas/getEditorConfig";
import * as EnrichEntityModule from "../../src/core/enrichEntity";
import { IHubPage } from "../../src/core/types/IHubPage";
import { getProp } from "../../src/objects/get-prop";
import { vi } from "vitest";

describe("HubPage Class:", () => {
  let authdCtxMgr: any;
  let portalCtxMgr: any;
  beforeEach(() => {
    authdCtxMgr = {
      context: createMockContext({
        authentication: MOCK_AUTH,
        currentUser: { username: "casey" } as unknown as PortalModule.IUser,
        portalSelf: {
          name: "DC R&D Center",
          id: "BRXFAKE",
          urlKey: "fake-org",
        } as unknown as PortalModule.IPortal,
        portalUrl: "https://fake-org.maps.arcgis.com",
      }),
    };

    portalCtxMgr = {
      context: createMockContext({
        authentication: MOCK_AUTH,
        currentUser: { username: "casey" } as unknown as PortalModule.IUser,
        portalSelf: {
          isPortal: true,
          name: "My Portal Install",
          id: "BRXFAKE",
        } as unknown as PortalModule.IPortal,
        portalUrl: "https://myserver.com",
      }),
    };
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("static methods:", () => {
    it("loads from minimal json", () => {
      const createSpy = vi.spyOn(HubPagesModule, "createPage");
      const chk = HubPage.fromJson({ name: "Test Page" }, authdCtxMgr.context);

      expect(createSpy).not.toHaveBeenCalled();
      expect(chk.toJson().name).toEqual("Test Page");
      const json = chk.toJson();
      expect(json.permissions).toEqual([]);
    });

    it("loads based on identifier", async () => {
      const fetchSpy = vi
        .spyOn(HubPagesModule, "fetchPage")
        .mockImplementation((id: string) =>
          Promise.resolve({ id, name: "Test Page" } as unknown as IHubPage)
        );

      const chk = await HubPage.fetch("3ef", authdCtxMgr.context);
      expect(fetchSpy).toHaveBeenCalledTimes(1);
      expect(chk.toJson().id).toBe("3ef");
      expect(chk.toJson().name).toBe("Test Page");
    });

    it("throws if page not found", async () => {
      const fetchSpy = vi
        .spyOn(HubPagesModule, "fetchPage")
        .mockImplementation((_id: string) =>
          Promise.reject(
            new Error("CONT_0001: Item does not exist or is inaccessible.")
          )
        );
      try {
        await HubPage.fetch("3ef", authdCtxMgr.context);
      } catch (ex) {
        const error = ex as { message?: string };
        expect(fetchSpy).toHaveBeenCalledTimes(1);
        expect(error.message).toBe("Page not found.");
      }
    });

    it("handle load errors", async () => {
      const fetchSpy = vi
        .spyOn(HubPagesModule, "fetchPage")
        .mockImplementation((_id: string) =>
          Promise.reject(new Error("ZOMG!"))
        );
      try {
        await HubPage.fetch("3ef", authdCtxMgr.context);
      } catch (ex) {
        const error = ex as { message?: string };
        expect(fetchSpy).toHaveBeenCalledTimes(1);
        expect(error.message).toBe("ZOMG!");
      }
    });
  });

  it("save calls createPage if object does not have an id", async () => {
    const createSpy = vi
      .spyOn(HubPagesModule, "createPage")
      .mockImplementation((p: Partial<IHubPage>, _ro?: any) =>
        Promise.resolve(p as IHubPage)
      );
    const chk = HubPage.fromJson({ name: "Test Page" }, authdCtxMgr.context);
    await chk.save();
    expect(createSpy).toHaveBeenCalledTimes(1);
    expect(chk.toJson().name).toEqual("Test Page");
  });

  it("create saves the instance if passed true", async () => {
    const createSpy = vi
      .spyOn(HubPagesModule, "createPage")
      .mockImplementation((p: Partial<IHubPage>, _ro?: any) => {
        const out = { ...(p as any), id: "3ef" } as IHubPage;
        return Promise.resolve(out);
      });
    const chk = await HubPage.create(
      { name: "Test Page" },
      authdCtxMgr.context,
      true
    );

    expect(createSpy).toHaveBeenCalledTimes(1);
    expect(chk.toJson().name).toEqual("Test Page");
    expect(chk.toJson().type).toEqual("Hub Page");
  });

  describe("Enterprise", () => {
    it("create does not save by default", async () => {
      const createSpy = vi.spyOn(HubPagesModule, "createPage");
      const chk = await HubPage.create(
        { name: "Test Page", orgUrlKey: "foo" },
        portalCtxMgr.context
      );

      expect(createSpy).not.toHaveBeenCalled();
      expect(chk.toJson().name).toEqual("Test Page");
      expect(chk.toJson().type).toEqual("Site Page");
    });

    it("handles undefined orgUrlKey", async () => {
      const createSpy = vi.spyOn(HubPagesModule, "createPage");
      const chk = HubPage.fromJson({ name: "Test Page" }, portalCtxMgr.context);
      const editor = await chk.toEditor();
      expect(editor.orgUrlKey).toEqual("");
      expect(editor.type).toEqual("Site Page");
      expect(createSpy).not.toHaveBeenCalled();
    });
  });

  it("update applies partial changes to internal state", () => {
    const chk = HubPage.fromJson({ name: "Test Page" }, authdCtxMgr.context);
    chk.update({ name: "Test Page 2" });
    expect(chk.toJson().name).toEqual("Test Page 2");

    chk.update({ tags: ["one", "two"] });
    expect(chk.toJson().tags).toEqual(["one", "two"]);
  });

  it("save updates if object has id", async () => {
    const updateSpy = vi
      .spyOn(HubPagesModule, "updatePage")
      .mockImplementation((p: Partial<IHubPage>, _ro?: any) =>
        Promise.resolve(p as IHubPage)
      );
    const chk = HubPage.fromJson(
      { id: "bc3", name: "Test Page" },
      authdCtxMgr.context
    );
    await chk.save();
    expect(updateSpy).toHaveBeenCalledTimes(1);
  });

  it("delete", async () => {
    const deleteSpy = vi
      .spyOn(HubPagesModule, "deletePage")
      .mockResolvedValue(undefined as any);
    const chk = HubPage.fromJson({ name: "Test Page" }, authdCtxMgr.context);
    await chk.delete();
    expect(deleteSpy).toHaveBeenCalledTimes(1);
    expect(() => chk.toJson()).toThrowError("Entity is already destroyed.");
    expect(() => chk.update({ name: "Test Page 2" } as IHubPage)).toThrowError(
      "HubPage is already destroyed."
    );
    try {
      await chk.delete();
    } catch (e) {
      const error = e as { message?: string };
      expect(error.message).toEqual("HubPage is already destroyed.");
    }
    try {
      await chk.save();
    } catch (e) {
      const error = e as { message?: string };
      expect(error.message).toEqual("HubPage is already destroyed.");
    }
  });

  describe("IWithEditorBehavior:", () => {
    it("getEditorConfig delegates to helper", async () => {
      const spy = vi
        .spyOn(EditConfigModule, "getEditorConfig")
        .mockResolvedValue({ fake: "config" } as any);
      const chk = HubPage.fromJson(
        { id: "bc3", name: "Test Entity" },
        authdCtxMgr.context
      );
      const result = await chk.getEditorConfig("i18n.Scope", "hub:page:edit");
      expect(result).toEqual({ fake: "config" } as any);
      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveBeenCalledWith(
        "i18n.Scope",
        "hub:page:edit",
        chk.toJson(),
        authdCtxMgr.context
      );
    });

    describe("toEditor:", () => {
      it("optionally enriches the entity", async () => {
        const enrichEntitySpy = vi
          .spyOn(EnrichEntityModule, "enrichEntity")
          .mockResolvedValue({} as any);
        const chk = HubPage.fromJson({ id: "bc3" }, authdCtxMgr.context);
        await chk.toEditor({}, ["someEnrichment AS _someEnrichment"] as any);
        expect(enrichEntitySpy).toHaveBeenCalledTimes(1);
      });

      it("toEditor converst entity to correct structure", async () => {
        const chk = HubPage.fromJson(
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
      it("handles simple prop change", async () => {
        const chk = HubPage.fromJson(
          {
            id: "bc3",
            name: "Test Entity",
            thumbnailUrl: "https://myserver.com/thumbnail.png",
          },
          authdCtxMgr.context
        );
        const saveSpy = vi
          .spyOn(chk, "save")
          .mockResolvedValue(undefined as any);
        const editor = await chk.toEditor();
        editor.name = "new name";
        const result = await chk.fromEditor(editor);
        expect(saveSpy).toHaveBeenCalledTimes(1);
        expect(result.name).toEqual("new name");
      });

      it("handles thumbnail change", async () => {
        const chk = HubPage.fromJson(
          {
            id: "bc3",
            name: "Test Entity",
            thumbnailUrl: "https://myserver.com/thumbnail.png",
          },
          authdCtxMgr.context
        );
        const saveSpy = vi
          .spyOn(chk, "save")
          .mockResolvedValue(undefined as any);
        const editor = await chk.toEditor();
        editor.name = "new name";
        editor._thumbnail = {
          blob: "fake blob",
          filename: "thumbnail.png",
        } as any;
        const result = await chk.fromEditor(editor);
        expect(saveSpy).toHaveBeenCalledTimes(1);
        expect(getProp(result, "_thumbnail")).not.toBeDefined();
      });

      it("handles thumbnail clear", async () => {
        const chk = HubPage.fromJson(
          {
            id: "bc3",
            name: "Test Entity",
            thumbnailUrl: "https://myserver.com/thumbnail.png",
          },
          authdCtxMgr.context
        );
        const saveSpy = vi
          .spyOn(chk, "save")
          .mockResolvedValue(undefined as any);
        const editor = await chk.toEditor();
        editor.name = "new name";
        editor._thumbnail = {} as any;
        const result = await chk.fromEditor(editor);
        expect(saveSpy).toHaveBeenCalledTimes(1);
        expect(getProp(result, "_thumbnail")).not.toBeDefined();
      });

      it("throws if creating", async () => {
        const chk = HubPage.fromJson(
          {
            name: "Test Entity",
            thumbnailUrl: "https://myserver.com/thumbnail.png",
          },
          authdCtxMgr.context
        );
        const saveSpy = vi
          .spyOn(chk, "save")
          .mockResolvedValue(undefined as any);
        const editor = await chk.toEditor();
        editor.name = "new name";
        try {
          await chk.fromEditor(editor);
        } catch (ex) {
          const error = ex as { message?: string };
          expect(error.message).toContain("Cannot create");
          expect(saveSpy).toHaveBeenCalledTimes(0);
        }
      });
    });
  });
});
