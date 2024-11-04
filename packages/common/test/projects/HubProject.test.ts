import * as PortalModule from "@esri/arcgis-rest-portal";
import { IHubProject, IResolvedMetric, getProp, mergeObjects } from "../../src";
import { Catalog } from "../../src";
import { ArcGISContextManager } from "../../src/ArcGISContextManager";
import { HubProject } from "../../src/projects/HubProject";
import { MOCK_AUTH } from "../mocks/mock-auth";
import * as editModule from "../../src/projects/edit";
import * as fetchModule from "../../src/projects/fetch";
import * as viewModule from "../../src/projects/view";
import * as EditConfigModule from "../../src/core/schemas/getEditorConfig";
import * as ResolveMetricModule from "../../src/metrics/resolveMetric";
import { HubItemEntity } from "../../src/core/HubItemEntity";
import * as EnrichEntityModule from "../../src/core/enrichEntity";
import * as utils from "../../src/util";
import * as upsertResourceModule from "../../src/resources/upsertResource";
import * as doesResourceExistModule from "../../src/resources/doesResourceExist";
import * as removeResourceModule from "../../src/resources/removeResource";

const initContextManager = async (opts = {}) => {
  const defaults = {
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
  };
  return await ArcGISContextManager.create(
    mergeObjects(opts, defaults, ["currentUser"])
  );
};

describe("HubProject Class:", () => {
  let authdCtxMgr: ArcGISContextManager;
  let unauthdCtxMgr: ArcGISContextManager;
  beforeEach(async () => {
    unauthdCtxMgr = await ArcGISContextManager.create();
    // When we pass in all this information, the context
    // manager will not try to fetch anything, so no need
    // to mock those calls
    authdCtxMgr = await initContextManager();
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
    it("getEditorConfig delegates to helper", async () => {
      const spy = spyOn(EditConfigModule, "getEditorConfig").and.callFake(
        () => {
          return Promise.resolve({ fake: "config" });
        }
      );
      const chk = HubProject.fromJson(
        {
          id: "bc3",
          name: "Test Entity",
        },
        authdCtxMgr.context
      );
      const result = await chk.getEditorConfig(
        "i18n.Scope",
        "hub:project:edit"
      );
      expect(result).toEqual({ fake: "config" } as any);
      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveBeenCalledWith(
        "i18n.Scope",
        "hub:project:edit",
        chk.toJson(),
        authdCtxMgr.context
      );
    });

    describe("toEditor:", () => {
      it("optionally enriches the entity", async () => {
        const enrichEntitySpy = spyOn(
          EnrichEntityModule,
          "enrichEntity"
        ).and.returnValue(Promise.resolve({}));
        const chk = HubProject.fromJson({ id: "bc3" }, authdCtxMgr.context);
        await chk.toEditor({}, ["someEnrichment AS _someEnrichment"]);

        expect(enrichEntitySpy).toHaveBeenCalledTimes(1);
      });
      it("toEditor converts entity to correct structure", async () => {
        const chk = HubProject.fromJson(
          {
            id: "bc3",
            name: "Test Entity",
            thumbnailUrl: "https://myserver.com/thumbnail.png",
          },
          authdCtxMgr.context
        );
        const result = await chk.toEditor();
        // NOTE: If additional transforms are added in the class they should have tests here
        expect(result.id).toEqual("bc3");
        expect(result.name).toEqual("Test Entity");
        expect(result.thumbnailUrl).toEqual(
          "https://myserver.com/thumbnail.png"
        );
        expect(result._groups).toEqual([]);
      });
      it("toEditor gets correct metric and metric display", async () => {
        const chk = HubProject.fromJson(
          {
            id: "bc3",
            name: "Test Entity",
            thumbnailUrl: "https://myserver.com/thumbnail.png",
            metrics: [
              {
                id: "metric123",
                source: {
                  type: "static-value",
                  value: "525,600",
                },
              },
              {
                id: "metric456",
                source: {
                  type: "static-value",
                  value: "wrong metric",
                },
              },
            ],
            view: {
              metricDisplays: [
                {
                  metricId: "metric123",
                  displayType: "stat-card",
                  cardTitle: "Right metric",
                },
                {
                  metricId: "metric456",
                  displayType: "stat-card",
                  cardTitle: "Wrong metric",
                },
              ],
            },
          },
          authdCtxMgr.context
        );
        const result = await chk.toEditor({ metricId: "metric123" });
      });
    });

    describe("fromEditor:", () => {
      let updateSpy: jasmine.Spy;
      let createSpy: jasmine.Spy;
      beforeEach(() => {
        updateSpy = spyOn(editModule, "updateProject").and.callFake(
          (p: IHubProject) => {
            return Promise.resolve(p);
          }
        );
        createSpy = spyOn(editModule, "createProject").and.callFake(
          (e: any) => {
            e.id = "3ef";
            return Promise.resolve(e);
          }
        );
      });
      it("handles setting featuredImage", async () => {
        const chk = HubProject.fromJson(
          {
            id: "bc3",
            name: "Test Entity",
            thumbnailUrl: "https://myserver.com/thumbnail.png",
          },
          authdCtxMgr.context
        );
        const editorContext = { metricId: "metric123" };
        const editor = await chk.toEditor();
        editor.view = {
          featuredImage: {
            blob: "fake blob",
            filename: "thumbnail.png",
          },
        };
        const spy = spyOn(
          upsertResourceModule,
          "upsertResource"
        ).and.returnValue(
          Promise.resolve("https://blah.com/some-featuredImage.png")
        );
        await chk.fromEditor(editor);
        expect(updateSpy).toHaveBeenCalledTimes(1);
        expect(createSpy).not.toHaveBeenCalled();
        expect(spy).toHaveBeenCalledTimes(1);
      });
      it("handles setting featuredImage and clearing prior image", async () => {
        const chk = HubProject.fromJson(
          {
            id: "bc3",
            name: "Test Entity",
            thumbnailUrl: "https://myserver.com/thumbnail.png",
            view: {
              featuredImageUrl: "https://myserver.com/featuredImage.png",
            },
          },
          authdCtxMgr.context
        );
        const editorContext = { metricId: "metric123" };
        const editor = await chk.toEditor();
        editor.view = {
          ...editor.view,
          featuredImage: {
            blob: "fake blob",
            filename: "thumbnail.png",
          },
        };
        const spy = spyOn(
          upsertResourceModule,
          "upsertResource"
        ).and.returnValue(
          Promise.resolve("https://blah.com/some-featuredImage.png")
        );
        await chk.fromEditor(editor);
        expect(updateSpy).toHaveBeenCalledTimes(1);
        expect(createSpy).not.toHaveBeenCalled();
        expect(spy).toHaveBeenCalledTimes(1);
      });
      it("handles clearing featuredImage", async () => {
        const chk = HubProject.fromJson(
          {
            id: "bc3",
            name: "Test Entity",
            thumbnailUrl: "https://myserver.com/thumbnail.png",
          },
          authdCtxMgr.context
        );
        const editor = await chk.toEditor();
        editor.view = {
          featuredImage: {}, // Will clear b/c .blob is not defined
        };
        const spy = spyOn(
          doesResourceExistModule,
          "doesResourceExist"
        ).and.returnValue(Promise.resolve(true));
        const removeResourceSpy = spyOn(
          removeResourceModule,
          "removeResource"
        ).and.returnValue(Promise.resolve());
        await chk.fromEditor(editor);
        expect(updateSpy).toHaveBeenCalledTimes(1);
        expect(createSpy).not.toHaveBeenCalled();
        expect(spy).toHaveBeenCalledTimes(1);
        expect(removeResourceSpy).toHaveBeenCalledTimes(1);
      });
      it("handles clearing featuredImage when resource doesnt exist", async () => {
        const chk = HubProject.fromJson(
          {
            id: "bc3",
            name: "Test Entity",
            thumbnailUrl: "https://myserver.com/thumbnail.png",
          },
          authdCtxMgr.context
        );
        const editor = await chk.toEditor();
        editor.view = {
          featuredImage: {}, // Will clear b/c .blob is not defined
        };
        const spy = spyOn(
          doesResourceExistModule,
          "doesResourceExist"
        ).and.returnValue(Promise.resolve(false));
        const removeResourceSpy = spyOn(
          removeResourceModule,
          "removeResource"
        ).and.returnValue(Promise.resolve());
        await chk.fromEditor(editor);
        expect(updateSpy).toHaveBeenCalledTimes(1);
        expect(createSpy).not.toHaveBeenCalled();
        expect(spy).toHaveBeenCalledTimes(1);
        expect(removeResourceSpy).not.toHaveBeenCalled();
      });
      it("sets access on create", async () => {
        const chk = HubProject.fromJson(
          {
            name: "Test Entity",
            thumbnailUrl: "https://myserver.com/thumbnail.png",
          },
          authdCtxMgr.context
        );
        const editor = await chk.toEditor();

        editor.access = "org";

        const accessSpy = spyOn(
          HubItemEntity.prototype,
          "setAccess"
        ).and.returnValue(Promise.resolve());

        await chk.fromEditor(editor);
        expect(createSpy).toHaveBeenCalledTimes(1);
        expect(accessSpy).toHaveBeenCalledTimes(1);
        expect(accessSpy).toHaveBeenCalledWith("org");
      });
      it("handles sharing on create", async () => {
        const chk = HubProject.fromJson(
          {
            name: "Test Entity",
            thumbnailUrl: "https://myserver.com/thumbnail.png",
          },
          authdCtxMgr.context
        );
        const editor = await chk.toEditor();
        editor._groups = ["3ef"];
        editor.access = "org";
        const accessSpy = spyOn(
          HubItemEntity.prototype,
          "setAccess"
        ).and.returnValue(Promise.resolve());

        const shareSpy = spyOn(
          HubItemEntity.prototype,
          "shareWithGroup"
        ).and.returnValue(Promise.resolve());
        await chk.fromEditor(editor);
        expect(createSpy).toHaveBeenCalledTimes(1);
        expect(accessSpy).toHaveBeenCalledTimes(1);
        expect(accessSpy).toHaveBeenCalledWith("org");
        expect(shareSpy).toHaveBeenCalledTimes(1);
        expect(shareSpy).toHaveBeenCalledWith("3ef");
      });
      it("handles simple prop change", async () => {
        const chk = HubProject.fromJson(
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
        const editor = await chk.toEditor();
        editor.name = "new name";
        delete editor._groups;
        // call fromEditor
        const result = await chk.fromEditor(editor);
        // expect the save method to have been called
        expect(saveSpy).toHaveBeenCalledTimes(1);
        // expect the name to have been updated
        expect(result.name).toEqual("new name");
      });
      it("handles thumbnail change", async () => {
        const chk = HubProject.fromJson(
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
        const editor = await chk.toEditor();
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
        const chk = HubProject.fromJson(
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
        const editor = await chk.toEditor();
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
    });
  });
});
