import * as PortalModule from "@esri/arcgis-rest-portal";
import { IHubProject, IResolvedMetric, getProp, mergeObjects } from "../../src";
import { MetricVisibility } from "../../src/core/types/Metrics";
import { Catalog } from "../../src/search";
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
import * as ClearSetFeaturedImageModule from "../../src/items/clearSetFeaturedImage";

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
      describe('auto-populating "shareWith" groups', () => {
        let projectInstance: any;
        beforeEach(async () => {
          const _authdCtxMgr = await initContextManager({
            currentUser: {
              groups: [
                { id: "00a", isViewOnly: false },
                { id: "00b", isViewOnly: true, memberType: "admin" },
                { id: "00d", isViewOnly: false },
              ] as PortalModule.IGroup[],
            },
          });
          projectInstance = HubProject.fromJson({}, _authdCtxMgr.context);
        });
        it('handles auto-populating "shareWith" groups that the current user can share to', async () => {
          const result = await projectInstance.toEditor({
            contentGroupId: "00a",
            collaborationGroupId: "00b",
          });
          expect(result._groups).toEqual(["00a", "00b"]);
        });
        it('does not auto-populate "shareWith" gruops that the current user cannot share to', async () => {
          const result = await projectInstance.toEditor({
            contentGroupId: "00e",
            collaborationGroupId: "00f",
          });
          expect(result._groups).toEqual([]);
        });
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
          ClearSetFeaturedImageModule,
          "clearSetFeaturedImage"
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
          ClearSetFeaturedImageModule,
          "clearSetFeaturedImage"
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
          ClearSetFeaturedImageModule,
          "clearSetFeaturedImage"
        ).and.returnValue(Promise.resolve(null));
        await chk.fromEditor(editor);
        expect(updateSpy).toHaveBeenCalledTimes(1);
        expect(createSpy).not.toHaveBeenCalled();
        expect(spy).toHaveBeenCalledTimes(1);
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
      it("handles extent from location", async () => {
        const chk = HubProject.fromJson(
          {
            id: "bc3",
            name: "Test Entity",
            thumbnailUrl: "https://myserver.com/thumbnail.png",
            extent: [
              [-1, -1],
              [1, 1],
            ],
          },
          authdCtxMgr.context
        );
        // spy on the instance .save method and retrn void
        const saveSpy = spyOn(chk, "save").and.returnValue(Promise.resolve());
        // make changes to the editor
        const editor = await chk.toEditor();
        editor.name = "new name";
        editor.location = {
          extent: [
            [-2, -2],
            [2, 2],
          ],
          type: "custom",
        };
        // call fromEditor
        const result = await chk.fromEditor(editor);
        // expect the save method to have been called
        expect(saveSpy).toHaveBeenCalledTimes(1);
        expect(result.extent).toEqual([
          [-2, -2],
          [2, 2],
        ]);
      });
      it("handles setting new metric with no editorContext", async () => {
        const chk = HubProject.fromJson(
          {
            id: "bc3",
            name: "Test Entity",
            type: "Hub Project",
            metrics: [],
            view: {
              metricDisplays: [],
            },
          },
          authdCtxMgr.context
        );

        spyOn(utils, "createId").and.returnValue("metric1fakeid");

        const editor = await chk.toEditor();
        editor._metric = {
          type: "static",
          value: "123",
          cardTitle: "metric1",
          displayType: "stat-card",
        };
        const result = await chk.fromEditor(editor);
        expect(getProp(result, "metrics")).toEqual([
          {
            id: "metric1fakeid",
            source: {
              type: "static-value",
              value: "123",
              valueType: undefined,
            },
            name: "metric1",
            entityInfo: {
              id: undefined,
              name: undefined,
              type: undefined,
            },
          },
        ]);
        expect(getProp(result, "view.metricDisplays")).toEqual([
          {
            cardTitle: "metric1",
            type: "static",
            displayType: "stat-card",
            metricId: "metric1fakeid",
            fieldType: undefined,
            statistic: undefined,
            sourceLink: undefined,
            sourceTitle: undefined,
            allowLink: undefined,
            visibility: MetricVisibility.hidden,
            itemId: undefined,
            expressionSet: undefined,
            allowExpressionSet: undefined,
          },
        ]);
      });
      it("handles setting new metric with empty editorContext", async () => {
        const chk = HubProject.fromJson(
          {
            id: "bc3",
            name: "Test Entity",
            type: "Hub Project",
            metrics: [],
            view: {
              metricDisplays: [],
            },
          },
          authdCtxMgr.context
        );

        spyOn(utils, "createId").and.returnValue("metric1fakeid");

        const editor = await chk.toEditor();
        editor._metric = {
          type: "static",
          value: "123",
          cardTitle: "metric1",
          metricId: "c123",
          displayType: "stat-card",
        };
        const result = await chk.fromEditor(editor, {});
        expect(getProp(result, "metrics")).toEqual([
          {
            id: "metric1fakeid",
            source: {
              type: "static-value",
              value: "123",
              valueType: undefined,
            },
            name: "metric1",
            entityInfo: {
              id: undefined,
              name: undefined,
              type: undefined,
            },
          },
        ]);
        expect(getProp(result, "view.metricDisplays")).toEqual([
          {
            cardTitle: "metric1",
            type: "static",
            displayType: "stat-card",
            metricId: "metric1fakeid",
            fieldType: undefined,
            statistic: undefined,
            sourceLink: undefined,
            sourceTitle: undefined,
            allowLink: undefined,
            itemId: undefined,
            expressionSet: undefined,
            allowExpressionSet: undefined,
            visibility: MetricVisibility.hidden,
          },
        ]);
      });
      it("handles setting existing metric", async () => {
        const chk = HubProject.fromJson(
          {
            id: "bc3",
            name: "Test Entity",
            type: "Hub Project",
            metrics: [
              {
                id: "metric1",
                source: {
                  type: "static-value",
                  value: "123",
                },
              },
            ],
            view: {
              metricDisplays: [
                {
                  cardTitle: "metric1",
                  displayType: "stat-card",
                  metricId: "metric1",
                  visibility: MetricVisibility.hidden,
                },
              ],
            },
          },
          authdCtxMgr.context
        );

        const editor = await chk.toEditor();
        editor._metric = {
          trailingText: "...",
          type: "static",
          value: "123",
          cardTitle: "metric1",
          metricId: "metric1",
          displayType: "stat-card",
        };
        const result = await chk.fromEditor(editor, { metricId: "metric1" });
        expect(getProp(result, "metrics")).toEqual([
          {
            id: "metric1",
            source: {
              type: "static-value",
              value: "123",
              valueType: undefined,
            },
            name: "metric1",
            entityInfo: {
              id: undefined,
              name: undefined,
              type: undefined,
            },
          },
        ]);
        expect(getProp(result, "view.metricDisplays")).toEqual([
          {
            cardTitle: "metric1",
            trailingText: "...",
            fieldType: undefined,
            statistic: undefined,
            sourceLink: undefined,
            sourceTitle: undefined,
            allowLink: undefined,
            itemId: undefined,
            expressionSet: undefined,
            allowExpressionSet: undefined,
            type: "static",
            displayType: "stat-card",
            metricId: "metric1",
            visibility: MetricVisibility.hidden,
          },
        ]);
      });
      it("handles setting metrics when metricDisplays is undefined", async () => {
        const chk = HubProject.fromJson(
          {
            id: "bc3",
            name: "Test Entity",
            type: "Hub Project",
            metrics: [
              {
                id: "metric1",
                source: {
                  type: "static-value",
                  value: "123",
                },
              },
            ],
            view: {},
          },
          authdCtxMgr.context
        );

        const editor = await chk.toEditor();
        editor._metric = {
          trailingText: "...",
          type: "static",
          value: "123",
          cardTitle: "metric1",
          metricId: "metric1",
          displayType: "stat-card",
          visibility: MetricVisibility.hidden,
        };
        const result = await chk.fromEditor(editor, { metricId: "metric1" });
        expect(getProp(result, "metrics")).toEqual([
          {
            id: "metric1",
            source: {
              type: "static-value",
              value: "123",
              valueType: undefined,
            },
            name: "metric1",
            entityInfo: {
              id: undefined,
              name: undefined,
              type: undefined,
            },
          },
        ]);
        expect(getProp(result, "view.metricDisplays")).toEqual([
          {
            cardTitle: "metric1",
            trailingText: "...",
            fieldType: undefined,
            statistic: undefined,
            sourceLink: undefined,
            sourceTitle: undefined,
            allowLink: undefined,
            type: "static",
            displayType: "stat-card",
            visibility: MetricVisibility.hidden,
            metricId: "metric1",
            itemId: undefined,
            expressionSet: undefined,
            allowExpressionSet: undefined,
          },
        ]);
      });
    });
  });
});
