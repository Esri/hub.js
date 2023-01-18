import * as PortalModule from "@esri/arcgis-rest-portal";
import { IHubProject, UiSchemaElementOptions } from "../../src";
import { Catalog } from "../../src/search";
import { ArcGISContextManager } from "../../src/ArcGISContextManager";
import { HubProject } from "../../src/projects/HubProject";
import { MOCK_AUTH } from "../mocks/mock-auth";
import * as editModule from "../../src/projects/edit";
import * as fetchModule from "../../src/projects/fetch";

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
      } as unknown as PortalModule.IUser,
      portal: {
        name: "DC R&D Center",
        id: "BRXFAKE",
        urlKey: "fake-org",
      } as unknown as PortalModule.IPortal,
      portalUrl: "https://myserver.com",
    });
  });

  describe("static methods:", () => {
    it("loads from minimal json", () => {
      const createSpy = spyOn(editModule, "createProject");
      const chk = HubProject.fromJson(
        { name: "Test Project" },
        authdCtxMgr.context
      );

      expect(createSpy).not.toHaveBeenCalled();
      expect(chk.toJson().name).toEqual("Test Project");
      // adds empty permissions and catalog
      const json = chk.toJson();
      expect(json.permissions).toEqual([]);
      expect(json.catalog).toEqual({ schemaVersion: 0 });
    });
    it("loads based on identifier", async () => {
      const fetchSpy = spyOn(fetchModule, "fetchProject").and.callFake(
        (id: string) => {
          return Promise.resolve({
            id,
            name: "Test Project",
          });
        }
      );

      const chk = await HubProject.fetch("3ef", authdCtxMgr.context);
      expect(fetchSpy).toHaveBeenCalledTimes(1);
      expect(chk.toJson().id).toBe("3ef");
      expect(chk.toJson().name).toBe("Test Project");
    });

    it("handle load missing projects", async () => {
      const fetchSpy = spyOn(fetchModule, "fetchProject").and.callFake(
        (id: string) => {
          const err = new Error(
            "CONT_0001: Item does not exist or is inaccessible."
          );
          return Promise.reject(err);
        }
      );
      try {
        await HubProject.fetch("3ef", authdCtxMgr.context);
      } catch (ex) {
        expect(fetchSpy).toHaveBeenCalledTimes(1);
        expect(ex.message).toBe("Project not found.");
      }
    });

    it("handle load errors", async () => {
      const fetchSpy = spyOn(fetchModule, "fetchProject").and.callFake(
        (id: string) => {
          const err = new Error("ZOMG!");
          return Promise.reject(err);
        }
      );
      try {
        await HubProject.fetch("3ef", authdCtxMgr.context);
      } catch (ex) {
        expect(fetchSpy).toHaveBeenCalledTimes(1);
        expect(ex.message).toBe("ZOMG!");
      }
    });

    it("returns editorConfig", async () => {
      const spy = spyOn(editModule, "getHubProjectEditorConfig").and.callFake(
        () => {
          return Promise.resolve({ schema: {}, uiSchema: {} });
        }
      );

      await HubProject.getEditorConfig("test.scope", "edit");
      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveBeenCalledWith("test.scope", "edit", []);
    });

    it("returns editorConfig integrating options", async () => {
      const spy = spyOn(editModule, "getHubProjectEditorConfig").and.callFake(
        () => {
          return Promise.resolve({ schema: {}, uiSchema: {} });
        }
      );

      const opts: UiSchemaElementOptions[] = [];

      await HubProject.getEditorConfig("test.scope", "edit", opts);
      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveBeenCalledWith("test.scope", "edit", opts);
    });
  });

  it("save call createProject if object does not have an id", async () => {
    const createSpy = spyOn(editModule, "createProject").and.callFake(
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
    expect(chk.toJson().name).toEqual("Test Project");
  });
  it("create saves the instance if passed true", async () => {
    const createSpy = spyOn(editModule, "createProject").and.callFake(
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
    expect(chk.toJson().name).toEqual("Test Project");
  });
  it("create does not save by default", async () => {
    const createSpy = spyOn(editModule, "createProject");
    const chk = await HubProject.create(
      { name: "Test Project" },
      authdCtxMgr.context
    );

    expect(createSpy).not.toHaveBeenCalled();
    expect(chk.toJson().name).toEqual("Test Project");
  });

  it("update applies partial chagnes to internal state", () => {
    const chk = HubProject.fromJson(
      { name: "Test Project", catalog: { schemaVersion: 0 } },
      authdCtxMgr.context
    );
    chk.update({
      name: "Test Project 2",
      permissions: [
        {
          permission: "hub:project:create",
          collaborationType: "group",
          collaborationId: "3ef",
        },
      ],
      catalog: { schemaVersion: 2 },
    });
    expect(chk.toJson().name).toEqual("Test Project 2");
    expect(chk.toJson().catalog).toEqual({ schemaVersion: 2 });

    chk.update({ tags: ["one", "two"] });
    expect(chk.toJson().tags).toEqual(["one", "two"]);
  });

  it("save updates if object has id", async () => {
    const updateSpy = spyOn(editModule, "updateProject").and.callFake(
      (p: IHubProject) => {
        return Promise.resolve(p);
      }
    );
    const chk = HubProject.fromJson(
      {
        id: "bc3",
        name: "Test Project",
        catalog: { schemaVersion: 0 },
      },
      authdCtxMgr.context
    );
    await chk.save();
    expect(updateSpy).toHaveBeenCalledTimes(1);
  });

  it("delete", async () => {
    const deleteSpy = spyOn(editModule, "deleteProject").and.callFake(() => {
      return Promise.resolve();
    });
    const chk = HubProject.fromJson(
      { name: "Test Project" },
      authdCtxMgr.context
    );
    await chk.delete();
    expect(deleteSpy).toHaveBeenCalledTimes(1);
    // all fns should now throw an error
    expect(() => {
      chk.toJson();
    }).toThrowError("Entity is already destroyed.");

    expect(() => {
      chk.update({ name: "Test Project 2" } as IHubProject);
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
      { name: "Test Project", catalog: { schemaVersion: 0 } },
      authdCtxMgr.context
    );

    expect(chk.catalog instanceof Catalog).toBeTruthy();
  });

  it("setting catalog updates catalog instance", () => {
    const chk = HubProject.fromJson(
      { name: "Test Project", catalog: { schemaVersion: 0 } },
      authdCtxMgr.context
    );
    chk.update({ catalog: { schemaVersion: 2 } });
    expect(chk.toJson().catalog).toEqual({ schemaVersion: 2 });
    expect(chk.catalog.schemaVersion).toEqual(2);
  });
});
