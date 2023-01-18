import * as PortalModule from "@esri/arcgis-rest-portal";
import { ArcGISContextManager } from "../../src/ArcGISContextManager";
import { HubSite } from "../../src/sites/HubSite";
import { MOCK_AUTH } from "../mocks/mock-auth";
import * as HubSitesModule from "../../src/sites/HubSites";
import { IDeepCatalogInfo, IHubCatalog, IHubSite } from "../../src";
import { Catalog } from "../../src/search";
import * as ContainsModule from "../../src/core/_internal/deepContains";
describe("HubSite Class:", () => {
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
      const createSpy = spyOn(HubSitesModule, "createSite");
      const chk = HubSite.fromJson({ name: "Test Site" }, authdCtxMgr.context);

      expect(createSpy).not.toHaveBeenCalled();
      expect(chk.toJson().name).toEqual("Test Site");
      // adds empty permissions and catalog
      const json = chk.toJson();
      expect(json.permissions).toEqual([]);
      expect(json.catalog).toEqual({ schemaVersion: 0 });
    });
    it("loads based on identifier", async () => {
      const fetchSpy = spyOn(HubSitesModule, "fetchSite").and.callFake(
        (id: string) => {
          return Promise.resolve({
            id,
            name: "Test Site",
          });
        }
      );

      const chk = await HubSite.fetch("3ef", authdCtxMgr.context);
      expect(fetchSpy).toHaveBeenCalledTimes(1);
      expect(chk.toJson().id).toBe("3ef");
      expect(chk.toJson().name).toBe("Test Site");
    });

    it("handle load missing projects", async () => {
      const fetchSpy = spyOn(HubSitesModule, "fetchSite").and.callFake(
        (id: string) => {
          const err = new Error(
            "CONT_0001: Item does not exist or is inaccessible."
          );
          return Promise.reject(err);
        }
      );
      try {
        await HubSite.fetch("3ef", authdCtxMgr.context);
      } catch (ex) {
        expect(fetchSpy).toHaveBeenCalledTimes(1);
        expect(ex.message).toBe("Site not found.");
      }
    });

    it("handle load errors", async () => {
      const fetchSpy = spyOn(HubSitesModule, "fetchSite").and.callFake(
        (id: string) => {
          const err = new Error("ZOMG!");
          return Promise.reject(err);
        }
      );
      try {
        await HubSite.fetch("3ef", authdCtxMgr.context);
      } catch (ex) {
        expect(fetchSpy).toHaveBeenCalledTimes(1);
        expect(ex.message).toBe("ZOMG!");
      }
    });
  });

  it("save calls createSite if object does not have an id", async () => {
    const createSpy = spyOn(HubSitesModule, "createSite").and.callFake(
      (p: IHubSite) => {
        return Promise.resolve(p);
      }
    );
    const chk = await HubSite.fromJson(
      { name: "Test Site" },
      authdCtxMgr.context
    );
    await chk.save();
    expect(createSpy).toHaveBeenCalledTimes(1);
    expect(chk.toJson().name).toEqual("Test Site");
  });

  it("create saves the instance if passed true", async () => {
    const createSpy = spyOn(HubSitesModule, "createSite").and.callFake(
      (p: IHubSite) => {
        p.id = "3ef";
        return Promise.resolve(p);
      }
    );
    const chk = await HubSite.create(
      { name: "Test Site" },
      authdCtxMgr.context,
      true
    );

    expect(createSpy).toHaveBeenCalledTimes(1);
    expect(chk.toJson().name).toEqual("Test Site");
    expect(chk.toJson().type).toEqual("Hub Site Application");
  });
  it("create does not save by default", async () => {
    const createSpy = spyOn(HubSitesModule, "createSite");
    const chk = await HubSite.create(
      { name: "Test Site", orgUrlKey: "foo" },
      portalCtxMgr.context
    );

    expect(createSpy).not.toHaveBeenCalled();
    expect(chk.toJson().name).toEqual("Test Site");
    expect(chk.toJson().type).toEqual("Site Application");
  });

  it("update applies partial chagnes to internal state", () => {
    const chk = HubSite.fromJson(
      { name: "Test Site", catalog: { schemaVersion: 0 } },
      authdCtxMgr.context
    );
    chk.update({
      name: "Test Site 2",
      permissions: [
        {
          permission: "hub:project:create",
          collaborationType: "group",
          collaborationId: "3ef",
        },
      ],
      catalog: { schemaVersion: 2 },
    });
    expect(chk.toJson().name).toEqual("Test Site 2");
    expect(chk.toJson().catalog).toEqual({ schemaVersion: 2 });

    chk.update({ tags: ["one", "two"] });
    expect(chk.toJson().tags).toEqual(["one", "two"]);
  });

  it("save updates if object has id", async () => {
    const updateSpy = spyOn(HubSitesModule, "updateSite").and.callFake(
      (p: IHubSite) => {
        return Promise.resolve(p);
      }
    );
    const chk = HubSite.fromJson(
      {
        id: "bc3",
        name: "Test Site",
        catalog: { schemaVersion: 0 },
      },
      authdCtxMgr.context
    );
    await chk.save();
    expect(updateSpy).toHaveBeenCalledTimes(1);
  });

  it("delete", async () => {
    const deleteSpy = spyOn(HubSitesModule, "deleteSite").and.callFake(() => {
      return Promise.resolve();
    });
    const chk = HubSite.fromJson({ name: "Test Site" }, authdCtxMgr.context);
    await chk.delete();
    expect(deleteSpy).toHaveBeenCalledTimes(1);
    // all fns should now throw an error
    expect(() => {
      chk.toJson();
    }).toThrowError("Entity is already destroyed.");

    expect(() => {
      chk.update({ name: "Test Site 2" } as IHubSite);
    }).toThrowError("HubSite is already destroyed.");

    // async calls
    try {
      await chk.delete();
    } catch (e) {
      expect(e.message).toEqual("HubSite is already destroyed.");
    }

    try {
      await chk.save();
    } catch (e) {
      expect(e.message).toEqual("HubSite is already destroyed.");
    }
  });

  it("internal instance accessors", () => {
    const chk = HubSite.fromJson(
      { name: "Test Site", catalog: { schemaVersion: 0 } },
      authdCtxMgr.context
    );

    expect(chk.catalog instanceof Catalog).toBeTruthy();
  });

  it("setting catalog updates catalog instance", () => {
    const chk = HubSite.fromJson(
      { name: "Test Site", catalog: { schemaVersion: 0 } },
      authdCtxMgr.context
    );
    chk.update({ catalog: { schemaVersion: 2 } });
    expect(chk.toJson().catalog).toEqual({ schemaVersion: 2 });
    expect(chk.catalog.schemaVersion).toEqual(2);
  });
  describe(" contains:", () => {
    it("checks site catalog by default", async () => {
      const containsSpy = spyOn(ContainsModule, "deepContains").and.callFake(
        (id: string, h: IDeepCatalogInfo[]) => {
          return Promise.resolve({
            identifier: id,
            isContained: true,
            catalogInfo: {},
          });
        }
      );
      const chk = HubSite.fromJson(
        {
          id: "3ef",
          catalog: createCatalog("00a"),
        },
        authdCtxMgr.context
      );
      const result = await chk.contains("cc0");
      expect(containsSpy).toHaveBeenCalledTimes(1);
      const hiearchy = containsSpy.calls.argsFor(0)[1];
      expect(hiearchy.length).toBe(1);
      expect(hiearchy[0].catalog).toEqual(
        createCatalog("00a"),
        "should pass the site catalog"
      );
      expect(result).toEqual({
        identifier: "cc0",
        isContained: true,
        catalogInfo: {},
      });
    });

    it("adds site catalog to others", async () => {
      const containsSpy = spyOn(ContainsModule, "deepContains").and.callFake(
        (id: string, h: IDeepCatalogInfo[]) => {
          return Promise.resolve({
            identifier: id,
            isContained: true,
            catalogInfo: {},
          });
        }
      );
      const chk = HubSite.fromJson(
        {
          id: "3ef",
          catalog: createCatalog("00a"),
        },
        authdCtxMgr.context
      );
      // pass in a project catalog
      const result = await chk.contains("cc0", [
        { id: "4ef", entityType: "item", catalog: createCatalog("00b") },
      ]);
      expect(containsSpy).toHaveBeenCalledTimes(1);
      const hiearchy = containsSpy.calls.argsFor(0)[1];
      expect(hiearchy.length).toBe(2);
      expect(hiearchy[0].catalog).toEqual(
        createCatalog("00b"),
        "should pass the project catalog"
      );
      expect(hiearchy[1].catalog).toEqual(
        createCatalog("00a"),
        "should pass the site catalog"
      );
      expect(result).toEqual({
        identifier: "cc0",
        isContained: true,
        catalogInfo: {},
      });
    });

    it("caches catalogs", async () => {
      const containsSpy = spyOn(ContainsModule, "deepContains").and.callFake(
        (id: string, h: IDeepCatalogInfo[]) => {
          return Promise.resolve({
            identifier: id,
            isContained: true,
            catalogInfo: {
              "3ef": {
                catalog: createCatalog("00a"),
              },
              "4ef": {
                catalog: createCatalog("00b"),
              },
            },
          });
        }
      );
      const chk = HubSite.fromJson(
        {
          id: "3ef",
          catalog: createCatalog("00a"),
        },
        authdCtxMgr.context
      );
      // First call will warm the cache
      await chk.contains("cc0", [{ id: "4ef", entityType: "item" }]);
      // second call will use the cache
      await chk.contains("cc1", [{ id: "4ef", entityType: "item" }]);
      expect(containsSpy).toHaveBeenCalledTimes(2);
      // verify first call does not send the 4ef catalog
      const hiearchy = containsSpy.calls.argsFor(0)[1];
      expect(hiearchy.length).toBe(2);
      expect(hiearchy[0].catalog).not.toBeDefined();
      expect(hiearchy[1].catalog).toEqual(
        createCatalog("00a"),
        "should pass the site catalog"
      );
      // verify second call does send the 4ef catalog
      const hiearchy2 = containsSpy.calls.argsFor(1)[1];
      expect(hiearchy2.length).toBe(2);
      expect(hiearchy2[0].catalog).toEqual(
        createCatalog("00b"),
        "should pass the project catalog"
      );
      expect(hiearchy2[1].catalog).toEqual(
        createCatalog("00a"),
        "should pass the site catalog"
      );
    });
  });
});

function createCatalog(groupId: string): IHubCatalog {
  return {
    schemaVersion: 1,
    title: "Default Catalog",
    scopes: {
      item: {
        targetEntity: "item",
        filters: [
          {
            predicates: [
              {
                group: [groupId],
              },
            ],
          },
        ],
      },
    },
    collections: [],
  };
}
