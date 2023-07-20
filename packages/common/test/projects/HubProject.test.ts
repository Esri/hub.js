import * as PortalModule from "@esri/arcgis-rest-portal";
import {
  IEditorConfig,
  IHubProject,
  IResolvedMetric,
  IUiSchema,
  UiSchemaElementOptions,
} from "../../src";
import { Catalog } from "../../src/search";
import { ArcGISContextManager } from "../../src/ArcGISContextManager";
import { HubProject } from "../../src/projects/HubProject";
import { MOCK_AUTH } from "../mocks/mock-auth";
import * as editModule from "../../src/projects/edit";
import * as fetchModule from "../../src/projects/fetch";
import * as viewModule from "../../src/projects/view";
import * as schemasModule from "../../src/core/schemas/getEntityEditorSchemas";
import * as ResolveMetricModule from "../../src/metrics/resolveMetric";
import * as EditorConfigModule from "../../src/projects/_internal/getProjectEditorConfigOptions";
import * as EntityEditorSchemasModule from "../../src/core/schemas/getEntityEditorSchemas";
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
        privileges: ["portal:user:shareToGroup"],
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
        expect((ex as any).message).toBe("Project not found.");
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
        expect((ex as any).message).toBe("ZOMG!");
      }
    });

    // it("returns editorConfig", async () => {
    //   const spy = spyOn(schemasModule, "getEntityEditorSchemas").and.callFake(
    //     () => {
    //       return Promise.resolve({ schema: {}, uiSchema: {} });
    //     }
    //   );

    //   await HubProject.getEditorConfig("test.scope", "hub:project:edit");
    //   expect(spy).toHaveBeenCalledTimes(1);
    //   expect(spy).toHaveBeenCalledWith("test.scope", "hub:project:edit", []);
    // });

    // it("returns editorConfig integrating options", async () => {
    //   const spy = spyOn(schemasModule, "getEntityEditorSchemas").and.callFake(
    //     () => {
    //       return Promise.resolve({ schema: {}, uiSchema: {} });
    //     }
    //   );

    //   const opts: UiSchemaElementOptions[] = [];

    //   await HubProject.getEditorConfig("test.scope", "hub:project:edit", opts);
    //   expect(spy).toHaveBeenCalledTimes(1);
    //   expect(spy).toHaveBeenCalledWith("test.scope", "hub:project:edit", opts);
    // });
  });

  it("convertToCardModel: delegates to the projectToCardModel util", async () => {
    const spy = spyOn(viewModule, "projectToCardModel");

    const chk = await HubProject.fromJson(
      { name: "Test Project" },
      authdCtxMgr.context
    );
    await chk.convertToCardModel();

    expect(spy).toHaveBeenCalledTimes(1);
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
      expect((e as any).message).toEqual("HubProject is already destroyed.");
    }

    try {
      await chk.save();
    } catch (e) {
      expect((e as any).message).toEqual("HubProject is already destroyed.");
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
  describe("resolveMetrics:", () => {
    it("throws if requested metric is not found", async () => {
      const chk = HubProject.fromJson(
        {
          name: "Test Project",
        },
        authdCtxMgr.context
      );
      try {
        await chk.resolveMetric("projectBudget_00c");
      } catch (e) {
        expect((e as any).message).toEqual(
          "Metric projectBudget_00c not found."
        );
      }
    });

    it("delegates to resolveMetric", async () => {
      const spy = spyOn(ResolveMetricModule, "resolveMetric").and.callFake(
        () => {
          return Promise.resolve({
            features: [],
            generatedAt: 1683060547818,
          } as IResolvedMetric);
        }
      );
      const chk = HubProject.fromJson(
        {
          name: "Test Project",
          metrics: [
            {
              id: "projectBudget_00c",
              name: "Project Budget",
              source: {
                type: "static-value",
                value: 100000,
              },
              entityInfo: {
                id: "00c",
                name: "Some Project Name",
                type: "Hub Project",
              },
            },
          ],
        },
        authdCtxMgr.context
      );

      const result = await chk.resolveMetric("projectBudget_00c");
      expect(spy).toHaveBeenCalledTimes(1);
      expect(result).toEqual({ features: [], generatedAt: 1683060547818 });
    });
  });

  describe("IWithEditorBehavior:", () => {
    it("returns editor config", async () => {
      // spy on getProjectEditorConfigOptions
      const optionsSpy = spyOn(
        EditorConfigModule,
        "getProjectEditorConfigOptions"
      ).and.callFake(() => Promise.resolve());
      // spy on getEntityEditorSchemas
      const schemaSpy = spyOn(
        EntityEditorSchemasModule,
        "getEntityEditorSchemas"
      ).and.callFake(() => {
        return Promise.resolve({ schema: {}, uiSchema: {} } as IEditorConfig);
      });

      const chk = HubProject.fromJson(
        {
          id: "bc3",
          name: "Test Project",
          catalog: { schemaVersion: 0 },
        },
        authdCtxMgr.context
      );
      const config = await chk.getEditorConfig(
        "test.scope",
        "hub:project:edit"
      );
      expect(optionsSpy).toHaveBeenCalledTimes(1);
      expect(schemaSpy).toHaveBeenCalledTimes(1);
      expect(config).toEqual({ schema: {}, uiSchema: {} as IUiSchema });
    });
    it("toEditor with context", () => {
      const chk = HubProject.fromJson(
        {
          name: "Test Project",
          catalog: { schemaVersion: 0 },
        },
        authdCtxMgr.context
      );
      const editor = chk.toEditor({ collaborationGroupId: "00c" });
      // adds groups prop
      expect(editor.groups).toEqual(["00c"]);
    });
    it("toEditor without context", () => {
      const chk = HubProject.fromJson(
        {
          id: "bc3",
          name: "Test Project",
          catalog: { schemaVersion: 0 },
        },
        authdCtxMgr.context
      );
      const editor = chk.toEditor();
      // adds groups prop
      expect(editor.groups).toEqual([]);
    });
    describe("fromEditor:", () => {
      it("simple changes", async () => {
        // spy on HubProject.save
        const saveSpy = spyOn(HubProject.prototype, "save").and.callFake(
          (e: IHubProject) => Promise.resolve(e)
        );
        const chk = HubProject.fromJson(
          {
            id: "bc3",
            name: "Test Project",
            catalog: { schemaVersion: 0 },
          },
          authdCtxMgr.context
        );
        const editor = chk.toEditor();
        editor.name = "new name";
        const p = await chk.fromEditor(editor);
        expect(p.name).toEqual("new name");
        expect(saveSpy).toHaveBeenCalledTimes(1);
      });
      it("creation", async () => {
        const createSpy = spyOn(editModule, "createProject").and.callFake(
          (e: IHubProject) => Promise.resolve(e)
        );
        const accessSpy = spyOn(HubProject.prototype, "setAccess").and.callFake(
          () => Promise.resolve()
        );
        const chk = HubProject.fromJson(
          {
            name: "Test Project",
            catalog: { schemaVersion: 0 },
          },
          authdCtxMgr.context
        );
        const editor = chk.toEditor();
        editor.name = "new name";
        editor.access = "public";
        // remove props just to flex conditions
        delete editor.groups;
        const p = await chk.fromEditor(editor);
        expect(p.name).toEqual("new name");
        expect(createSpy).toHaveBeenCalledTimes(1);
        expect(accessSpy).toHaveBeenCalledTimes(1);
      });
      it("create and share to groups", async () => {
        const createSpy = spyOn(editModule, "createProject").and.callFake(
          (e: IHubProject) => Promise.resolve(e)
        );
        spyOn(HubProject.prototype, "setAccess").and.callFake(() =>
          Promise.resolve()
        );
        const shareSpy = spyOn(
          HubProject.prototype,
          "shareWithGroup"
        ).and.callFake(() => Promise.resolve());
        const chk = HubProject.fromJson(
          {
            name: "Test Project",
            catalog: { schemaVersion: 0 },
          },
          authdCtxMgr.context
        );
        const editor = chk.toEditor();
        editor.name = "new name";
        editor.access = "public";
        editor.groups = ["00c"];
        const p = await chk.fromEditor(editor);
        expect(p.name).toEqual("new name");
        expect(createSpy).toHaveBeenCalledTimes(1);
        expect(shareSpy).toHaveBeenCalledTimes(1);
        expect(shareSpy).toHaveBeenCalledWith("00c");
      });
      it("add featured image", async () => {
        // spy on HubProject.save
        const saveSpy = spyOn(HubProject.prototype, "save").and.callFake(
          (e: IHubProject) => Promise.resolve(e)
        );
        const addFISpy = spyOn(
          HubProject.prototype,
          "setFeaturedImage"
        ).and.callFake(() => Promise.resolve());
        const chk = HubProject.fromJson(
          {
            id: "bc3",
            name: "Test Project",
            catalog: { schemaVersion: 0 },
          },
          authdCtxMgr.context
        );
        const editor = chk.toEditor();
        editor.name = "new name";
        editor.view.featuredImage = {
          blob: "fake-for-test",
        };
        const p = await chk.fromEditor(editor);
        expect(p.name).toEqual("new name");
        expect(saveSpy).toHaveBeenCalledTimes(1);
        expect(addFISpy).toHaveBeenCalledTimes(1);
        expect(addFISpy).toHaveBeenCalledWith("fake-for-test");
      });
      it("clear featured image", async () => {
        // spy on HubProject.save
        const saveSpy = spyOn(HubProject.prototype, "save").and.callFake(
          (e: IHubProject) => Promise.resolve(e)
        );
        const clearFISpy = spyOn(
          HubProject.prototype,
          "clearFeaturedImage"
        ).and.callFake(() => Promise.resolve());
        const chk = HubProject.fromJson(
          {
            id: "bc3",
            name: "Test Project",
            catalog: { schemaVersion: 0 },
          },
          authdCtxMgr.context
        );
        const editor = chk.toEditor();
        editor.name = "new name";
        editor.view.featuredImage = {};
        const p = await chk.fromEditor(editor);
        expect(p.name).toEqual("new name");
        expect(saveSpy).toHaveBeenCalledTimes(1);
        expect(clearFISpy).toHaveBeenCalledTimes(1);
      });
    });
  });
});
