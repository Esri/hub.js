import { IUser, UserSession } from "@esri/arcgis-rest-auth";
import { IPortal } from "@esri/arcgis-rest-portal";
// For node jasmine tests to work, contextmanager needs to be
// imported with a full path
import { ArcGISContextManager } from "../../src/ArcGISContextManager";
import { HubProjectStore } from "../../src/projects/HubProjectStore";
import { getProp, HubError, IHubProject } from "../../src";
import * as HubProjects from "../../src/projects/HubProjects";
import { MOCK_AUTH } from "../mocks/mock-auth";

describe("HubProjectStore:", () => {
  // Setup the store
  let authdStore: HubProjectStore;
  let store: HubProjectStore;
  beforeEach(async () => {
    const mgr = await ArcGISContextManager.create();
    store = await HubProjectStore.create(mgr);
    // When we pass in all this information, the context
    // manager will not try to fetch anything, so no need
    // to mock those calls
    const authdMgr = await ArcGISContextManager.create({
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
    authdStore = await HubProjectStore.create(authdMgr);
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
      await authdStore.create({
        name: "Fake project",
        org: { id: "OTHERFAKE", key: "dcdev" },
      });
      const prj = createSpy.calls.argsFor(0)[0];
      expect(prj.org.key).toBe("dcdev");
      const ro = createSpy.calls.argsFor(0)[1];
      expect(ro.authentication).toBe(MOCK_AUTH);
    });
    it("uses reqOpts if passed", async () => {
      const fakeSession = {
        username: "vader",
      } as unknown as UserSession;
      await authdStore.create(
        { name: "Fake project" },
        { authentication: fakeSession }
      );
      const ro = createSpy.calls.argsFor(0)[1];
      expect(ro.authentication).toBe(fakeSession);
    });
    it("uses org info from context if not passed", async () => {
      await authdStore.create({
        name: "Fake project",
      });
      const prj = createSpy.calls.argsFor(0)[0];
      expect(prj.org.key).toBe("fake-org");
      const ro = createSpy.calls.argsFor(0)[1];
      expect(ro.authentication).toBe(MOCK_AUTH);
    });
    it("throws HubError if not authd", async () => {
      try {
        await store.create({ name: "Fake project" });
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
      await authdStore.update({
        name: "Fake project",
      } as unknown as IHubProject);
      const ro = updateSpy.calls.argsFor(0)[1];
      expect(ro.authentication).toBe(MOCK_AUTH);
    });
    it("uses reqOpts if passed", async () => {
      const fakeSession = {
        username: "vader",
      } as unknown as UserSession;
      await authdStore.update(
        { name: "Fake project" } as unknown as IHubProject,
        { authentication: fakeSession }
      );
      const ro = updateSpy.calls.argsFor(0)[1];
      expect(ro.authentication).toBe(fakeSession);
    });
    it("throws HubError if not authd", async () => {
      try {
        await store.update({ name: "Fake project" } as unknown as IHubProject);
      } catch (err) {
        expect(getProp(err, "name")).toBe("HubError");
        expect(getProp(err, "message")).toContain("requires authentication");
      }
    });
  });

  describe("destroy:", () => {
    let destroySpy: jasmine.Spy;
    beforeEach(() => {
      destroySpy = spyOn(HubProjects, "destroyProject").and.returnValue(
        Promise.resolve({
          id: "3ef",
        })
      );
    });
    it("uses context by default", async () => {
      await authdStore.destroy("3ef");
      const ro = destroySpy.calls.argsFor(0)[1];
      expect(ro.authentication).toBe(MOCK_AUTH);
    });
    it("uses reqOpts if passed", async () => {
      const fakeSession = {
        username: "vader",
      } as unknown as UserSession;
      await authdStore.destroy("3ef", { authentication: fakeSession });
      const ro = destroySpy.calls.argsFor(0)[1];
      expect(ro.authentication).toBe(fakeSession);
    });
    it("throws HubError if not authd", async () => {
      try {
        await store.destroy("3ef");
      } catch (err) {
        expect(getProp(err, "name")).toBe("HubError");
        expect(getProp(err, "message")).toContain("requires authentication");
      }
    });
  });
  describe("get: ", () => {
    let getSpy: jasmine.Spy;
    beforeEach(() => {
      getSpy = spyOn(HubProjects, "getProject").and.returnValue(
        Promise.resolve({
          id: "3ef",
        })
      );
    });
    it("uses context by default", async () => {
      await authdStore.get("3ef");
      const ro = getSpy.calls.argsFor(0)[1];
      expect(ro.authentication).toBe(MOCK_AUTH);
    });
    it("uses reqOpts if passed", async () => {
      const fakeSession = {
        username: "vader",
        getToken: () => Promise.resolve("FKAE_TOKEN"),
      } as unknown as UserSession;
      await authdStore.get("3ef", { authentication: fakeSession });
      const ro = getSpy.calls.argsFor(0)[1];
      expect(ro.authentication).toBe(fakeSession);
    });
    it("throws HubError if not authd", async () => {
      try {
        await store.get("3ef");
      } catch (err) {
        expect(getProp(err, "name")).toBe("HubError");
        expect(getProp(err, "message")).toContain("requires authentication");
      }
    });
  });
  describe("bad manager", () => {
    // In these tests we cover a case where the store is
    // passed a mangled contextManager,
    it("get returns error is context manager is mangled", async () => {
      store = await HubProjectStore.create({
        context: {},
      } as unknown as ArcGISContextManager);
      try {
        await store.get("3ef");
      } catch (err) {
        expect(getProp(err, "name")).toBe("HubError");
        expect(getProp(err, "message")).toContain(
          "HubProjectStore is configured incorrectly"
        );
      }
    });
  });
});
