import {
  describe,
  it,
  expect,
  beforeEach,
  afterEach,
  vi,
} from "vitest";

// Make ESM namespace export spyable if needed.
vi.mock("@esri/arcgis-rest-portal", async (importOriginal) => ({
  ...(await importOriginal()),
}));
import * as PortalModule from "@esri/arcgis-rest-portal";
import { ArcGISContextManager } from "../../src/ArcGISContextManager";
import { createMockContext } from "../mocks/mock-auth";
import { HubSite } from "../../src/sites/HubSite";
import { MOCK_AUTH } from "../mocks/mock-auth";
import * as HubSitesModule from "../../src/sites/HubSites";
import * as getVersionModule from "../../src/versioning/getVersion";
import * as createVersionModule from "../../src/versioning/createVersion";
import * as updateVersionModule from "../../src/versioning/updateVersion";
import * as searchVersionsModule from "../../src/versioning/searchVersions";
import * as updateVersionMetadataModule from "../../src/versioning/updateVersionMetadata";
import * as deleteVersionModule from "../../src/versioning/deleteVersion";
import * as EditConfigModule from "../../src/core/schemas/getEditorConfig";
import { Catalog } from "../../src/search/Catalog";
import * as ContainsModule from "../../src/core/_internal/deepContains";
import * as EnrichEntityModule from "../../src/core/enrichEntity";
import * as fetchMock from "fetch-mock";
import { IUserHubSettings } from "../../src/utils/IUserHubSettings";
import { IHubTrustedOrgsResponse } from "../../src/hub-types";
import { IHubSite, IHubSiteEditor } from "../../src/core/types/IHubSite";
// IDeepCatalogInfo intentionally not imported to keep mocks flexible
import { IVersion } from "../../src/versioning/types/IVersion";
import { IVersionMetadata } from "../../src/versioning/types/IVersionMetadata";
import { IContainsResponse } from "../../src/search/types/types";
import { getProp } from "../../src/objects/get-prop";
import { IHubCatalog } from "../../src/search/types/IHubCatalog";

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
        portalSettings: {} as PortalModule.IPortalSettings,
        userHubSettings: {} as IUserHubSettings,
        trustedOrgIds: ["BRXFAKE"],
        trustedOrgs: [] as IHubTrustedOrgsResponse[],
      }),
    } as unknown as ArcGISContextManager;
    portalCtxMgr = {
      context: createMockContext({
        authentication: MOCK_AUTH,
        currentUser: { username: "casey" } as unknown as PortalModule.IUser,
        portalSelf: {
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
      }),
    } as unknown as ArcGISContextManager;
  });
  afterEach(() => {
    fetchMock.restore();
    vi.restoreAllMocks();
  });

  describe("static methods:", () => {
    it("loads from minimal json", () => {
      const createSpy = vi.spyOn(HubSitesModule, "createSite");
      const chk = HubSite.fromJson({ name: "Test Site" }, authdCtxMgr.context);

      expect(createSpy).not.toHaveBeenCalled();
      expect(chk.toJson().name).toEqual("Test Site");
      const json = chk.toJson();
      expect(json.permissions).toEqual([]);
      expect(json.catalog).toEqual({ schemaVersion: 0 });
    });
    it("loads based on identifier", async () => {
      const fetchSpy = vi
        .spyOn(HubSitesModule, "fetchSite")
        .mockImplementation((_id: string) => {
          return Promise.resolve({
            id: _id,
            name: "Test Site",
            pages: [],
          } as unknown as IHubSite);
        });

      const chk = await HubSite.fetch("3ef", authdCtxMgr.context);
      expect(fetchSpy).toHaveBeenCalledTimes(1);
      expect(chk.toJson().id).toBe("3ef");
      expect(chk.toJson().name).toBe("Test Site");
    });

    it("throws if site not found", async () => {
      const fetchSpy = vi
        .spyOn(HubSitesModule, "fetchSite")
        .mockImplementation((_id: string) => {
          const err = new Error(
            "CONT_0001: Item does not exist or is inaccessible."
          );
          return Promise.reject(err);
        });
      try {
        await HubSite.fetch("3ef", authdCtxMgr.context);
      } catch (ex) {
        expect(fetchSpy).toHaveBeenCalledTimes(1);
        expect((ex as Error).message).toBe("Site not found.");
      }
    });

    it("handle load errors", async () => {
      const fetchSpy = vi
        .spyOn(HubSitesModule, "fetchSite")
        .mockImplementation((_id: string) => {
          const err = new Error("ZOMG!");
          return Promise.reject(err);
        });
      try {
        await HubSite.fetch("3ef", authdCtxMgr.context);
      } catch (ex) {
        expect(fetchSpy).toHaveBeenCalledTimes(1);
        expect((ex as Error).message).toBe("ZOMG!");
      }
    });
  });

  it("save calls createSite if object does not have an id", async () => {
    const createSpy = vi
      .spyOn(HubSitesModule, "createSite")
      .mockImplementation((partialSite: Partial<IHubSite>, _ro?: any) => {
        const created = {
          ...(partialSite as any),
          id:
            partialSite && (partialSite as any).id
              ? (partialSite as any).id
              : "generated-id",
          pages: [],
        } as IHubSite;
        return Promise.resolve(created);
      });
    const chk = HubSite.fromJson({ name: "Test Site" }, authdCtxMgr.context);
    await chk.save();
    expect(createSpy).toHaveBeenCalledTimes(1);
    expect(chk.toJson().name).toEqual("Test Site");
  });

  it("create saves the instance if passed true", async () => {
    const createSpy = vi
      .spyOn(HubSitesModule, "createSite")
      .mockImplementation((partialSite: Partial<IHubSite>, _ro?: any) => {
        const p = { ...(partialSite as any), id: "3ef", pages: [] } as IHubSite;
        return Promise.resolve(p);
      });
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
    const createSpy = vi.spyOn(HubSitesModule, "createSite");
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
    const updateSpy = vi
      .spyOn(HubSitesModule, "updateSite")
      .mockImplementation((p: IHubSite) => Promise.resolve(p));
    const chk = HubSite.fromJson(
      { id: "bc3", name: "Test Site", catalog: { schemaVersion: 0 } },
      authdCtxMgr.context
    );
    await chk.save();
    expect(updateSpy).toHaveBeenCalledTimes(1);
  });

  it("delete", async () => {
    const deleteSpy = vi
      .spyOn(HubSitesModule, "deleteSite")
      .mockResolvedValue(undefined as any);
    const chk = HubSite.fromJson({ name: "Test Site" }, authdCtxMgr.context);
    await chk.delete();
    expect(deleteSpy).toHaveBeenCalledTimes(1);
    expect(() => chk.toJson()).toThrowError("Entity is already destroyed.");
    expect(() => chk.update({ name: "Test Site 2" } as IHubSite)).toThrowError(
      "HubSite is already destroyed."
    );
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
      const containsSpy: any = vi
        .spyOn(ContainsModule, "deepContains")
        .mockImplementation((..._args: any[]) => {
          const id = _args[0];
          const resp: IContainsResponse = {
            identifier: id,
            isContained: true,
            catalogInfo: {},
          };
          return Promise.resolve(resp);
        });
      const chk = HubSite.fromJson(
        { id: "3ef", catalog: createCatalog("00a") },
        authdCtxMgr.context
      );
      const result = await chk.contains("cc0");
      expect(containsSpy).toHaveBeenCalledTimes(1);
      const hiearchy = containsSpy.mock.calls[0][2];
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
      const containsSpy: any = vi
        .spyOn(ContainsModule, "deepContains")
        .mockImplementation((..._args: any[]) => {
          const id = _args[0];
          const resp: IContainsResponse = {
            identifier: id,
            isContained: true,
            catalogInfo: {},
          };
          return Promise.resolve(resp);
        });
      const chk = HubSite.fromJson(
        { id: "3ef", catalog: createCatalog("00a") },
        authdCtxMgr.context
      );
      const result = await chk.contains("cc0", [
        { id: "4ef", hubEntityType: "project", catalog: createCatalog("00b") },
      ]);
      expect(containsSpy).toHaveBeenCalledTimes(1);
      const hiearchy = containsSpy.mock.calls[0][2];
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
      const containsSpy: any = vi
        .spyOn(ContainsModule, "deepContains")
        .mockImplementation((..._args: any[]) => {
          const id = _args[0];
          const resp: IContainsResponse = {
            identifier: id,
            isContained: true,
            catalogInfo: {
              "3ef": { catalog: createCatalog("00a") } as any,
              "4ef": { catalog: createCatalog("00b") } as any,
            },
          };
          return Promise.resolve(resp);
        });
      const chk = HubSite.fromJson(
        { id: "3ef", catalog: createCatalog("00a") },
        authdCtxMgr.context
      );
      await chk.contains("cc0", [{ id: "4ef", hubEntityType: "project" }]);
      await chk.contains("cc1", [{ id: "4ef", hubEntityType: "project" }]);
      expect(containsSpy).toHaveBeenCalledTimes(2);
      const hiearchy = containsSpy.mock.calls[0][2];
      expect(hiearchy.length).toBe(2);
      expect(hiearchy[0].catalog).not.toBeDefined();
      expect(hiearchy[1].catalog).toEqual(
        createCatalog("00a"),
        "should pass the site catalog"
      );
      const hiearchy2 = containsSpy.mock.calls[1][2];
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
        catalog: { schemaVersion: 0 },
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
        properties: { orgUrlKey: "fake-org", schemaVersion: 1 },
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
      const searchVersionsSpy = vi
        .spyOn(searchVersionsModule, "searchVersions")
        .mockResolvedValue([{}, {}] as any);
      const result = await chk.searchVersions();
      expect(searchVersionsSpy).toHaveBeenCalledTimes(1);
      expect(searchVersionsSpy).toHaveBeenCalledWith(
        chk.id,
        authdCtxMgr.context.userRequestOptions
      );
      expect(result.length).toBe(2);
    });
    it("gets a version", async () => {
      const getVersionSpy = vi
        .spyOn(getVersionModule, "getVersion")
        .mockResolvedValue({} as any);
      await chk.getVersion("abc123");
      expect(getVersionSpy).toHaveBeenCalledTimes(1);
      expect(getVersionSpy).toHaveBeenCalledWith(
        chk.id,
        "abc123",
        authdCtxMgr.context.userRequestOptions
      );
    });
    it("creates a version", async () => {
      const createVersionSpy = vi
        .spyOn(createVersionModule, "createVersion")
        .mockResolvedValue({} as any);
      const createVersionOptions = { name: "my special version" };
      await chk.createVersion(createVersionOptions);
      expect(createVersionSpy).toHaveBeenCalledTimes(1);
      const args = createVersionSpy.mock.calls[0];
      const modelArg = args[0];
      expect(modelArg.item).toEqual(model.item);
      expect(args[1]).toEqual(authdCtxMgr.context.userRequestOptions);
      expect(args[2]).toEqual(createVersionOptions);
    });
    it("updates a version", async () => {
      const updateVersionSpy = vi
        .spyOn(updateVersionModule, "updateVersion")
        .mockResolvedValue({} as any);
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
      const args = updateVersionSpy.mock.calls[0];
      const modelArg = args[0];
      expect(modelArg.item).toEqual(model.item);
      expect(args[2]).toEqual(authdCtxMgr.context.userRequestOptions);
      expect(args[1]).toEqual(version);
    });

    it("updates version metadata", async () => {
      const updateVersionMetadataSpy = vi
        .spyOn(updateVersionMetadataModule, "updateVersionMetadata")
        .mockResolvedValue({} as any);
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
      const deleteVersionSpy = vi
        .spyOn(deleteVersionModule, "deleteVersion")
        .mockResolvedValue({ success: true } as any);
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
      const spy = vi
        .spyOn(EditConfigModule, "getEditorConfig")
        .mockResolvedValue({ fake: "config" } as any);
      const chk = HubSite.fromJson(
        { id: "bc3", name: "Test Entity" },
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
        getFollowersGroupSpy = vi
          .spyOn(chk, "getFollowersGroup")
          .mockResolvedValue({} as any);
        const enrichEntitySpy = vi
          .spyOn(EnrichEntityModule, "enrichEntity")
          .mockResolvedValue({} as any);
        await chk.toEditor({}, ["someEnrichment AS _someEnrichment"] as any);
        expect(enrichEntitySpy).toHaveBeenCalledTimes(1);
        expect(getFollowersGroupSpy).toHaveBeenCalledTimes(1);
      });
      it("uses _urlInfo if provided", async () => {
        const site = HubSite.fromJson(
          {
            id: "bc3",
            name: "Test Entity",
            _urlInfo: { subdomain: "my-subdomain" },
          },
          authdCtxMgr.context
        );
        getFollowersGroupSpy = vi
          .spyOn(site, "getFollowersGroup")
          .mockResolvedValue({ typeKeywords: ["cannotDiscuss"] } as any);
        const result = await site.toEditor();
        expect(result._urlInfo.subdomain).toEqual("my-subdomain");
      });
      describe("entity transforms", () => {
        it("sets the _followers.showFollowAction property based on the presence of the hub:site:feature:follow feature", async () => {
          getFollowersGroupSpy = vi
            .spyOn(chk, "getFollowersGroup")
            .mockResolvedValue({} as any);
          const result = await chk.toEditor();
          expect(result._followers?.showFollowAction).toBe(true);
        });
        describe("_followers.isDiscussable", () => {
          it("set to false by default (when no followers group is returned)", async () => {
            getFollowersGroupSpy = vi
              .spyOn(chk, "getFollowersGroup")
              .mockResolvedValue(null as any);
            const result = await chk.toEditor();
            expect(result._followers?.isDiscussable).toBe(false);
          });
          it("set to true when the followers group is discussable", async () => {
            getFollowersGroupSpy = vi
              .spyOn(chk, "getFollowersGroup")
              .mockResolvedValue({ typeKeywords: [] } as any);
            const result = await chk.toEditor();
            expect(result._followers?.isDiscussable).toBe(true);
          });
          it("set to false when the followers group is not discussable", async () => {
            getFollowersGroupSpy = vi
              .spyOn(chk, "getFollowersGroup")
              .mockResolvedValue({ typeKeywords: ["cannotDiscuss"] } as any);
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
        getFollowersGroupSpy = vi
          .spyOn(chk, "getFollowersGroup")
          .mockImplementation(() =>
            Promise.resolve({
              id: "followers00c",
              typeKeywords: [],
            } as unknown as PortalModule.IGroup)
          );
      });
      it("handles simple prop change", async () => {
        const saveSpy = vi
          .spyOn(chk, "save")
          .mockResolvedValue(undefined as any);
        const editor = await chk.toEditor();
        editor.name = "new name";
        (editor._followers as any).isDiscussable = undefined;
        const result = await chk.fromEditor(editor);
        expect(saveSpy).toHaveBeenCalledTimes(1);
        expect(result.name).toEqual("new name");
        expect(getFollowersGroupSpy).toHaveBeenCalledTimes(1);
      });
      it("handles thumbnail change", async () => {
        const saveSpy = vi
          .spyOn(chk, "save")
          .mockResolvedValue(undefined as any);
        const editor = await chk.toEditor();
        editor.name = "new name";
        (editor._followers as any).isDiscussable = undefined;
        editor._thumbnail = {
          blob: "fake blob",
          filename: "thumbnail.png",
        } as any;
        const result = await chk.fromEditor(editor);
        expect(saveSpy).toHaveBeenCalledTimes(1);
        expect(getProp(result, "_thumbnail")).not.toBeDefined();
        expect(getFollowersGroupSpy).toHaveBeenCalledTimes(1);
      });

      it("handles thumbnail clear", async () => {
        const saveSpy = vi
          .spyOn(chk, "save")
          .mockResolvedValue(undefined as any);
        const editor = await chk.toEditor();
        editor.name = "new name";
        (editor._followers as any).isDiscussable = undefined;
        editor._thumbnail = {} as any;
        const result = await chk.fromEditor(editor);
        expect(saveSpy).toHaveBeenCalledTimes(1);
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
            { id: "bc3", name: "Test Entity" },
            authdCtxMgr.context
          );
          saveSpy = vi.spyOn(_chk, "save").mockResolvedValue(undefined as any);
          setFollowersGroupAccessSpy = vi
            .spyOn(_chk, "setFollowersGroupAccess")
            .mockResolvedValue(undefined as any);
          setFollowersGroupIsDiscussableSpy = vi
            .spyOn(_chk, "setFollowersGroupIsDiscussable")
            .mockResolvedValue(undefined as any);
          _getFollowersGroupSpy = vi
            .spyOn(_chk, "getFollowersGroup")
            .mockImplementation(() =>
              Promise.resolve({
                id: "followers00c",
                typeKeywords: [],
              } as unknown as PortalModule.IGroup)
            );
          editor = await _chk.toEditor();
        });
        it("does nothing if followers information is not present on the editor values", async () => {
          editor._followers = undefined as any;
          await _chk.fromEditor(editor);
          expect(saveSpy).toHaveBeenCalledTimes(1);
          expect(setFollowersGroupAccessSpy).not.toHaveBeenCalled();
          expect(_getFollowersGroupSpy).toHaveBeenCalledTimes(1);
        });
        it("handles setting the followers group access", async () => {
          editor._followers = { groupAccess: "public" } as any;
          await _chk.fromEditor(editor);
          expect(saveSpy).toHaveBeenCalledTimes(1);
          expect(setFollowersGroupAccessSpy).toHaveBeenCalledTimes(1);
          expect(setFollowersGroupAccessSpy).toHaveBeenCalledWith("public");
          expect(_getFollowersGroupSpy).toHaveBeenCalledTimes(1);
        });
        it("handles setting followers group isDiscussable", async () => {
          editor._followers = { isDiscussable: true } as any;
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
        const _getFollowersGroupSpy = vi
          .spyOn(_chk, "getFollowersGroup")
          .mockImplementation(() =>
            Promise.resolve({
              id: "followers00c",
              typeKeywords: [],
            } as unknown as PortalModule.IGroup)
          );
        const saveSpy = vi
          .spyOn(_chk, "save")
          .mockResolvedValue(undefined as any);
        const editor = await _chk.toEditor();
        editor.name = "new name";
        (editor._followers as any).isDiscussable = undefined;
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
                permission: "hub:site:create",
                collaborationType: "group",
                collaborationId: "3ef",
              },
            ],
            assistant: { schemaVersion: 1, accessGroups: ["group1", "group2"] },
          },
          authdCtxMgr.context
        );
        const saveSpy = vi
          .spyOn(chk, "save")
          .mockResolvedValue(undefined as any);
        const editor = await chk.toEditor();
        const result = await chk.fromEditor(editor);
        const assistantPerms = result.permissions.filter(
          (p: any) => p.permission === "hub:site:assistant:access"
        );
        expect(assistantPerms.length).toBe(2);
        expect(assistantPerms[0].collaborationId).toBe("group1");
        expect(assistantPerms[1].collaborationId).toBe("group2");
        const projectPerms = result.permissions.filter(
          (p: any) => p.permission === "hub:site:create"
        );
        expect(projectPerms.length).toBe(1);
        expect(saveSpy).toHaveBeenCalledTimes(1);
      });
      it("handles assistant group permissions in fromEditor with no existing site with no permissions or assistant", async () => {
        const fetchSpy = vi
          .spyOn(HubSitesModule, "fetchSite")
          .mockImplementation((_id: string) =>
            Promise.resolve({
              id: _id,
              name: "Test Site",
              pages: [],
            } as IHubSite)
          );
        const chk = await HubSite.fetch("3ef", authdCtxMgr.context);
        expect(fetchSpy).toHaveBeenCalledTimes(1);
        expect(chk.toJson().id).toBe("3ef");
        expect(chk.toJson().name).toBe("Test Site");
        const saveSpy = vi
          .spyOn(chk, "save")
          .mockResolvedValue(undefined as any);
        const editor = await chk.toEditor();
        const result = await chk.fromEditor(editor);
        const assistantPerms = result.permissions.filter(
          (p: any) => p.permission === "hub:site:assistant:access"
        );
        expect(assistantPerms.length).toBe(0);
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
