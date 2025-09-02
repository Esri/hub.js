/* eslint-disable @typescript-eslint/no-unused-vars */
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
  IHubTrustedOrgsResponse,
  IUserHubSettings,
  IVersion,
  IVersionMetadata,
  getProp,
} from "../../src";
import { Catalog } from "../../src/search/Catalog";
import * as ContainsModule from "../../src/core/_internal/deepContains";
import * as EnrichEntityModule from "../../src/core/enrichEntity";
import * as fetchMock from "fetch-mock";

describe("HubSite Class:", () => {
  let authdCtxMgr: ArcGISContextManager;
  let portalCtxMgr: ArcGISContextManager;

  beforeEach(async () => {
    fetchMock.post(
      "https://myorg.maps.arcgis.com/sharing/rest/portals/BRXFAKE/limits?limitsType=Groups&limitName=MaxNumUserGroups&f=json",
      {
        status: 200,
        body: {
          type: "Groups",
          name: "MaxNumUserGroups",
          limitValue: 512,
        },
      }
    );
    fetchMock.post(
      "https://myorg.maps.arcgis.com/sharing/rest/portals/self/trustedOrgs?f=json",
      {
        status: 200,
        body: {
          total: 0,
          start: 1,
          num: 10,
          nextStart: -1,
          trustedOrgs: [],
        },
      }
    );
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
      portalSettings: {} as PortalModule.IPortalSettings,
      userHubSettings: {} as IUserHubSettings,
      trustedOrgIds: ["BRXFAKE"],
      trustedOrgs: [] as IHubTrustedOrgsResponse[],
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
      portalSettings: {} as PortalModule.IPortalSettings,
      userHubSettings: {} as IUserHubSettings,
      trustedOrgIds: ["BRXFAKE"],
      trustedOrgs: [] as IHubTrustedOrgsResponse[],
    });
  });
  afterEach(() => {
    fetchMock.restore();
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
        expect((ex as Error).message).toBe("Site not found.");
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
        expect((ex as Error).message).toBe("ZOMG!");
      }
    });
  });

  it("save calls createSite if object does not have an id", async () => {
    const createSpy = spyOn(HubSitesModule, "createSite").and.callFake(
      (p: IHubSite) => {
        return Promise.resolve(p);
      }
    );
    const chk = HubSite.fromJson({ name: "Test Site" }, authdCtxMgr.context);
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

  it("fromJson applies defaults and downcases urlKey", () => {
    const chk = HubSite.fromJson(
      { name: "Test Site", orgUrlKey: "FOO" },
      authdCtxMgr.context
    );
    expect(chk.toJson().orgUrlKey).toEqual("foo");
  });

  it("fromJson applies defaults and uses portalUrl urlKey downcased", () => {
    authdCtxMgr.context.portal.urlKey = "FOO";
    const chk = HubSite.fromJson({ name: "Test Site" }, authdCtxMgr.context);
    expect(chk.toJson().orgUrlKey).toEqual("foo");
  });

  it("update applies partial changes to internal state", () => {
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
      expect((e as Error).message).toEqual("HubSite is already destroyed.");
    }

    try {
      await chk.save();
    } catch (e) {
      expect((e as Error).message).toEqual("HubSite is already destroyed.");
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
        (id: string, et: string, h: IDeepCatalogInfo[]) => {
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
      const hiearchy = containsSpy.calls.argsFor(0)[2];
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
        { id: "4ef", hubEntityType: "project", catalog: createCatalog("00b") },
      ]);
      expect(containsSpy).toHaveBeenCalledTimes(1);
      const hiearchy = containsSpy.calls.argsFor(0)[2];
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
      await chk.contains("cc0", [{ id: "4ef", hubEntityType: "project" }]);
      // second call will use the cache
      await chk.contains("cc1", [{ id: "4ef", hubEntityType: "project" }]);
      expect(containsSpy).toHaveBeenCalledTimes(2);
      // verify first call does not send the 4ef catalog
      const hiearchy = containsSpy.calls.argsFor(0)[2];
      expect(hiearchy.length).toBe(2);
      expect(hiearchy[0].catalog).not.toBeDefined();
      expect(hiearchy[1].catalog).toEqual(
        createCatalog("00a"),
        "should pass the site catalog"
      );
      // verify second call does send the 4ef catalog
      const hiearchy2 = containsSpy.calls.argsFor(1)[2];
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
            "hub:site:feature:follow": true,
            "hub:site:feature:discussions": true,
            "hub:feature:ai-assistant": false,
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
      expect(modelArg.item).toEqual(model.item);
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
              "hub:site:feature:follow": true,
              "hub:site:feature:discussions": true,
              "hub:feature:ai-assistant": false,
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
      expect(modelArg.item).toEqual(model.item);
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

    describe("toEditor:", () => {
      let chk: HubSite;
      let getFollowersGroupSpy: any;

      beforeEach(async () => {
        chk = HubSite.fromJson(
          {
            id: "bc3",
            name: "Test Entity",
            thumbnailUrl: "https://myserver.com/thumbnail.png",
            features: { "hub:site:feature:follow": true },
          },
          authdCtxMgr.context
        );
      });

      it("optionally enriches the entity", async () => {
        getFollowersGroupSpy = spyOn(chk, "getFollowersGroup").and.returnValue(
          Promise.resolve({})
        );
        const enrichEntitySpy = spyOn(
          EnrichEntityModule,
          "enrichEntity"
        ).and.returnValue(Promise.resolve({}));
        await chk.toEditor({}, ["someEnrichment AS _someEnrichment"]);

        expect(enrichEntitySpy).toHaveBeenCalledTimes(1);
        expect(getFollowersGroupSpy).toHaveBeenCalledTimes(1);
      });
      it("uses _urlInfo if provided", async () => {
        const site = HubSite.fromJson(
          {
            id: "bc3",
            name: "Test Entity",
            _urlInfo: {
              subdomain: "my-subdomain",
            },
          },
          authdCtxMgr.context
        );
        getFollowersGroupSpy = spyOn(site, "getFollowersGroup").and.returnValue(
          Promise.resolve({ typeKeywords: ["cannotDiscuss"] })
        );
        const result = await site.toEditor();
        expect(result._urlInfo.subdomain).toEqual("my-subdomain");
      });
      describe("entity transforms", () => {
        it("sets the _followers.showFollowAction property based on the presence of the hub:site:feature:follow feature", async () => {
          getFollowersGroupSpy = spyOn(
            chk,
            "getFollowersGroup"
          ).and.returnValue(Promise.resolve({}));
          const result = await chk.toEditor();
          expect(result._followers?.showFollowAction).toBe(true);
        });
        describe("_followers.isDiscussable", () => {
          it("set to false by default (when no followers group is returned)", async () => {
            getFollowersGroupSpy = spyOn(
              chk,
              "getFollowersGroup"
            ).and.returnValue(Promise.resolve(null));
            const result = await chk.toEditor();
            expect(result._followers?.isDiscussable).toBe(false);
          });
          it("set to true when the followers group is discussable", async () => {
            getFollowersGroupSpy = spyOn(
              chk,
              "getFollowersGroup"
            ).and.returnValue(Promise.resolve({ typeKeywords: [] }));
            const result = await chk.toEditor();
            expect(result._followers?.isDiscussable).toBe(true);
          });
          it("set to false when the followers group is not discussable", async () => {
            getFollowersGroupSpy = spyOn(
              chk,
              "getFollowersGroup"
            ).and.returnValue(
              Promise.resolve({ typeKeywords: ["cannotDiscuss"] })
            );
            const result = await chk.toEditor();
            expect(result._followers?.isDiscussable).toBe(false);
          });
        });
      });
    });

    describe("fromEditor:", () => {
      let chk: HubSite;
      let getFollowersGroupSpy: any;

      beforeEach(async () => {
        chk = HubSite.fromJson(
          {
            id: "bc3",
            name: "Test Entity",
            thumbnailUrl: "https://myserver.com/thumbnail.png",
          },
          authdCtxMgr.context
        );
        getFollowersGroupSpy = spyOn(chk, "getFollowersGroup").and.callFake(
          () => {
            return Promise.resolve({
              id: "followers00c",
              typeKeywords: [],
            });
          }
        );
      });
      it("handles simple prop change", async () => {
        // spy on the instance .save method and retrn void
        const saveSpy = spyOn(chk, "save").and.returnValue(Promise.resolve());
        // make changes to the editor
        const editor = await chk.toEditor();
        editor.name = "new name";
        (editor._followers as any).isDiscussable = undefined;
        // call fromEditor
        const result = await chk.fromEditor(editor);
        // expect the save method to have been called
        expect(saveSpy).toHaveBeenCalledTimes(1);
        // expect the name to have been updated
        expect(result.name).toEqual("new name");
        expect(getFollowersGroupSpy).toHaveBeenCalledTimes(1);
      });
      it("handles thumbnail change", async () => {
        // spy on the instance .save method and retrn void
        const saveSpy = spyOn(chk, "save").and.returnValue(Promise.resolve());
        // make changes to the editor
        const editor = await chk.toEditor();
        editor.name = "new name";
        (editor._followers as any).isDiscussable = undefined;
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
        expect(getFollowersGroupSpy).toHaveBeenCalledTimes(1);
      });

      it("handles thumbnail clear", async () => {
        // spy on the instance .save method and retrn void
        const saveSpy = spyOn(chk, "save").and.returnValue(Promise.resolve());
        // make changes to the editor
        const editor = await chk.toEditor();
        editor.name = "new name";
        (editor._followers as any).isDiscussable = undefined;
        editor._thumbnail = {};
        // call fromEditor
        const result = await chk.fromEditor(editor);
        // expect the save method to have been called
        expect(saveSpy).toHaveBeenCalledTimes(1);
        // since thumbnailCache is protected we can't really test that it's set
        // other than via code-coverage
        expect(getProp(result, "_thumbnail")).not.toBeDefined();
        expect(getFollowersGroupSpy).toHaveBeenCalledTimes(1);
      });
      describe("followers", () => {
        let _chk: HubSite;
        let saveSpy: any;
        let setFollowersGroupAccessSpy: any;
        let setFollowersGroupIsDiscussableSpy: any;
        let _getFollowersGroupSpy: any;
        let editor: IHubSiteEditor;

        beforeEach(async () => {
          _chk = HubSite.fromJson(
            {
              id: "bc3",
              name: "Test Entity",
            },
            authdCtxMgr.context
          );
          saveSpy = spyOn(_chk, "save").and.returnValue(Promise.resolve());
          setFollowersGroupAccessSpy = spyOn(
            _chk,
            "setFollowersGroupAccess"
          ).and.returnValue(Promise.resolve());
          setFollowersGroupIsDiscussableSpy = spyOn(
            _chk,
            "setFollowersGroupIsDiscussable"
          ).and.returnValue(Promise.resolve());
          _getFollowersGroupSpy = spyOn(_chk, "getFollowersGroup").and.callFake(
            () => {
              return Promise.resolve({
                id: "followers00c",
                typeKeywords: [],
              });
            }
          );
          editor = await _chk.toEditor();
        });
        it("does nothing if followers information is not present on the editor values", async () => {
          editor._followers = undefined;
          await _chk.fromEditor(editor);

          expect(saveSpy).toHaveBeenCalledTimes(1);
          expect(setFollowersGroupAccessSpy).not.toHaveBeenCalled();
          expect(_getFollowersGroupSpy).toHaveBeenCalledTimes(1);
        });
        it("handles setting the followers group access", async () => {
          editor._followers = { groupAccess: "public" };
          await _chk.fromEditor(editor);

          expect(saveSpy).toHaveBeenCalledTimes(1);
          expect(setFollowersGroupAccessSpy).toHaveBeenCalledTimes(1);
          expect(setFollowersGroupAccessSpy).toHaveBeenCalledWith("public");
          expect(_getFollowersGroupSpy).toHaveBeenCalledTimes(1);
        });
        it("handles setting followers group isDiscussable", async () => {
          editor._followers = { isDiscussable: true };
          await _chk.fromEditor(editor);

          expect(saveSpy).toHaveBeenCalledTimes(1);
          expect(setFollowersGroupAccessSpy).not.toHaveBeenCalled();
          expect(_getFollowersGroupSpy).toHaveBeenCalledTimes(1);
          expect(setFollowersGroupIsDiscussableSpy).toHaveBeenCalledTimes(1);
        });
      });
      it("throws if creating", async () => {
        const _chk = HubSite.fromJson(
          {
            name: "Test Entity",
            thumbnailUrl: "https://myserver.com/thumbnail.png",
          },
          authdCtxMgr.context
        );
        const _getFollowersGroupSpy = spyOn(
          _chk,
          "getFollowersGroup"
        ).and.callFake(() => {
          return Promise.resolve({
            id: "followers00c",
            typeKeywords: [],
          });
        });
        // spy on the instance .save method and retrn void
        const saveSpy = spyOn(_chk, "save").and.returnValue(Promise.resolve());
        // make changes to the editor
        const editor = await _chk.toEditor();
        editor.name = "new name";
        (editor._followers as any).isDiscussable = undefined;
        // call fromEditor
        try {
          await _chk.fromEditor(editor);
        } catch (ex) {
          expect((ex as Error).message).toContain("Cannot create");
          expect(saveSpy).toHaveBeenCalledTimes(0);
          expect(_getFollowersGroupSpy).toHaveBeenCalledTimes(1);
        }
      });
      it("handles assistant group permissions in fromEditor with existing permissions", async () => {
        const chk = HubSite.fromJson(
          {
            id: "bc3",
            name: "Test Entity",
            permissions: [
              {
                permission: "hub:site:assistant:access",
                collaborationType: "group",
                collaborationId: "old-group",
              },
              {
                permission: "hub:site:project:create",
                collaborationType: "group",
                collaborationId: "3ef",
              },
            ],
            assistant: {
              schemaVersion: 1,
              accessGroups: ["group1", "group2"],
            },
          },
          authdCtxMgr.context
        );
        const saveSpy = spyOn(chk, "save").and.returnValue(Promise.resolve());
        const editor = await chk.toEditor();
        // Call fromEditor
        const result = await chk.fromEditor(editor);
        // Should remove old assistant:access and add new ones
        const assistantPerms = result.permissions.filter(
          (p: any) => p.permission === "hub:site:assistant:access"
        );
        expect(assistantPerms.length).toBe(2);
        expect(assistantPerms[0].collaborationId).toBe("group1");
        expect(assistantPerms[1].collaborationId).toBe("group2");
        // Should preserve other permissions
        const projectPerms = result.permissions.filter(
          (p: any) => p.permission === "hub:site:project:create"
        );
        expect(projectPerms.length).toBe(1);
        expect(saveSpy).toHaveBeenCalledTimes(1);
      });
      it("handles assistant group permissions in fromEditor with no existing site with no permissions or assistant", async () => {
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
        console.log(chk.toJson());
        const saveSpy = spyOn(chk, "save").and.returnValue(Promise.resolve());
        const editor = await chk.toEditor();
        const result = await chk.fromEditor(editor);
        // Should remove old assistant:access and add new ones
        const assistantPerms = result.permissions.filter(
          (p: any) => p.permission === "hub:site:assistant:access"
        );
        expect(assistantPerms.length).toBe(0);
        // Should preserve other permissions
        const projectPerms = result.permissions.filter(
          (p: any) => p.permission !== "hub:site:assistant:access"
        );
        expect(projectPerms.length).toBe(0);
        expect(saveSpy).toHaveBeenCalledTimes(1);
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
