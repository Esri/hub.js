import {
  describe,
  it,
  expect,
  beforeEach,
  vi,
} from "vitest";
// Make portal exports spyable by returning the original module with overridden functions
vi.mock("@esri/arcgis-rest-portal", async (importOriginal) => {
  const original = await importOriginal();
  return {
    ...(original as any),
    getGroup: vi.fn(),
    updateGroup: vi.fn(),
  };
});
import * as PortalModule from "@esri/arcgis-rest-portal";
import { createMockContext } from "../mocks/mock-auth";
import { HubInitiative } from "../../src/initiatives/HubInitiative";
import { MOCK_AUTH } from "../mocks/mock-auth";
import { IHubAssociationRules } from "../../src/associations/types";
import * as HubInitiativesModule from "../../src/initiatives/HubInitiatives";
import * as ResolveMetricModule from "../../src/metrics/resolveMetric";
import * as viewModule from "../../src/initiatives/view";
import * as EditConfigModule from "../../src/core/schemas/getEditorConfig";
import * as EnrichEntityModule from "../../src/core/enrichEntity";
import * as metricToEditorModule from "../../src/metrics/metricToEditor";
import * as hubItemEntityFromEditorModule from "../../src/core/_internal/hubItemEntityFromEditor";
import {
  IHubInitiative,
  IHubInitiativeEditor,
} from "../../src/core/types/IHubInitiative";
import { Catalog } from "../../src/search/Catalog";
import { IMetric, IResolvedMetric } from "../../src/core/types/Metrics";

describe("HubInitiative Class:", () => {
  let authdCtxMgr: any;
  beforeEach(() => {
    authdCtxMgr = {
      context: createMockContext({
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
      }),
    };
  });

  describe("ctor:", () => {
    it("loads from minimal json", () => {
      const createSpy = vi.spyOn(HubInitiativesModule, "createInitiative");
      const chk = HubInitiative.fromJson(
        { name: "Test Initiative" },
        authdCtxMgr.context
      );

      expect(createSpy).not.toHaveBeenCalled();
      expect(chk.toJson().name).toEqual("Test Initiative");
      const json = chk.toJson();
      expect(json.permissions).toEqual([]);
      expect(json.catalog).toEqual({ schemaVersion: 0 });
    });
    it("loads based on identifier", async () => {
      const fetchSpy = vi
        .spyOn(HubInitiativesModule, "fetchInitiative")
        .mockImplementation((id: string) => {
          return Promise.resolve({ id, name: "Test Initiative" });
        });

      const chk = await HubInitiative.fetch("3ef", authdCtxMgr.context);
      expect(fetchSpy).toHaveBeenCalledTimes(1);
      expect(chk.toJson().id).toBe("3ef");
      expect(chk.toJson().name).toBe("Test Initiative");
    });

    it("handle load missing Initiatives", async () => {
      const fetchSpy = vi
        .spyOn(HubInitiativesModule, "fetchInitiative")
        .mockImplementation(() => {
          const err = new Error(
            "CONT_0001: Item does not exist or is inaccessible."
          );
          return Promise.reject(err);
        });
      try {
        await HubInitiative.fetch("3ef", authdCtxMgr.context);
      } catch (ex) {
        const error = ex as { message?: string };
        expect(fetchSpy).toHaveBeenCalledTimes(1);
        expect(error.message).toBe("Initiative not found.");
      }
    });

    it("handle load errors", async () => {
      const fetchSpy = vi
        .spyOn(HubInitiativesModule, "fetchInitiative")
        .mockImplementation(() => {
          const err = new Error("ZOMG!");
          return Promise.reject(err);
        });
      try {
        await HubInitiative.fetch("3ef", authdCtxMgr.context);
      } catch (ex) {
        const error = ex as { message?: string };
        expect(fetchSpy).toHaveBeenCalledTimes(1);
        expect(error.message).toBe("ZOMG!");
      }
    });
  });

  it("save call createInitiative if object does not have an id", async () => {
    const createSpy = vi
      .spyOn(HubInitiativesModule, "createInitiative")
      .mockImplementation((p: IHubInitiative) => {
        return Promise.resolve(p);
      });
    const chk = HubInitiative.fromJson(
      { name: "Test Initiative" },
      authdCtxMgr.context
    );
    await chk.save();
    expect(createSpy).toHaveBeenCalledTimes(1);
    expect(chk.toJson().name).toEqual("Test Initiative");
  });
  it("create saves the instance if passed true", async () => {
    const createSpy = vi
      .spyOn(HubInitiativesModule, "createInitiative")
      .mockImplementation((p: IHubInitiative) => {
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
    const createSpy = vi.spyOn(HubInitiativesModule, "createInitiative");
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
    const updateSpy = vi
      .spyOn(HubInitiativesModule, "updateInitiative")
      .mockImplementation((p: IHubInitiative) => {
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
    const deleteSpy = vi
      .spyOn(HubInitiativesModule, "deleteInitiative")
      .mockImplementation(() => {
        return Promise.resolve();
      });
    const chk = HubInitiative.fromJson(
      { name: "Test Initiative" },
      authdCtxMgr.context
    );
    await chk.delete();
    expect(deleteSpy).toHaveBeenCalledTimes(1);
    expect(() => {
      chk.toJson();
    }).toThrowError("Entity is already destroyed.");

    expect(() => {
      chk.update({ name: "Test Initiative 2" } as IHubInitiative);
    }).toThrowError("HubInitiative is already destroyed.");

    try {
      await chk.delete();
    } catch (e) {
      const error = e as { message?: string };
      expect(error.message).toEqual("HubInitiative is already destroyed.");
    }

    try {
      await chk.save();
    } catch (e) {
      const error = e as { message?: string };
      expect(error.message).toEqual("HubInitiative is already destroyed.");
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

  it("convertToCardModel: delegates to the initiativeToCardModel util", () => {
    const spy = vi
      .spyOn(viewModule, "initiativeToCardModel")
      .mockImplementation(() => ({} as any));

    const chk = HubInitiative.fromJson(
      { name: "Test Initiative" },
      authdCtxMgr.context
    );
    chk.convertToCardModel();

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
        const error = e as { message?: string };
        expect(error.message).toEqual("Metric initiativeBudget_00c not found.");
      }
    });

    it("delegates to resolveMetric", async () => {
      const spy = vi
        .spyOn(ResolveMetricModule, "resolveMetric")
        .mockImplementation(() => {
          return Promise.resolve({
            features: [],
            generatedAt: 1683060547818,
          } as IResolvedMetric);
        });
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
      const spy = vi
        .spyOn(EditConfigModule, "getEditorConfig")
        .mockImplementation(() => {
          return Promise.resolve({ fake: "config" });
        });
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
        const enrichEntitySpy = vi
          .spyOn(EnrichEntityModule, "enrichEntity")
          .mockResolvedValue({} as any);
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
            associations: {
              groupId: "00123",
              rules: {} as IHubAssociationRules,
            },
          },
          authdCtxMgr.context
        );
        vi.spyOn(PortalModule, "getGroup").mockResolvedValue({
          id: "00123",
          access: "public",
        } as unknown as PortalModule.IGroup);
        const result = await chk.toEditor();
        expect(result.id).toEqual("bc3");
        expect(result.name).toEqual("Test Entity");
        expect(result.thumbnailUrl).toEqual(
          "https://myserver.com/thumbnail.png"
        );
        expect(result._associations).toEqual({
          groupAccess: "public",
          membershipAccess: "anyone",
        } as any);
      });
      describe("metrics", () => {
        it("appends the relevant metric config to the editor object", async () => {
          const mockMetric = {
            type: "static",
            value: "525,600",
            cardTitle: "Right metric",
          };
          const metricToEditorSpy = vi
            .spyOn(metricToEditorModule, "metricToEditor")
            .mockReturnValue(mockMetric as any);
          const mockInitiative = {
            id: "bc3",
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
            ] as IMetric[],
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
          };
          const chk = HubInitiative.fromJson(
            mockInitiative,
            authdCtxMgr.context
          );
          const result = await chk.toEditor({ metricId: "metric123" });

          expect(metricToEditorSpy).toHaveBeenCalledTimes(1);
          expect(metricToEditorSpy).toHaveBeenCalledWith(
            mockInitiative.metrics[0],
            mockInitiative.view.metricDisplays[0]
          );
          expect(result._metric).toEqual(mockMetric);
        });
      });
    });

    describe("fromEditor:", () => {
      let hubItemEntityFromEditorSpy: any;
      let chk: HubInitiative;

      beforeEach(() => {
        chk = HubInitiative.fromJson(
          {
            id: "bc3",
            name: "Test Entity",
            thumbnailUrl: "https://myserver.com/thumbnail.png",
          },
          authdCtxMgr.context
        );

        hubItemEntityFromEditorSpy = vi.spyOn(
          hubItemEntityFromEditorModule,
          "hubItemEntityFromEditor"
        );
        (chk as any).save = vi.fn().mockResolvedValue(undefined as any);
      });
      it("delegates to the hubItemEntityFromEditor util to handle shared logic", async () => {
        const editor = await chk.toEditor();
        await chk.fromEditor(editor);
        expect(hubItemEntityFromEditorSpy).toHaveBeenCalledTimes(1);
      });
      it("handles associations", async () => {
        const editor = {
          _associations: {
            groupAccess: "public",
            membershipAccess: "organization",
          },
          associations: {
            groupId: "00123",
          },
        } as unknown as IHubInitiativeEditor;

        const updateGroupSpy = PortalModule.updateGroup as any;
        updateGroupSpy.mockResolvedValue(undefined as any);

        const res = await chk.fromEditor(editor);

        expect(updateGroupSpy.mock.calls[0][0].group.id).toBe("00123");
        expect(updateGroupSpy.mock.calls[1][0].group.membershipAccess).toBe(
          "org"
        );
        expect(updateGroupSpy.mock.calls.length).toBe(2);
        expect(res._associations).toBeUndefined();
      });
      it("handles an empty associations object", async () => {
        const editor = {
          _associations: {},
          associations: {
            groupId: "00123",
          },
        } as unknown as IHubInitiativeEditor;

        const res = await chk.fromEditor(editor);

        expect(res.groupAccess).toBeUndefined();
        expect(res.membershipAccess).toBeUndefined();
      });
      it("handles no associations object", async () => {
        const editor = {
          associations: {
            groupId: "00123",
          },
        } as unknown as IHubInitiativeEditor;

        const res = await chk.fromEditor(editor);

        expect(res.groupAccess).toBeUndefined();
        expect(res.membershipAccess).toBeUndefined();
      });
    });
  });
});
