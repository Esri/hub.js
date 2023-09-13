import * as PortalModule from "@esri/arcgis-rest-portal";
import { ArcGISContextManager } from "../../src/ArcGISContextManager";
import { HubSite } from "../../src/sites/HubSite";
import { MOCK_AUTH } from "../mocks/mock-auth";
import * as HubSitesModule from "../../src/sites/HubSites";
import * as HubVersioningModule from "../../src/versioning";
import * as EditConfigModule from "../../src/core/schemas/getEditorConfig";
import {
  IDeepCatalogInfo,
  IHubCatalog,
  IHubSite,
  IHubSiteEditor,
  IVersion,
  IVersionMetadata,
  getProp,
} from "../../src";
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

    it("throws if site not found", async () => {
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
      unauthdCtxMgr.context
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

  describe(" versioning:", () => {
    let chk: HubSite;
    const model: any = {
      data: {
        catalog: {
          schemaVersion: 0,
        },
        permissions: [],
        settings: {
          features: {
            "hub:site:content": true,
            "hub:site:discussions": false,
            "hub:site:events": false,
            "hub:site:followers:action": true,
          },
        },
      },
      item: {
        id: "bc3",
        owner: "casey",
        properties: {
          orgUrlKey: "fake-org",
          schemaVersion: 1,
        },
        tags: [],
        title: "Test Site",
        type: "Hub Site Application",
        typeKeywords: ["Hub Site", "hubSite"],
      },
    };
    beforeEach(() => {
      chk = HubSite.fromJson(
        {
          id: "bc3",
          name: "Test Site",
          owner: "casey",
          catalog: { schemaVersion: 0 },
        },
        authdCtxMgr.context
      );
    });
    it("searches versions", async () => {
      const searchVersionsSpy = spyOn(
        HubVersioningModule,
        "searchVersions"
      ).and.callFake(() => {
        return Promise.resolve([{}, {}]);
      });

      const result = await chk.searchVersions();

      expect(searchVersionsSpy).toHaveBeenCalledTimes(1);
      expect(searchVersionsSpy).toHaveBeenCalledWith(
        chk.id,
        authdCtxMgr.context.userRequestOptions
      );
      expect(result.length).toBe(2);
    });
    it("gets a version", async () => {
      const getVersionSpy = spyOn(
        HubVersioningModule,
        "getVersion"
      ).and.callFake(() => {
        return Promise.resolve({});
      });

      await chk.getVersion("abc123");

      expect(getVersionSpy).toHaveBeenCalledTimes(1);
      expect(getVersionSpy).toHaveBeenCalledWith(
        chk.id,
        "abc123",
        authdCtxMgr.context.userRequestOptions
      );
    });
    it("creates a version", async () => {
      const createVersionSpy = spyOn(
        HubVersioningModule,
        "createVersion"
      ).and.callFake(() => {
        return Promise.resolve({});
      });

      const createVersionOptions = { name: "my special version" };
      await chk.createVersion(createVersionOptions);

      expect(createVersionSpy).toHaveBeenCalledTimes(1);
      const args = createVersionSpy.calls.argsFor(0);
      const modelArg = args[0];
      expect(modelArg).toEqual(model);
      expect(args[1]).toEqual(authdCtxMgr.context.userRequestOptions);
      expect(args[2]).toEqual(createVersionOptions);
    });
    it("updates a version", async () => {
      const updateVersionSpy = spyOn(
        HubVersioningModule,
        "updateVersion"
      ).and.callFake(() => {
        return Promise.resolve({});
      });

      const version: IVersion = {
        created: 123456,
        creator: "paige_pa",
        data: {
          settings: {
            features: {
              "hub:site:content": true,
              "hub:site:discussions": false,
              "hub:site:events": false,
              "hub:site:followers:action": true,
            },
          },
        },
        id: "abc123",
        path: "",
        updated: 123456,
      };

      await chk.updateVersion(version);

      expect(updateVersionSpy).toHaveBeenCalledTimes(1);
      const args = updateVersionSpy.calls.argsFor(0);
      const modelArg = args[0];
      expect(modelArg).toEqual(model);
      expect(args[2]).toEqual(authdCtxMgr.context.userRequestOptions);
      expect(args[1]).toEqual(version);
    });

    it("updates version metadata", async () => {
      const updateVersionMetadataSpy = spyOn(
        HubVersioningModule,
        "updateVersionMetadata"
      ).and.callFake(() => {
        return Promise.resolve({});
      });

      const version: IVersionMetadata = {
        created: 123456,
        creator: "paige_pa",
        id: "abc123",
        name: "my special version",
        path: "",
        updated: 123456,
      };

      await chk.updateVersionMetadata(version);

      expect(updateVersionMetadataSpy).toHaveBeenCalledTimes(1);
      expect(updateVersionMetadataSpy).toHaveBeenCalledWith(
        model.item.id,
        version,
        model.item.owner,
        authdCtxMgr.context.userRequestOptions
      );
    });

    it("deletes a version", async () => {
      const deleteVersionSpy = spyOn(
        HubVersioningModule,
        "deleteVersion"
      ).and.callFake(() => {
        return Promise.resolve({ success: true });
      });

      await chk.deleteVersion("def456");

      expect(deleteVersionSpy).toHaveBeenCalledTimes(1);
      expect(deleteVersionSpy).toHaveBeenCalledWith(
        "bc3",
        "def456",
        "casey",
        authdCtxMgr.context.userRequestOptions
      );
    });
  });

  describe("IWithEditorBehavior:", () => {
    it("getEditorConfig delegates to helper", async () => {
      const spy = spyOn(EditConfigModule, "getEditorConfig").and.callFake(
        () => {
          return Promise.resolve({ fake: "config" });
        }
      );
      const chk = HubSite.fromJson(
        {
          id: "bc3",
          name: "Test Entity",
        },
        authdCtxMgr.context
      );
      const result = await chk.getEditorConfig("i18n.Scope", "hub:site:edit");
      expect(result).toEqual({ fake: "config" } as any);
      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveBeenCalledWith(
        "i18n.Scope",
        "hub:site:edit",
        chk.toJson(),
        authdCtxMgr.context
      );
    });

    it("toEditor converst entity to correct structure", () => {
      const chk = HubSite.fromJson(
        {
          id: "bc3",
          name: "Test Entity",
          thumbnailUrl: "https://myserver.com/thumbnail.png",
        },
        authdCtxMgr.context
      );
      const result = chk.toEditor();
      // NOTE: If additional transforms are added in the class they should have tests here
      expect(result.id).toEqual("bc3");
      expect(result.name).toEqual("Test Entity");
      expect(result.thumbnailUrl).toEqual("https://myserver.com/thumbnail.png");
    });

    describe("fromEditor:", () => {
      it("handles simple prop change", async () => {
        const chk = HubSite.fromJson(
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
        const editor = chk.toEditor();
        editor.name = "new name";
        // call fromEditor
        const result = await chk.fromEditor(editor);
        // expect the save method to have been called
        expect(saveSpy).toHaveBeenCalledTimes(1);
        // expect the name to have been updated
        expect(result.name).toEqual("new name");
      });
      it("handles thumbnail change", async () => {
        const chk = HubSite.fromJson(
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
        const editor = chk.toEditor();
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
        const chk = HubSite.fromJson(
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
        const editor = chk.toEditor();
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
      describe("followers", () => {
        let chk: HubSite;
        let saveSpy: any;
        let setFollowersAccessSpy: any;
        let editor: IHubSiteEditor;

        beforeEach(() => {
          chk = HubSite.fromJson(
            {
              id: "bc3",
              name: "Test Entity",
            },
            authdCtxMgr.context
          );
          saveSpy = spyOn(chk, "save").and.returnValue(Promise.resolve());
          setFollowersAccessSpy = spyOn(
            chk,
            "setFollowersAccess"
          ).and.returnValue(Promise.resolve());
          editor = chk.toEditor();
        });
        it("does nothing if followers information is not present on the editor values", async () => {
          editor._followers = undefined;
          await chk.fromEditor(editor);

          expect(saveSpy).toHaveBeenCalledTimes(1);
          expect(setFollowersAccessSpy).not.toHaveBeenCalled();
        });
        it("handles setting the followers group access", async () => {
          editor._followers = { access: "public" };
          await chk.fromEditor(editor);

          expect(saveSpy).toHaveBeenCalledTimes(1);
          expect(setFollowersAccessSpy).toHaveBeenCalledTimes(1);
          expect(setFollowersAccessSpy).toHaveBeenCalledWith("public");
        });
      });
      it("handles extent from location", async () => {
        const chk = HubSite.fromJson(
          {
            id: "bc3",
            name: "Test Entity",
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
        const editor = chk.toEditor();
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
        const chk = HubSite.fromJson(
          {
            name: "Test Entity",
            thumbnailUrl: "https://myserver.com/thumbnail.png",
          },
          authdCtxMgr.context
        );
        // spy on the instance .save method and retrn void
        const saveSpy = spyOn(chk, "save").and.returnValue(Promise.resolve());
        // make changes to the editor
        const editor = chk.toEditor();
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
