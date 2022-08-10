import { IUser, UserSession } from "@esri/arcgis-rest-auth";
import { IItem, IPortal } from "@esri/arcgis-rest-portal";
import { IGroup } from "@esri/arcgis-rest-types";
// For node jasmine tests to work, contextmanager & context need
// to be imported with a full path
import { ArcGISContextManager } from "../../src/ArcGISContextManager";
import { ArcGISContext } from "../../src/ArcGISContext";
import { HubProjectManager } from "../../src/projects/HubProjectManager";
import { getProp, IArcGISContextOptions, IHubProject, IQuery } from "../../src";
import * as HubProjects from "../../src/projects/HubProjects";
import { MOCK_AUTH } from "../mocks/mock-auth";
import * as ThumbnailModule from "../../src/items/setItemThumbnail";
import * as portal from "@esri/arcgis-rest-portal";

describe("HubProjectManager:", () => {
  // Setup the store
  let authdMgr: HubProjectManager;
  let unauthdMgr: HubProjectManager;
  beforeEach(async () => {
    const mgr = await ArcGISContextManager.create();
    unauthdMgr = HubProjectManager.init(mgr);
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
      } as unknown as IPortal,
      portalUrl: "https://myserver.com",
    });
    authdMgr = HubProjectManager.init(authdCtxMgr);
  });
  describe("create:", () => {
    let createSpy: jasmine.Spy;
    beforeEach(() => {
      createSpy = spyOn(HubProjects, "createProject").and.returnValue(
        Promise.resolve({
          id: "3ef",
        })
      );
    });
    it("uses context by default", async () => {
      await authdMgr.create({
        name: "Fake project",
        orgUrlKey: "dcdev",
      });
      const prj = createSpy.calls.argsFor(0)[0];
      expect(prj.orgUrlKey).toBe("dcdev");
      const ro = createSpy.calls.argsFor(0)[1];
      expect(ro.authentication).toBe(MOCK_AUTH);
    });
    it("uses reqOpts if passed", async () => {
      const fakeSession = {
        username: "vader",
      } as unknown as UserSession;
      await authdMgr.create(
        { name: "Fake project" },
        { authentication: fakeSession }
      );
      const ro = createSpy.calls.argsFor(0)[1];
      expect(ro.authentication).toBe(fakeSession);
    });
    it("uses org info from context if not passed", async () => {
      await authdMgr.create({
        name: "Fake project",
      });
      const prj = createSpy.calls.argsFor(0)[0];
      expect(prj.orgUrlKey).toBe("fake-org");
      const ro = createSpy.calls.argsFor(0)[1];
      expect(ro.authentication).toBe(MOCK_AUTH);
    });
    it("throws HubError if not authd", async () => {
      try {
        await unauthdMgr.create({ name: "Fake project" });
      } catch (err) {
        expect(getProp(err, "name")).toBe("HubError");
        expect(getProp(err, "message")).toContain("requires authentication");
      }
    });
  });
  describe("update:", () => {
    let updateSpy: jasmine.Spy;
    beforeEach(() => {
      updateSpy = spyOn(HubProjects, "updateProject").and.returnValue(
        Promise.resolve({
          id: "3ef",
        })
      );
    });
    it("uses context by default", async () => {
      await authdMgr.update({
        name: "Fake project",
      } as unknown as IHubProject);
      const ro = updateSpy.calls.argsFor(0)[1];
      expect(ro.authentication).toBe(MOCK_AUTH);
    });
    it("uses reqOpts if passed", async () => {
      const fakeSession = {
        username: "vader",
      } as unknown as UserSession;
      await authdMgr.update(
        { name: "Fake project" } as unknown as IHubProject,
        { authentication: fakeSession }
      );
      const ro = updateSpy.calls.argsFor(0)[1];
      expect(ro.authentication).toBe(fakeSession);
    });
    it("throws HubError if not authd", async () => {
      try {
        await unauthdMgr.update({
          name: "Fake project",
        } as unknown as IHubProject);
      } catch (err) {
        expect(getProp(err, "name")).toBe("HubError");
        expect(getProp(err, "message")).toContain("requires authentication");
      }
    });
  });

  describe("access:", () => {
    let accessSpy: jasmine.Spy;
    beforeEach(() => {
      accessSpy = spyOn(portal, "setItemAccess").and.returnValue(
        Promise.resolve({
          id: "3ef",
        })
      );
    });
    it("uses context by default", async () => {
      await authdMgr.setAccess(
        { id: "3ef", owner: "test" } as unknown as IHubProject,
        "org"
      );
      const ro = accessSpy.calls.argsFor(0)[0];
      expect(ro.authentication).toBe(MOCK_AUTH);
    });
    it("uses reqOpts if passed", async () => {
      const fakeSession = {
        username: "vader",
      } as unknown as UserSession;
      await authdMgr.setAccess(
        { id: "3ef", owner: "test" } as unknown as IHubProject,
        "org",
        { authentication: fakeSession }
      );
      const ro = accessSpy.calls.argsFor(0)[0];
      expect(ro.authentication).toBe(fakeSession);
    });
    it("throws HubError if not authd", async () => {
      try {
        await unauthdMgr.setAccess(
          { id: "3ef", owner: "test" } as unknown as IHubProject,
          "org"
        );
      } catch (err) {
        expect(getProp(err, "name")).toBe("HubError");
        expect(getProp(err, "message")).toContain("requires authentication");
      }
    });
  });

  describe("shareToGroup:", () => {
    let groupSpy: jasmine.Spy;
    beforeEach(() => {
      groupSpy = spyOn(portal, "shareItemWithGroup").and.returnValue(
        Promise.resolve({
          id: "3ef",
        })
      );
    });
    it("uses context by default", async () => {
      await authdMgr.shareToGroup(
        { id: "3ef", owner: "test" } as unknown as IHubProject,
        {
          id: "abc123",
          capabilities: ["updateitemcontrol"],
        } as unknown as IGroup
      );
      const ro = groupSpy.calls.argsFor(0)[0];
      expect(ro.authentication).toBe(MOCK_AUTH);
    });
    it("uses reqOpts if passed", async () => {
      const fakeSession = {
        username: "vader",
      } as unknown as UserSession;
      await authdMgr.shareToGroup(
        { id: "3ef", owner: "test" } as unknown as IHubProject,
        {
          id: "abc123",
          capabilities: ["updateitemcontrol"],
        } as unknown as IGroup,
        { authentication: fakeSession }
      );
      const ro = groupSpy.calls.argsFor(0)[0];
      expect(ro.authentication).toBe(fakeSession);
    });
    it("throws HubError if not authd", async () => {
      try {
        await unauthdMgr.shareToGroup(
          { id: "3ef", owner: "test" } as unknown as IHubProject,
          {
            id: "abc123",
            capabilities: ["updateitemcontrol"],
          } as unknown as IGroup
        );
      } catch (err) {
        expect(getProp(err, "name")).toBe("HubError");
        expect(getProp(err, "message")).toContain("requires authentication");
      }
    });
  });

  describe("shareToGroups:", () => {
    let groupsSpy: jasmine.Spy;
    beforeEach(() => {
      groupsSpy = spyOn(portal, "shareItemWithGroup").and.returnValue(
        Promise.resolve({
          id: "3ef",
        })
      );
    });
    it("uses reqOpts if passed", async () => {
      const fakeSession = {
        username: "vader",
      } as unknown as UserSession;
      await authdMgr.shareToGroups(
        { id: "3ef", owner: "test" } as unknown as IHubProject,
        [
          {
            id: "abc123",
            capabilities: ["updateitemcontrol"],
          } as unknown as IGroup,
        ],
        { authentication: fakeSession }
      );
      const ro = groupsSpy.calls.argsFor(0)[0];
      expect(ro.authentication).toBe(fakeSession);
    });
    it("throws HubError if not authd", async () => {
      try {
        await unauthdMgr.shareToGroups(
          { id: "3ef", owner: "test" } as unknown as IHubProject,
          [
            {
              id: "abc123",
              capabilities: ["updateitemcontrol"],
            } as unknown as IGroup,
          ]
        );
      } catch (err) {
        expect(getProp(err, "name")).toBe("HubError");
        expect(getProp(err, "message")).toContain("requires authentication");
      }
    });
  });

  describe("unshareFromGroup:", () => {
    let groupSpy: jasmine.Spy;
    beforeEach(() => {
      groupSpy = spyOn(portal, "unshareItemWithGroup").and.returnValue(
        Promise.resolve({
          id: "3ef",
        })
      );
    });
    it("uses context by default", async () => {
      await authdMgr.unshareFromGroup(
        { id: "3ef", owner: "test" } as unknown as IHubProject,
        {
          id: "abc123",
          capabilities: ["updateitemcontrol"],
        } as unknown as IGroup
      );
      const ro = groupSpy.calls.argsFor(0)[0];
      expect(ro.authentication).toBe(MOCK_AUTH);
    });
    it("uses reqOpts if passed", async () => {
      const fakeSession = {
        username: "vader",
      } as unknown as UserSession;
      await authdMgr.unshareFromGroup(
        { id: "3ef", owner: "test" } as unknown as IHubProject,
        {
          id: "abc123",
          capabilities: ["updateitemcontrol"],
        } as unknown as IGroup,
        { authentication: fakeSession }
      );
      const ro = groupSpy.calls.argsFor(0)[0];
      expect(ro.authentication).toBe(fakeSession);
    });
    it("throws HubError if not authd", async () => {
      try {
        await unauthdMgr.unshareFromGroup(
          { id: "3ef", owner: "test" } as unknown as IHubProject,
          {
            id: "abc123",
            capabilities: ["updateitemcontrol"],
          } as unknown as IGroup
        );
      } catch (err) {
        expect(getProp(err, "name")).toBe("HubError");
        expect(getProp(err, "message")).toContain("requires authentication");
      }
    });
  });

  describe("unshareFromGroups:", () => {
    let groupSpy: jasmine.Spy;
    beforeEach(() => {
      groupSpy = spyOn(portal, "unshareItemWithGroup").and.returnValue(
        Promise.resolve({
          id: "3ef",
        })
      );
    });
    it("uses reqOpts if passed", async () => {
      const fakeSession = {
        username: "vader",
      } as unknown as UserSession;
      await authdMgr.unshareFromGroups(
        { id: "3ef", owner: "test" } as unknown as IHubProject,
        [
          {
            id: "abc123",
            capabilities: ["updateitemcontrol"],
          } as unknown as IGroup,
        ],
        { authentication: fakeSession }
      );
      const ro = groupSpy.calls.argsFor(0)[0];
      expect(ro.authentication).toBe(fakeSession);
    });
    it("throws HubError if not authd", async () => {
      try {
        await unauthdMgr.unshareFromGroups(
          { id: "3ef", owner: "test" } as unknown as IHubProject,
          [
            {
              id: "abc123",
              capabilities: ["updateitemcontrol"],
            } as unknown as IGroup,
          ]
        );
      } catch (err) {
        expect(getProp(err, "name")).toBe("HubError");
        expect(getProp(err, "message")).toContain("requires authentication");
      }
    });
  });

  describe("destroy:", () => {
    let destroySpy: jasmine.Spy;
    beforeEach(() => {
      destroySpy = spyOn(HubProjects, "deleteProject").and.returnValue(
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
      getSpy = spyOn(HubProjects, "fetchProject").and.returnValue(
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
      searchSpy = spyOn(HubProjects, "searchProjects").and.returnValue(
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
      getSpy = spyOn(HubProjects, "fetchProject").and.returnValue(
        Promise.resolve({
          id: "3ef",
        })
      );
    });
    it("uses context by default", async () => {
      const p = {
        id: "3ef",
      } as unknown as IHubProject;
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
      } as unknown as IHubProject;
      await authdMgr.updateThumbnail(p, "foo", "myFile.png", {
        authentication: fakeSession,
      });
      const so = tnSpy.calls.argsFor(0)[3];
      expect(so.authentication).toBe(fakeSession);
      const ro = getSpy.calls.argsFor(0)[1];
      expect(ro.authentication).toBe(fakeSession);
    });
  });
  describe("constructor:", () => {
    it("accepts and uses IArcGISContext", async () => {
      const ctx = new ArcGISContext({
        id: 12312,
        portalUrl: "https://ent.myorg.com/gis",
      } as IArcGISContextOptions);

      const mgr = HubProjectManager.init(ctx);

      const fetchSpy = spyOn(HubProjects, "fetchProject").and.returnValue(
        Promise.resolve({
          id: "3ef",
        })
      );
      await mgr.fetch("3ef");
      const ro = fetchSpy.calls.argsFor(0)[1];
      expect(ro.portal).toBe("https://ent.myorg.com/gis/sharing/rest");
    });
    it("get returns error if context manager/context is mangled", async () => {
      // In this test we cover a case where the store is
      // passed a mangled contextManager,
      unauthdMgr = HubProjectManager.init({
        context: {},
      } as unknown as ArcGISContextManager);
      try {
        await unauthdMgr.fetch("3ef");
      } catch (err) {
        expect(getProp(err, "name")).toBe("HubError");
        expect(getProp(err, "message")).toContain(
          "HubProjectManager is configured incorrectly"
        );
      }
    });
  });
  describe("fromItem:", () => {
    let convertSpy: jasmine.Spy;
    beforeEach(() => {
      convertSpy = spyOn(HubProjects, "convertItemToProject").and.returnValue(
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
