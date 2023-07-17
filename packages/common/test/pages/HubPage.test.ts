import * as PortalModule from "@esri/arcgis-rest-portal";
import { ArcGISContextManager } from "../../src/ArcGISContextManager";
import { HubPage } from "../../src/pages/HubPage";
import { MOCK_AUTH } from "../mocks/mock-auth";
import * as HubPagesModule from "../../src/pages/HubPages";
import { IHubPage, UiSchemaElementOptions } from "../../src";
import * as schemasModule from "../../src/core/schemas/getEntityEditorSchemas";

describe("HubPage Class:", () => {
  let authdCtxMgr: ArcGISContextManager;
  let portalCtxMgr: ArcGISContextManager;
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
      } as unknown as PortalModule.IUser,
      portal: {
        name: "DC R&D Center",
        id: "BRXFAKE",
        urlKey: "fake-org",
      } as unknown as PortalModule.IPortal,
      portalUrl: "https://fake-org.maps.arcgis.com",
    });
    portalCtxMgr = await ArcGISContextManager.create({
      authentication: MOCK_AUTH,
      currentUser: {
        username: "casey",
      } as unknown as PortalModule.IUser,
      portal: {
        isPortal: true,
        name: "My Portal Install",
        id: "BRXFAKE",
        urlKey: "fake-org",
      } as unknown as PortalModule.IPortal,
      portalUrl: "https://myserver.com",
    });
  });

  describe("static methods:", () => {
    it("loads from minimal json", () => {
      const createSpy = spyOn(HubPagesModule, "createPage");
      const chk = HubPage.fromJson({ name: "Test Page" }, authdCtxMgr.context);

      expect(createSpy).not.toHaveBeenCalled();
      expect(chk.toJson().name).toEqual("Test Page");
      // adds empty permissions and catalog
      const json = chk.toJson();
      expect(json.permissions).toEqual([]);
    });
    it("loads based on identifier", async () => {
      const fetchSpy = spyOn(HubPagesModule, "fetchPage").and.callFake(
        (id: string) => {
          return Promise.resolve({
            id,
            name: "Test Page",
          });
        }
      );

      const chk = await HubPage.fetch("3ef", authdCtxMgr.context);
      expect(fetchSpy).toHaveBeenCalledTimes(1);
      expect(chk.toJson().id).toBe("3ef");
      expect(chk.toJson().name).toBe("Test Page");
    });

    it("throws if page not found", async () => {
      const fetchSpy = spyOn(HubPagesModule, "fetchPage").and.callFake(
        (id: string) => {
          const err = new Error(
            "CONT_0001: Item does not exist or is inaccessible."
          );
          return Promise.reject(err);
        }
      );
      try {
        await HubPage.fetch("3ef", authdCtxMgr.context);
      } catch (ex) {
        expect(fetchSpy).toHaveBeenCalledTimes(1);
        expect((ex as any).message).toBe("Page not found.");
      }
    });

    it("handle load errors", async () => {
      const fetchSpy = spyOn(HubPagesModule, "fetchPage").and.callFake(
        (id: string) => {
          const err = new Error("ZOMG!");
          return Promise.reject(err);
        }
      );
      try {
        await HubPage.fetch("3ef", authdCtxMgr.context);
      } catch (ex) {
        expect(fetchSpy).toHaveBeenCalledTimes(1);
        expect((ex as any).message).toBe("ZOMG!");
      }
    });
    it("returns editorConfig", async () => {
      const spy = spyOn(schemasModule, "getEntityEditorSchemas").and.callFake(
        () => {
          return Promise.resolve({ schema: {}, uiSchema: {} });
        }
      );

      await HubPage.getEditorConfig("test.scope", "hub:page:edit");
      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveBeenCalledWith("test.scope", "hub:page:edit", []);
    });

    it("returns editorConfig integrating options", async () => {
      const spy = spyOn(schemasModule, "getEntityEditorSchemas").and.callFake(
        () => {
          return Promise.resolve({ schema: {}, uiSchema: {} });
        }
      );

      const opts: UiSchemaElementOptions[] = [];

      await HubPage.getEditorConfig("test.scope", "hub:page:edit", opts);
      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveBeenCalledWith("test.scope", "hub:page:edit", opts);
    });
  });

  it("save calls createPage if object does not have an id", async () => {
    const createSpy = spyOn(HubPagesModule, "createPage").and.callFake(
      (p: IHubPage) => {
        return Promise.resolve(p);
      }
    );
    const chk = await HubPage.fromJson(
      { name: "Test Page" },
      authdCtxMgr.context
    );
    await chk.save();
    expect(createSpy).toHaveBeenCalledTimes(1);
    expect(chk.toJson().name).toEqual("Test Page");
  });

  it("create saves the instance if passed true", async () => {
    const createSpy = spyOn(HubPagesModule, "createPage").and.callFake(
      (p: IHubPage) => {
        p.id = "3ef";
        return Promise.resolve(p);
      }
    );
    const chk = await HubPage.create(
      { name: "Test Page" },
      authdCtxMgr.context,
      true
    );

    expect(createSpy).toHaveBeenCalledTimes(1);
    expect(chk.toJson().name).toEqual("Test Page");
    expect(chk.toJson().type).toEqual("Hub Page");
  });
  it("create does not save by default", async () => {
    const createSpy = spyOn(HubPagesModule, "createPage");
    const chk = await HubPage.create(
      { name: "Test Page", orgUrlKey: "foo" },
      portalCtxMgr.context
    );

    expect(createSpy).not.toHaveBeenCalled();
    expect(chk.toJson().name).toEqual("Test Page");
    expect(chk.toJson().type).toEqual("Site Page");
  });

  it("update applies partial changes to internal state", () => {
    const chk = HubPage.fromJson({ name: "Test Page" }, authdCtxMgr.context);
    chk.update({
      name: "Test Page 2",
    });
    expect(chk.toJson().name).toEqual("Test Page 2");

    chk.update({ tags: ["one", "two"] });
    expect(chk.toJson().tags).toEqual(["one", "two"]);
  });

  it("save updates if object has id", async () => {
    const updateSpy = spyOn(HubPagesModule, "updatePage").and.callFake(
      (p: IHubPage) => {
        return Promise.resolve(p);
      }
    );
    const chk = HubPage.fromJson(
      {
        id: "bc3",
        name: "Test Page",
      },
      authdCtxMgr.context
    );
    await chk.save();
    expect(updateSpy).toHaveBeenCalledTimes(1);
  });

  it("delete", async () => {
    const deleteSpy = spyOn(HubPagesModule, "deletePage").and.callFake(() => {
      return Promise.resolve();
    });
    const chk = HubPage.fromJson({ name: "Test Page" }, authdCtxMgr.context);
    await chk.delete();
    expect(deleteSpy).toHaveBeenCalledTimes(1);
    // all fns should now throw an error
    expect(() => {
      chk.toJson();
    }).toThrowError("Entity is already destroyed.");

    expect(() => {
      chk.update({ name: "Test Page 2" } as IHubPage);
    }).toThrowError("HubPage is already destroyed.");

    // async calls
    try {
      await chk.delete();
    } catch (e) {
      expect((e as any).message).toEqual("HubPage is already destroyed.");
    }

    try {
      await chk.save();
    } catch (e) {
      expect((e as any).message).toEqual("HubPage is already destroyed.");
    }
  });
});
