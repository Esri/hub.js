import { describe, it, expect, beforeEach, vi } from "vitest";
import * as PortalModule from "@esri/arcgis-rest-portal";
import { HubProject } from "../../src/projects/HubProject";
import { MOCK_AUTH } from "../mocks/mock-auth";
import * as editModule from "../../src/projects/edit";
import * as fetchModule from "../../src/projects/fetch";
import * as viewModule from "../../src/projects/view";
import * as EditConfigModule from "../../src/core/schemas/getEditorConfig";
import * as ResolveMetricModule from "../../src/metrics/resolveMetric";
import * as EnrichEntityModule from "../../src/core/enrichEntity";
import { mergeObjects } from "../../src/objects/merge-objects";
// removed unused imports
import { Catalog } from "../../src/search/Catalog";
import { IResolvedMetric } from "../../src/core/types/Metrics";
// getProp not used in these tests

const initContext = (opts = {}): any => {
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
  return mergeObjects(opts, defaults, ["currentUser"]);
};

describe("HubProject Class:", () => {
  let ctx: any;
  beforeEach(() => {
    ctx = initContext();
  });

  describe("static methods:", () => {
    it("loads from minimal json", () => {
      const createSpy = vi.spyOn(editModule, "createProject");
      const chk = HubProject.fromJson({ name: "Test Project" }, ctx);

      expect(createSpy).not.toHaveBeenCalled();
      expect(chk.toJson().name).toEqual("Test Project");
      const json = chk.toJson();
      expect(json.permissions).toEqual([]);
      expect(json.catalog).toEqual({ schemaVersion: 0 });
    });
    it("loads based on identifier", async () => {
      const fetchSpy = vi
        .spyOn(fetchModule, "fetchProject")
        .mockResolvedValue({ id: "3ef", name: "Test Project" } as any);

      const chk = await HubProject.fetch("3ef", ctx);
      expect(fetchSpy).toHaveBeenCalledTimes(1);
      expect(chk.toJson().id).toBe("3ef");
      expect(chk.toJson().name).toBe("Test Project");
    });

    it("handle load missing projects", async () => {
      const fetchSpy = vi
        .spyOn(fetchModule, "fetchProject")
        .mockRejectedValue(
          new Error("CONT_0001: Item does not exist or is inaccessible.")
        );
      try {
        await HubProject.fetch("3ef", ctx);
      } catch (ex) {
        expect(fetchSpy).toHaveBeenCalledTimes(1);
        expect((ex as Error).message).toBe("Project not found.");
      }
    });

    it("handle load errors", async () => {
      const fetchSpy = vi
        .spyOn(fetchModule, "fetchProject")
        .mockRejectedValue(new Error("ZOMG!"));
      try {
        await HubProject.fetch("3ef", ctx);
      } catch (ex) {
        expect(fetchSpy).toHaveBeenCalledTimes(1);
        expect((ex as Error).message).toBe("ZOMG!");
      }
    });
  });

  it("convertToCardModel: delegates to the projectToCardModel util", () => {
    const spy = vi.spyOn(viewModule, "projectToCardModel");

    // ensure required fields exist so projectToCardModel doesn't call toLocaleDateString on undefined
    const prj = {
      name: "Test Project",
      createdDate: new Date(1595878748000),
      updatedDate: new Date(1595878750000),
      type: "Hub Project",
      owner: "me",
      summary: "s",
      access: "public",
    };
    const chk = HubProject.fromJson(prj as any, ctx);
    chk.convertToCardModel();

    expect(spy).toHaveBeenCalledTimes(1);
  });

  it("save call createProject if object does not have an id", async () => {
    const createSpy = vi
      .spyOn(editModule, "createProject")
      .mockResolvedValue({ name: "Test Project" } as any);
    const chk = HubProject.fromJson({ name: "Test Project" }, ctx);
    await chk.save();
    expect(createSpy).toHaveBeenCalledTimes(1);
    expect(chk.toJson().name).toEqual("Test Project");
  });

  it("create saves the instance if passed true", async () => {
    const createSpy = vi
      .spyOn(editModule as any, "createProject")
      .mockImplementation((p: any) => {
        p.id = "3ef";
        return Promise.resolve(p);
      });
    const chk = await HubProject.create({ name: "Test Project" }, ctx, true);

    expect(createSpy).toHaveBeenCalledTimes(1);
    expect(chk.toJson().name).toEqual("Test Project");
  });

  it("create does not save by default", async () => {
    const createSpy = vi.spyOn(editModule, "createProject");
    const chk = await HubProject.create({ name: "Test Project" }, ctx);

    expect(createSpy).not.toHaveBeenCalled();
    expect(chk.toJson().name).toEqual("Test Project");
  });

  it("update applies partial chagnes to internal state", () => {
    const chk = HubProject.fromJson(
      { name: "Test Project", catalog: { schemaVersion: 0 } },
      ctx
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
    const updateSpy = vi
      .spyOn(editModule as any, "updateProject")
      .mockImplementation((p: any) => Promise.resolve(p));
    const chk = HubProject.fromJson(
      { id: "bc3", name: "Test Project", catalog: { schemaVersion: 0 } },
      ctx
    );
    await chk.save();
    expect(updateSpy).toHaveBeenCalledTimes(1);
  });

  it("delete", async () => {
    const deleteSpy = vi
      .spyOn(editModule, "deleteProject")
      .mockResolvedValue(undefined as any);
    const chk = HubProject.fromJson({ name: "Test Project" }, ctx);
    await chk.delete();
    expect(deleteSpy).toHaveBeenCalledTimes(1);
    expect(() => chk.toJson()).toThrowError("Entity is already destroyed.");
    expect(() => chk.update({ name: "Test Project 2" } as any)).toThrowError(
      "HubProject is already destroyed."
    );
    try {
      await chk.delete();
    } catch (e) {
      expect((e as Error).message).toEqual("HubProject is already destroyed.");
    }
    try {
      await chk.save();
    } catch (e) {
      expect((e as Error).message).toEqual("HubProject is already destroyed.");
    }
  });

  it("internal instance accessors", () => {
    const chk = HubProject.fromJson(
      { name: "Test Project", catalog: { schemaVersion: 0 } },
      ctx
    );
    expect(chk.catalog instanceof Catalog).toBeTruthy();
  });

  it("setting catalog updates catalog instance", () => {
    const chk = HubProject.fromJson(
      { name: "Test Project", catalog: { schemaVersion: 0 } },
      ctx
    );
    chk.update({ catalog: { schemaVersion: 2 } });
    expect(chk.toJson().catalog).toEqual({ schemaVersion: 2 });
    expect(chk.catalog.schemaVersion).toEqual(2);
  });

  describe("resolveMetrics:", () => {
    it("throws if requested metric is not found", async () => {
      const chk = HubProject.fromJson({ name: "Test Project" }, ctx);
      try {
        await chk.resolveMetric("projectBudget_00c");
      } catch (e) {
        expect((e as Error).message).toEqual(
          "Metric projectBudget_00c not found."
        );
      }
    });

    it("delegates to resolveMetric", async () => {
      const spy = vi
        .spyOn(ResolveMetricModule, "resolveMetric")
        .mockResolvedValue({
          features: [],
          generatedAt: 1683060547818,
        } as IResolvedMetric);
      const chk = HubProject.fromJson(
        {
          name: "Test Project",
          metrics: [
            {
              id: "projectBudget_00c",
              name: "Project Budget",
              source: { type: "static-value", value: 100000 },
              entityInfo: {
                id: "00c",
                name: "Some Project Name",
                type: "Hub Project",
              },
            },
          ],
        },
        ctx
      );

      const result = await chk.resolveMetric("projectBudget_00c");
      expect(spy).toHaveBeenCalledTimes(1);
      expect(result).toEqual({ features: [], generatedAt: 1683060547818 });
    });
  });

  describe("IWithEditorBehavior:", () => {
    it("getEditorConfig delegates to helper", async () => {
      const spy = vi
        .spyOn(EditConfigModule, "getEditorConfig")
        .mockResolvedValue({ fake: "config" } as any);
      const chk = HubProject.fromJson({ id: "bc3", name: "Test Entity" }, ctx);
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
        ctx
      );
    });

    it("optionally enriches the entity", async () => {
      const enrichEntitySpy = vi
        .spyOn(EnrichEntityModule, "enrichEntity")
        .mockResolvedValue({} as any);
      const chk = HubProject.fromJson({ id: "bc3" }, ctx);
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
        ctx
      );
      const result = await chk.toEditor();
      expect(result.id).toEqual("bc3");
      expect(result.name).toEqual("Test Entity");
      expect(result.thumbnailUrl).toEqual("https://myserver.com/thumbnail.png");
      expect(result._groups).toEqual([]);
    });

    it("toEditor uses metric/display find when metricId provided", async () => {
      const chk = HubProject.fromJson(
        {
          id: "p1",
          name: "Test Project",
          metrics: [
            {
              id: "projectBudget_00c",
              name: "Project Budget",
              source: { type: "static-value", value: 1 },
              entityInfo: {
                id: "00c",
                name: "Some Project",
                type: "Hub Project",
              },
            },
          ],
          view: {
            metricDisplays: [
              { metricId: "projectBudget_00c", displayType: "number" },
            ],
          },
        },
        ctx
      );

      const result = await chk.toEditor({ metricId: "projectBudget_00c" });
      // ensure the metric/display lookup path was exercised and produced a metric editor
      expect(result._metric).toBeDefined();
    });

    it("fromEditor applies hubItemEntityFromEditor result and saves via createProject", async () => {
      // dynamically import and stub hubItemEntityFromEditor to keep this append-only and avoid top-level import edits
      const hubItemModule = await import(
        "../../src/core/_internal/hubItemEntityFromEditor"
      );
      const hubItemSpy = vi
        .spyOn(hubItemModule, "hubItemEntityFromEditor")
        .mockResolvedValue({ name: "FromEd" } as any);

      const createSpy = vi
        .spyOn(editModule, "createProject")
        .mockResolvedValue({ id: "new", name: "FromEd" } as any);

      const chk = HubProject.fromJson({ name: "Test Project" }, ctx);
      const res = await chk.fromEditor({ fake: "editor" } as any);

      expect(hubItemSpy).toHaveBeenCalled();
      expect(createSpy).toHaveBeenCalled();
      expect(res.name).toBe("FromEd");
    });
  });
});
