import { IPortal, IUser } from "@esri/arcgis-rest-portal";
import { Catalog, IHubProject, PermissionManager } from "../../src";
import { ArcGISContextManager } from "../../src/ArcGISContextManager";
import { HubProject } from "../../src/projects/HubProject";
import { MOCK_AUTH } from "../mocks/mock-auth";
import * as HubProjectsModule from "../../src/projects/HubProjects";

describe("HubProject Class:", () => {
  let authdCtxMgr: ArcGISContextManager;
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
      } as unknown as IUser,
      portal: {
        name: "DC R&D Center",
        id: "BRXFAKE",
        urlKey: "fake-org",
      } as unknown as IPortal,
      portalUrl: "https://myserver.com",
    });
  });
  it("loads from minimal json", () => {
    const createSpy = spyOn(HubProjectsModule, "createProject");
    const chk = HubProject.fromJson(
      { name: "Test Project" },
      authdCtxMgr.context
    );

    expect(createSpy).not.toHaveBeenCalled();
    expect(chk.name).toEqual("Test Project");
    // adds empty permissions and catalog
    const json = chk.toJson();
    expect(json.permissionDefinition).toEqual([]);
    expect(json.catalogDefinition).toEqual({ schemaVersion: 0 });
  });
  it("save call createProject if object does not have an id", async () => {
    const createSpy = spyOn(HubProjectsModule, "createProject").and.callFake(
      (p: IHubProject) => {
        return Promise.resolve(p);
      }
    );
    const chk = await HubProject.fromJson(
      { name: "Test Project" },
      authdCtxMgr.context
    );
    await chk.save();
    expect(createSpy).toHaveBeenCalledTimes(1);
    expect(chk.name).toEqual("Test Project");
  });
  it("create saves the instance if passed true", async () => {
    const createSpy = spyOn(HubProjectsModule, "createProject").and.callFake(
      (p: IHubProject) => {
        p.id = "3ef";
        return Promise.resolve(p);
      }
    );
    const chk = await HubProject.create(
      { name: "Test Project" },
      authdCtxMgr.context,
      true
    );

    expect(createSpy).toHaveBeenCalledTimes(1);
    expect(chk.name).toEqual("Test Project");
  });
  it("create does not save by default", async () => {
    const createSpy = spyOn(HubProjectsModule, "createProject");
    const chk = await HubProject.create(
      { name: "Test Project" },
      authdCtxMgr.context
    );

    expect(createSpy).not.toHaveBeenCalled();
    expect(chk.name).toEqual("Test Project");
  });

  it("applyChanges updates internal state", () => {
    const chk = HubProject.fromJson(
      { name: "Test Project", catalogDefinition: { schemaVersion: 0 } },
      authdCtxMgr.context
    );
    chk.applyChanges({
      name: "Test Project 2",
      catalogDefinition: { schemaVersion: 2 },
    } as IHubProject);
    expect(chk.name).toEqual("Test Project 2");
    expect(chk.catalogDefinition).toEqual({ schemaVersion: 2 });
  });

  it("save updates if object has id", async () => {
    const updateSpy = spyOn(HubProjectsModule, "updateProject").and.callFake(
      (p: IHubProject) => {
        return Promise.resolve(p);
      }
    );
    const chk = HubProject.fromJson(
      {
        id: "bc3",
        name: "Test Project",
        catalogDefinition: { schemaVersion: 0 },
      },
      authdCtxMgr.context
    );
    await chk.save();
    expect(updateSpy).toHaveBeenCalledTimes(1);
  });

  it("delete", async () => {
    const deleteSpy = spyOn(HubProjectsModule, "deleteProject").and.callFake(
      () => {
        return Promise.resolve();
      }
    );
    const chk = HubProject.fromJson(
      { name: "Test Project" },
      authdCtxMgr.context
    );
    await chk.delete();
    expect(deleteSpy).toHaveBeenCalledTimes(1);
    // all fns should now throw an error
    expect(() => {
      chk.toJson();
    }).toThrowError("HubProject is already destroyed.");

    expect(() => {
      chk.applyChanges({ name: "Test Project 2" } as IHubProject);
    }).toThrowError("HubProject is already destroyed.");

    // async calls
    try {
      await chk.delete();
    } catch (e) {
      expect(e.message).toEqual("HubProject is already destroyed.");
    }

    try {
      await chk.save();
    } catch (e) {
      expect(e.message).toEqual("HubProject is already destroyed.");
    }
  });

  it("internal instance accessors", () => {
    const chk = HubProject.fromJson(
      { name: "Test Project", catalogDefinition: { schemaVersion: 0 } },
      authdCtxMgr.context
    );

    expect(chk.catalog instanceof Catalog).toBeTruthy();
    expect(chk.permissions instanceof PermissionManager).toBeTruthy();
  });

  it("setting catalogDefinition updates catalog instance", () => {
    const chk = HubProject.fromJson(
      { name: "Test Project", catalogDefinition: { schemaVersion: 0 } },
      authdCtxMgr.context
    );
    chk.catalogDefinition = { schemaVersion: 2 };
    expect(chk.catalogDefinition).toEqual({ schemaVersion: 2 });
    expect(chk.catalog.schemaVersion).toEqual(2);
  });
});
