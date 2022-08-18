import { IItem, IPortal, IUser } from "@esri/arcgis-rest-portal";
import { UserSession } from "@esri/arcgis-rest-auth";
// For node jasmine tests to work, contextmanager & context need
// to be imported with a full path
import { ArcGISContextManager } from "../../src/ArcGISContextManager";
import { ArcGISContext } from "../../src/ArcGISContext";
import { HubSiteManager } from "../../src/sites/HubSiteManager";
import { getProp, IArcGISContextOptions, IHubSite, IQuery } from "../../src";

import * as HubSites from "../../src/sites/HubSites";

import { MOCK_AUTH } from "../mocks/mock-auth";
import * as ThumbnailModule from "../../src/items/setItemThumbnail";

describe("HubSiteManager:", () => {
  // Setup the store
  let authdMgr: HubSiteManager;
  let unauthdMgr: HubSiteManager;
  beforeEach(async () => {
    const mgr = await ArcGISContextManager.create();
    unauthdMgr = HubSiteManager.init(mgr);
    // When we pass in all this information, the context
    // manager will not try to fetch anything, so no need
    // to mock those calls
    const authdCtxMgr = await ArcGISContextManager.create({
      authentication: MOCK_AUTH,
      currentUser: {
        username: "casey",
      } as unknown as IUser,
      portal: {
        name: "DC R&D Center",
        id: "BRXFAKE",
        urlKey: "fake-org",
        isPortal: false,
        customBaseUrl: "maps.arcgis.com",
      } as unknown as IPortal,
      portalUrl: "https://fake-org.maps.arcgis.com",
    });
    authdMgr = HubSiteManager.init(authdCtxMgr);
  });

  describe("create:", () => {
    let createSpy: jasmine.Spy;
    beforeEach(() => {
      createSpy = spyOn(HubSites, "createSite").and.returnValue(
        Promise.resolve({
          id: "3ef",
        })
      );
    });
    it("uses context by default", async () => {
      await authdMgr.create({
        name: "Fake Site",
        orgUrlKey: "dcdev",
      });
      const site = createSpy.calls.argsFor(0)[0];
      expect(site.orgUrlKey).toBe("dcdev");
      const ro = createSpy.calls.argsFor(0)[1];
      expect(ro.authentication).toBe(MOCK_AUTH);
    });
    it("uses reqOpts if passed", async () => {
      const fakeSession = {
        username: "vader",
      } as unknown as UserSession;
      await authdMgr.create(
        { name: "Fake Site" },
        { authentication: fakeSession }
      );
      const ro = createSpy.calls.argsFor(0)[1];
      expect(ro.authentication).toBe(fakeSession);
    });
    it("uses org info from context if not passed", async () => {
      await authdMgr.create({
        name: "Fake Site",
      });
      const site = createSpy.calls.argsFor(0)[0];
      expect(site.orgUrlKey).toBe("fake-org");
      const ro = createSpy.calls.argsFor(0)[1];
      expect(ro.authentication).toBe(MOCK_AUTH);
    });
    it("throws HubError if not authd", async () => {
      try {
        await unauthdMgr.create({ name: "Fake Site" });
      } catch (err) {
        expect(getProp(err, "name")).toBe("HubError");
        expect(getProp(err, "message")).toContain("requires authentication");
      }
    });
  });

  describe("update:", () => {
    let updateSpy: jasmine.Spy;
    beforeEach(() => {
      updateSpy = spyOn(HubSites, "updateSite").and.returnValue(
        Promise.resolve({
          id: "3ef",
        })
      );
    });
    it("uses context by default", async () => {
      await authdMgr.update({
        name: "Fake site",
      } as unknown as IHubSite);
      const ro = updateSpy.calls.argsFor(0)[1];
      expect(ro.authentication).toBe(MOCK_AUTH);
    });
    it("uses reqOpts if passed", async () => {
      const fakeSession = {
        username: "vader",
      } as unknown as UserSession;
      await authdMgr.update({ name: "Fake site" } as unknown as IHubSite, {
        authentication: fakeSession,
      });
      const ro = updateSpy.calls.argsFor(0)[1];
      expect(ro.authentication).toBe(fakeSession);
    });
    it("throws HubError if not authd", async () => {
      try {
        await unauthdMgr.update({
          name: "Fake site",
        } as unknown as IHubSite);
      } catch (err) {
        expect(getProp(err, "name")).toBe("HubError");
        expect(getProp(err, "message")).toContain("requires authentication");
      }
    });
  });

  describe("destroy:", () => {
    let destroySpy: jasmine.Spy;
    beforeEach(() => {
      destroySpy = spyOn(HubSites, "destroySite").and.returnValue(
        Promise.resolve({
          id: "3ef",
        })
      );
    });
    it("uses context by default", async () => {
      await authdMgr.delete("3ef");
      const ro = destroySpy.calls.argsFor(0)[1];
      expect(ro.authentication).toBe(MOCK_AUTH);
    });
    it("uses reqOpts if passed", async () => {
      const fakeSession = {
        username: "vader",
      } as unknown as UserSession;
      await authdMgr.delete("3ef", { authentication: fakeSession });
      const ro = destroySpy.calls.argsFor(0)[1];
      expect(ro.authentication).toBe(fakeSession);
    });
    it("throws HubError if not authd", async () => {
      try {
        await unauthdMgr.delete("3ef");
      } catch (err) {
        expect(getProp(err, "name")).toBe("HubError");
        expect(getProp(err, "message")).toContain("requires authentication");
      }
    });
  });

  describe("fetch: ", () => {
    let getSpy: jasmine.Spy;
    beforeEach(() => {
      getSpy = spyOn(HubSites, "_fetchSite").and.returnValue(
        Promise.resolve({
          id: "3ef",
        })
      );
    });
    it("uses context by default", async () => {
      await authdMgr.fetch("3ef");
      const ro = getSpy.calls.argsFor(0)[1];
      expect(ro.authentication).toBe(MOCK_AUTH);
    });
    it("uses reqOpts if passed", async () => {
      const fakeSession = {
        username: "vader",
        getToken: () => Promise.resolve("FKAE_TOKEN"),
      } as unknown as UserSession;
      await authdMgr.fetch("3ef", { authentication: fakeSession });
      const ro = getSpy.calls.argsFor(0)[1];
      expect(ro.authentication).toBe(fakeSession);
    });
    it("throws HubError if not authd", async () => {
      try {
        await unauthdMgr.fetch("3ef");
      } catch (err) {
        expect(getProp(err, "name")).toBe("HubError");
        expect(getProp(err, "message")).toContain("requires authentication");
      }
    });
  });

  describe("constructor:", () => {
    it("accepts and uses IArcGISContext", async () => {
      const ctx = new ArcGISContext({
        id: 12312,
        portalUrl: "https://ent.myorg.com/gis",
        portalSelf: {
          id: "ABC123",
          name: "fake name",
          isPortal: true,
          portalHostname: "ent.myorg.com/gis",
        },
        authentication: MOCK_AUTH,
      } as IArcGISContextOptions);

      const mgr = HubSiteManager.init(ctx);

      const fetchSpy = spyOn(HubSites, "_fetchSite").and.returnValue(
        Promise.resolve({
          id: "3ef",
        })
      );
      await mgr.fetch("3ef");
      expect(fetchSpy.calls.count()).toBe(1);
      const ro = fetchSpy.calls.argsFor(0)[1];
      expect(ro.portal).toBe("https://ent.myorg.com/gis/sharing/rest");
    });
    it("get returns error if context manager/context is mangled", async () => {
      // In this test we cover a case where the store is
      // passed a mangled contextManager,
      unauthdMgr = HubSiteManager.init({
        context: {},
      } as unknown as ArcGISContextManager);
      try {
        await unauthdMgr.fetch("3ef");
      } catch (err) {
        expect(getProp(err, "name")).toBe("HubError");
        expect(getProp(err, "message")).toContain(
          "HubSiteManager is configured incorrectly"
        );
      }
    });
  });

  describe("search:", () => {
    let searchSpy: jasmine.Spy;
    const query: IQuery = {
      targetEntity: "item",
      filters: [
        {
          predicates: [
            {
              term: "water",
            },
          ],
        },
      ],
    };
    beforeEach(() => {
      searchSpy = spyOn(HubSites, "searchSites").and.returnValue(
        Promise.resolve({
          total: 0,
          results: [],
          facets: [],
          hasNext: false,
        })
      );
    });
    it("uses context by default", async () => {
      await authdMgr.search(query, { num: 10 });
      const so = searchSpy.calls.argsFor(0)[1];
      expect(so.authentication).toBe(MOCK_AUTH);
    });
    it("uses auth from searchOpts if passed", async () => {
      const fakeSession = {
        username: "vader",
        getToken: () => Promise.resolve("FKAE_TOKEN"),
      } as unknown as UserSession;
      await authdMgr.search(query, { num: 10, authentication: fakeSession });
      const so = searchSpy.calls.argsFor(0)[1];
      expect(so.authentication).toBe(fakeSession);
    });
  });
  describe("setThumbnail:", () => {
    let tnSpy: jasmine.Spy;
    let getSpy: jasmine.Spy;
    beforeEach(() => {
      tnSpy = spyOn(ThumbnailModule, "setItemThumbnail").and.returnValue(
        Promise.resolve("response ignored")
      );
      getSpy = spyOn(HubSites, "_fetchSite").and.returnValue(
        Promise.resolve({
          id: "3ef",
        })
      );
    });
    it("uses context by default", async () => {
      const p = {
        id: "3ef",
      } as unknown as IHubSite;
      await authdMgr.updateThumbnail(p, "foo", "myFile.png");
      expect(tnSpy.calls.count()).toBe(1);
      const so = tnSpy.calls.argsFor(0)[3];
      expect(so.authentication).toBe(MOCK_AUTH);

      expect(getSpy.calls.count()).toBe(1);
      const ro = getSpy.calls.argsFor(0)[1];
      expect(ro.authentication).toBe(MOCK_AUTH);
    });
    it("uses auth from searchOpts if passed", async () => {
      const fakeSession = {
        username: "vader",
        getToken: () => Promise.resolve("FKAE_TOKEN"),
      } as unknown as UserSession;
      const p = {
        id: "3ef",
      } as unknown as IHubSite;
      await authdMgr.updateThumbnail(p, "foo", "myFile.png", {
        authentication: fakeSession,
      });
      const so = tnSpy.calls.argsFor(0)[3];
      expect(so.authentication).toBe(fakeSession);
      const ro = getSpy.calls.argsFor(0)[1];
      expect(ro.authentication).toBe(fakeSession);
    });
  });
  describe("fromItem:", () => {
    let convertSpy: jasmine.Spy;
    beforeEach(() => {
      convertSpy = spyOn(HubSites, "convertItemToSite").and.returnValue(
        Promise.resolve({
          id: "3ef",
        })
      );
    });
    it("uses context by default", async () => {
      await authdMgr.fromItem({ id: "3ef" } as unknown as IItem);
      const ro = convertSpy.calls.argsFor(0)[1];
      expect(ro.authentication).toBe(MOCK_AUTH);
    });
    it("uses reqOpts if passed", async () => {
      const fakeSession = {
        username: "vader",
        getToken: () => Promise.resolve("FKAE_TOKEN"),
      } as unknown as UserSession;
      await authdMgr.fromItem({ id: "3ef" } as unknown as IItem, {
        authentication: fakeSession,
      });
      const ro = convertSpy.calls.argsFor(0)[1];
      expect(ro.authentication).toBe(fakeSession);
    });
  });
});
