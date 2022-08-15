import { IPortal } from "@esri/arcgis-rest-portal";
import { IUser } from "@esri/arcgis-rest-types";
// For node jasmine tests to work, contextmanager needs to be
// imported with a full path
import { ArcGISContextManager } from "../src/ArcGISContextManager";
import { Hub } from "../src/Hub";
import { IArcGISContextManagerOptions, IHubProject } from "../src";
import { MOCK_AUTH } from "./mocks/mock-auth";
import * as ProjectsModule from "../src/projects/HubProjects";

/**
 * Pass this into a ContextManager.create call
 * or directly into Hub.create({managerOptions})
 * to avoid issues w/ context manager making xhrs
 * during it's initialization
 */
const managerOptions: IArcGISContextManagerOptions = {
  authentication: MOCK_AUTH,
  currentUser: {
    username: "casey",
  } as unknown as IUser,
  portal: {
    name: "DC R&D Center",
    urlKey: "dcdev",
    customBaseUrl: "maps.arcgis.com",
  } as unknown as IPortal,
  portalUrl: "https://www.arcgis.com",
};

describe("Hub:", () => {
  describe("static factory and context:", () => {
    it("uses passed in context manager", async () => {
      const contextManager = await ArcGISContextManager.create(managerOptions);
      const chk = await Hub.create({ contextManager });
      expect(chk.context.portalUrl).toBe("https://dcdev.maps.arcgis.com");
    });
    it("uses passed in context manager options", async () => {
      const chk = await Hub.create({ managerOptions });
      expect(chk.context.portalUrl).toBe("https://dcdev.maps.arcgis.com");
    });
    it("uses defaults if passed nothing", async () => {
      const chk = await Hub.create({});
      expect(chk.context.portalUrl).toBe("https://www.arcgis.com");
    });
  });
  describe("returns managers:", () => {
    it("returns projectManager", async () => {
      const chk = await Hub.create({ managerOptions });

      // should be able to dot into projects
      expect(chk.projects.create).toBeDefined();
      // or get a ref to it
      const ps = chk.projects;
      // since we don't expose context on the manager
      // there's no clean way to verify that the contextMgr
      // was passed into the manager. So we're just verifying
      // that what we got back has a create function
      expect(ps.create).toBeDefined();
    });
    it("returns siteManager", async () => {
      const chk = await Hub.create({ managerOptions });

      // should be able to dot into projects
      expect(chk.sites.create).toBeDefined();
      // or get a ref to it
      const ps = chk.sites;
      // since we don't expose context on the manager
      // there's no clean way to verify that the contextMgr
      // was passed into the manager. So we're just verifying
      // that what we got back has a create function
      expect(ps.create).toBeDefined();
    });
  });
  describe("projects", () => {
    it("fetches project instance by identifier", async () => {
      const chk = await Hub.create({ managerOptions });
      const fetchSpy = spyOn(ProjectsModule, "fetchProject").and.returnValue(
        Promise.resolve({ id: "3ef" } as IHubProject)
      );
      const p = await chk.fetchProject("3ef");
      expect(fetchSpy).toHaveBeenCalledTimes(1);
      expect(p.id).toBe("3ef");
    });

    it("deletes project by id", async () => {
      const chk = await Hub.create({ managerOptions });
      const deleteSpy = spyOn(ProjectsModule, "deleteProject").and.returnValue(
        Promise.resolve({ id: "3ef" } as IHubProject)
      );
      await chk.deleteProject("3ef");
      expect(deleteSpy).toHaveBeenCalledTimes(1);
    });
  });
});
