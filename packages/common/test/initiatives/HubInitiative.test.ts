import * as PortalModule from "@esri/arcgis-rest-portal";
import { IHubInitiative, IResolvedMetric, getProp } from "../../src";
import { Catalog } from "../../src/search";
import { ArcGISContextManager } from "../../src/ArcGISContextManager";
import { HubInitiative } from "../../src/initiatives/HubInitiative";
import { MOCK_AUTH } from "../mocks/mock-auth";
import * as HubInitiativesModule from "../../src/initiatives/HubInitiatives";
import * as ResolveMetricModule from "../../src/metrics/resolveMetric";
import * as viewModule from "../../src/initiatives/view";
import * as EditConfigModule from "../../src/core/schemas/getEditorConfig";
import * as EnrichEntityModule from "../../src/core/enrichEntity";
import { HubItemEntity } from "../../src/core/HubItemEntity";
import { initContextManager } from "../templates/fixtures";

describe("HubInitiative Class:", () => {
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

  describe("ctor:", () => {
    it("loads from minimal json", () => {
      const createSpy = spyOn(HubInitiativesModule, "createInitiative");
      const chk = HubInitiative.fromJson(
        { name: "Test Initiative" },
        authdCtxMgr.context
      );

      expect(createSpy).not.toHaveBeenCalled();
      expect(chk.toJson().name).toEqual("Test Initiative");
      // adds empty permissions and catalog
      const json = chk.toJson();
      expect(json.permissions).toEqual([]);
      expect(json.catalog).toEqual({ schemaVersion: 0 });
    });
    it("loads based on identifier", async () => {
      const fetchSpy = spyOn(
        HubInitiativesModule,
        "fetchInitiative"
      ).and.callFake((id: string) => {
        return Promise.resolve({
          id,
          name: "Test Initiative",
        });
      });

      const chk = await HubInitiative.fetch("3ef", authdCtxMgr.context);
      expect(fetchSpy).toHaveBeenCalledTimes(1);
      expect(chk.toJson().id).toBe("3ef");
      expect(chk.toJson().name).toBe("Test Initiative");
    });

    it("handle load missing Initiatives", async () => {
      const fetchSpy = spyOn(
        HubInitiativesModule,
        "fetchInitiative"
      ).and.callFake((id: string) => {
        const err = new Error(
          "CONT_0001: Item does not exist or is inaccessible."
        );
        return Promise.reject(err);
      });
      try {
        await HubInitiative.fetch("3ef", authdCtxMgr.context);
      } catch (ex) {
        expect(fetchSpy).toHaveBeenCalledTimes(1);
        expect((ex as any).message).toBe("Initiative not found.");
      }
    });

    it("handle load errors", async () => {
      const fetchSpy = spyOn(
        HubInitiativesModule,
        "fetchInitiative"
      ).and.callFake((id: string) => {
        const err = new Error("ZOMG!");
        return Promise.reject(err);
      });
      try {
        await HubInitiative.fetch("3ef", authdCtxMgr.context);
      } catch (ex) {
        expect(fetchSpy).toHaveBeenCalledTimes(1);
        expect((ex as any).message).toBe("ZOMG!");
      }
    });
  });

  it("save call createInitiative if object does not have an id", async () => {
    const createSpy = spyOn(
      HubInitiativesModule,
      "createInitiative"
    ).and.callFake((p: IHubInitiative) => {
      return Promise.resolve(p);
    });
    const chk = await HubInitiative.fromJson(
      { name: "Test Initiative" },
      authdCtxMgr.context
    );
    await chk.save();
    expect(createSpy).toHaveBeenCalledTimes(1);
    expect(chk.toJson().name).toEqual("Test Initiative");
  });
  it("create saves the instance if passed true", async () => {
    const createSpy = spyOn(
      HubInitiativesModule,
      "createInitiative"
    ).and.callFake((p: IHubInitiative) => {
      p.id = "3ef";
      return Promise.resolve(p);
    });
    const chk = await HubInitiative.create(
      { name: "Test Initiative" },
      authdCtxMgr.context,
      true
    );

    expect(createSpy).toHaveBeenCalledTimes(1);
    expect(chk.toJson().name).toEqual("Test Initiative");
  });
  it("create does not save by default", async () => {
    const createSpy = spyOn(HubInitiativesModule, "createInitiative");
    const chk = await HubInitiative.create(
      { name: "Test Initiative" },
      authdCtxMgr.context
    );

    expect(createSpy).not.toHaveBeenCalled();
    expect(chk.toJson().name).toEqual("Test Initiative");
  });

  it("update applies partial chagnes to internal state", () => {
    const chk = HubInitiative.fromJson(
      { name: "Test Initiative", catalog: { schemaVersion: 0 } },
      authdCtxMgr.context
    );
    chk.update({
      name: "Test Initiative 2",
      permissions: [
        {
          permission: "hub:project:create",
          collaborationType: "group",
          collaborationId: "3ef",
        },
      ],
      catalog: { schemaVersion: 2 },
    });
    expect(chk.toJson().name).toEqual("Test Initiative 2");
    expect(chk.toJson().catalog).toEqual({ schemaVersion: 2 });

    chk.update({ tags: ["one", "two"] });
    expect(chk.toJson().tags).toEqual(["one", "two"]);
  });

  it("save updates if object has id", async () => {
    const updateSpy = spyOn(
      HubInitiativesModule,
      "updateInitiative"
    ).and.callFake((p: IHubInitiative) => {
      return Promise.resolve(p);
    });
    const chk = HubInitiative.fromJson(
      {
        id: "bc3",
        name: "Test Initiative",
        catalog: { schemaVersion: 0 },
      },
      authdCtxMgr.context
    );
    await chk.save();
    expect(updateSpy).toHaveBeenCalledTimes(1);
  });

  it("delete", async () => {
    const deleteSpy = spyOn(
      HubInitiativesModule,
      "deleteInitiative"
    ).and.callFake(() => {
      return Promise.resolve();
    });
    const chk = HubInitiative.fromJson(
      { name: "Test Initiative" },
      authdCtxMgr.context
    );
    await chk.delete();
    expect(deleteSpy).toHaveBeenCalledTimes(1);
    // all fns should now throw an error
    expect(() => {
      chk.toJson();
    }).toThrowError("Entity is already destroyed.");

    expect(() => {
      chk.update({ name: "Test Initiative 2" } as IHubInitiative);
    }).toThrowError("HubInitiative is already destroyed.");

    // async calls
    try {
      await chk.delete();
    } catch (e) {
      expect((e as any).message).toEqual("HubInitiative is already destroyed.");
    }

    try {
      await chk.save();
    } catch (e) {
      expect((e as any).message).toEqual("HubInitiative is already destroyed.");
    }
  });

  it("internal instance accessors", () => {
    const chk = HubInitiative.fromJson(
      { name: "Test Initiative", catalog: { schemaVersion: 0 } },
      authdCtxMgr.context
    );

    expect(chk.catalog instanceof Catalog).toBeTruthy();
  });

  it("setting catalog updates catalog instance", () => {
    const chk = HubInitiative.fromJson(
      { name: "Test Initiative", catalog: { schemaVersion: 0 } },
      authdCtxMgr.context
    );
    chk.update({ catalog: { schemaVersion: 2 } });
    expect(chk.toJson().catalog).toEqual({ schemaVersion: 2 });
    expect(chk.catalog.schemaVersion).toEqual(2);
  });

  it("convertToCardModel: delegates to the initiativeToCardModel util", async () => {
    const spy = spyOn(viewModule, "initiativeToCardModel");

    const chk = await HubInitiative.fromJson(
      { name: "Test Initiative" },
      authdCtxMgr.context
    );
    await chk.convertToCardModel();

    expect(spy).toHaveBeenCalledTimes(1);
  });

  describe("resolveMetrics:", () => {
    it("throws if requested metric is not found", async () => {
      const chk = HubInitiative.fromJson(
        {
          name: "Test Initiative",
        },
        authdCtxMgr.context
      );
      try {
        await chk.resolveMetric("initiativeBudget_00c");
      } catch (e) {
        expect((e as any).message).toEqual(
          "Metric initiativeBudget_00c not found."
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
      const chk = HubInitiative.fromJson(
        {
          name: "Test Initiative",
          metrics: [
            {
              id: "initiativeBudget_00c",
              name: "Initiative Budget",
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

      const result = await chk.resolveMetric("initiativeBudget_00c");
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
      const chk = HubInitiative.fromJson(
        {
          id: "bc3",
          name: "Test Entity",
        },
        authdCtxMgr.context
      );
      const result = await chk.getEditorConfig(
        "i18n.Scope",
        "hub:initiative:edit"
      );
      expect(result).toEqual({ fake: "config" } as any);
      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveBeenCalledWith(
        "i18n.Scope",
        "hub:initiative:edit",
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
        const chk = HubInitiative.fromJson({ id: "bc3" }, authdCtxMgr.context);
        await chk.toEditor({}, ["someEnrichment AS _someEnrichment"]);

        expect(enrichEntitySpy).toHaveBeenCalledTimes(1);
      });
      it("converts entity to correct structure", async () => {
        const chk = HubInitiative.fromJson(
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
              privileges: ["portal:user:shareToGroup"],
            },
          });
          projectInstance = HubInitiative.fromJson({}, _authdCtxMgr.context);
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
        updateSpy = spyOn(
          HubInitiativesModule,
          "updateInitiative"
        ).and.callFake((p: IHubInitiative) => {
          return Promise.resolve(p);
        });
        createSpy = spyOn(
          HubInitiativesModule,
          "createInitiative"
        ).and.callFake((e: any) => {
          e.id = "3ef";
          return Promise.resolve(e);
        });
      });
      it("handles simple prop change", async () => {
        const chk = HubInitiative.fromJson(
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
        const chk = HubInitiative.fromJson(
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
        const chk = HubInitiative.fromJson(
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
        const chk = HubInitiative.fromJson(
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
      it("handles setting featured image", async () => {
        const chk = HubInitiative.fromJson(
          {
            id: "bc3",
            name: "Test Entity",
          },
          authdCtxMgr.context
        );
        const editor = await chk.toEditor();
        editor.view = {
          featuredImage: {
            blob: "some blob",
            filename: "some-featuredImage.png",
          },
        };
        const setFeaturedImageSpy = spyOn(
          chk,
          "setFeaturedImage"
        ).and.returnValue(Promise.resolve());
        await chk.fromEditor(editor);
        expect(updateSpy).toHaveBeenCalledTimes(1);
        expect(createSpy).not.toHaveBeenCalled();
        expect(setFeaturedImageSpy).toHaveBeenCalledTimes(1);
        expect(setFeaturedImageSpy).toHaveBeenCalledWith("some blob");
      });
      it("handles clearing featured image", async () => {
        const chk = HubInitiative.fromJson(
          {
            id: "bc3",
            name: "Test Entity",
          },
          authdCtxMgr.context
        );
        const editor = await chk.toEditor();
        editor.view = {
          featuredImage: {},
        };
        const clearFeaturedImageSpy = spyOn(
          chk,
          "clearFeaturedImage"
        ).and.returnValue(Promise.resolve());
        await chk.fromEditor(editor);
        expect(updateSpy).toHaveBeenCalledTimes(1);
        expect(createSpy).not.toHaveBeenCalled();
        expect(clearFeaturedImageSpy).toHaveBeenCalledTimes(1);
      });
      it("sets access on create", async () => {
        const chk = HubInitiative.fromJson(
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
        const chk = HubInitiative.fromJson(
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
    });
  });
});
