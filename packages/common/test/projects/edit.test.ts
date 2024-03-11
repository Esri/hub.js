import {
  HubEntityStatus,
  IHubProject,
  IHubProjectEditor,
  IMetric,
  IMetricDisplayConfig,
  IModel,
  cloneObject,
  createProject,
  deleteProject,
  editorToProject,
  getProp,
  updateProject,
} from "../../src";
import { GUID, PROJECT_LOCATION, PROJECT_MODEL } from "./fixtures";
import { MOCK_AUTH } from "../mocks/mock-auth";
import * as portalModule from "@esri/arcgis-rest-portal";
import * as slugUtils from "../../src/items/slugs";
import * as modelUtils from "../../src/models";
import * as editorToMetricModule from "../../src/core/schemas/internal/metrics/editorToMetric";
import * as setMetricAndDisplayModule from "../../src/core/schemas/internal/metrics/setMetricAndDisplay";
import * as utilModule from "../../src/util";

describe("project edit module:", () => {
  describe("destroyProject:", () => {
    it("deletes the item", async () => {
      const removeSpy = spyOn(portalModule, "removeItem").and.returnValue(
        Promise.resolve({ success: true })
      );

      const result = await deleteProject("3ef", {
        authentication: MOCK_AUTH,
      });
      expect(result).toBeUndefined();
      expect(removeSpy.calls.count()).toBe(1);
      expect(removeSpy.calls.argsFor(0)[0].authentication).toBe(MOCK_AUTH);
      expect(removeSpy.calls.argsFor(0)[0].id).toBe("3ef");
    });
  });

  describe("createProject:", () => {
    it("works with very limited initial structure", async () => {
      const slugSpy = spyOn(slugUtils, "getUniqueSlug").and.returnValue(
        Promise.resolve("dcdev|hello-world")
      );
      const createSpy = spyOn(modelUtils, "createModel").and.callFake(
        (m: IModel) => {
          const newModel = cloneObject(m);
          newModel.item.id = GUID;
          return Promise.resolve(newModel);
        }
      );
      const chk = await createProject(
        { name: "Hello World", orgUrlKey: "dcdev" },
        { authentication: MOCK_AUTH }
      );

      expect(chk.id).toBe(GUID);
      expect(chk.name).toBe("Hello World");
      expect(chk.typeKeywords).toEqual([
        "Hub Project",
        "slug|dcdev|hello-world",
        "status|notStarted",
        "cannotDiscuss",
      ]);
      // should ensure unique slug
      expect(slugSpy.calls.count()).toBe(1);
      expect(slugSpy.calls.argsFor(0)[0]).toEqual(
        { slug: "dcdev|hello-world" },
        "should recieve slug"
      );
      // should create the item
      expect(createSpy.calls.count()).toBe(1);
      const modelToCreate = createSpy.calls.argsFor(0)[0];
      expect(modelToCreate.item.title).toBe("Hello World");
      expect(modelToCreate.item.type).toBe("Hub Project");
      expect(modelToCreate.item.properties.slug).toBe("dcdev|hello-world");
      expect(modelToCreate.item.properties.orgUrlKey).toBe("dcdev");
    });
    it("works with more complete object", async () => {
      // Note: this covers a branch when a slug is passed in
      const slugSpy = spyOn(slugUtils, "getUniqueSlug").and.returnValue(
        Promise.resolve("dcdev|hello-world")
      );
      const createSpy = spyOn(modelUtils, "createModel").and.callFake(
        (m: IModel) => {
          const newModel = cloneObject(m);
          newModel.item.id = GUID;
          return Promise.resolve(newModel);
        }
      );
      const chk = await createProject(
        {
          name: "Hello World",
          slug: "dcdev|hello-world", // important for coverage
          description: "my desc",
          orgUrlKey: "dcdev",
          location: PROJECT_LOCATION,
          status: HubEntityStatus.inProgress,
        },
        { authentication: MOCK_AUTH }
      );
      expect(chk.id).toBe(GUID);
      expect(chk.name).toBe("Hello World");
      expect(chk.description).toBe("my desc");
      expect(chk.typeKeywords).toEqual([
        "Hub Project",
        "slug|dcdev|hello-world",
        "status|inProgress",
        "cannotDiscuss",
      ]);
      // should ensure unique slug
      expect(slugSpy.calls.count()).toBe(1);
      expect(slugSpy.calls.argsFor(0)[0]).toEqual(
        { slug: "dcdev|hello-world" },
        "should recieve slug"
      );
      // should create the item
      expect(createSpy.calls.count()).toBe(1);
      const modelToCreate = createSpy.calls.argsFor(0)[0];
      expect(modelToCreate.item.properties.slug).toBe("dcdev|hello-world");
      expect(modelToCreate.item.properties.orgUrlKey).toBe("dcdev");

      expect(chk.location).toEqual(PROJECT_LOCATION);
    });
  });

  describe("updateProject: ", () => {
    it("updates backing model", async () => {
      const slugSpy = spyOn(slugUtils, "getUniqueSlug").and.returnValue(
        Promise.resolve("dcdev-wat-blarg-1")
      );
      const getModelSpy = spyOn(modelUtils, "getModel").and.returnValue(
        Promise.resolve(PROJECT_MODEL)
      );
      const updateModelSpy = spyOn(modelUtils, "updateModel").and.callFake(
        (m: IModel) => {
          return Promise.resolve(m);
        }
      );

      const prj: IHubProject = {
        itemControl: "edit",
        id: GUID,
        name: "Hello World",
        tags: ["Transportation"],
        description: "Some longer description",
        slug: "dcdev-wat-blarg",
        orgUrlKey: "dcdev",
        owner: "dcdev_dude",
        type: "Hub Project",
        createdDate: new Date(1595878748000),
        createdDateSource: "item.created",
        updatedDate: new Date(1595878750000),
        updatedDateSource: "item.modified",
        status: HubEntityStatus.inProgress,
        thumbnailUrl: "",
        permissions: [],
        catalog: {
          schemaVersion: 0,
        },
        schemaVersion: 1,
        canEdit: false,
        canDelete: false,
        location: {
          type: "none",
        },
        typeKeywords: [
          "Hub Project",
          "slug|dcdev-wat-blarg",
          "status|notStarted",
        ],
      };
      const chk = await updateProject(prj, { authentication: MOCK_AUTH });
      expect(chk.id).toBe(GUID);
      expect(chk.name).toBe("Hello World");
      expect(chk.description).toBe("Some longer description");
      expect(chk.typeKeywords).toEqual([
        "Hub Project",
        "slug|dcdev-wat-blarg",
        "status|inProgress",
        "cannotDiscuss",
      ]);
      expect(chk.location).toEqual({
        type: "none",
      });
      // should ensure unique slug
      expect(slugSpy.calls.count()).toBe(1);
      expect(slugSpy.calls.argsFor(0)[0]).toEqual(
        { slug: "dcdev-wat-blarg", existingId: GUID },
        "should recieve slug"
      );
      expect(getModelSpy.calls.count()).toBe(1);
      expect(updateModelSpy.calls.count()).toBe(1);
      const modelToUpdate = updateModelSpy.calls.argsFor(0)[0];
      expect(modelToUpdate.item.description).toBe(prj.description);
      expect(modelToUpdate.item.properties.slug).toBe("dcdev-wat-blarg-1");
    });
  });
  describe("editor to project", () => {
    it("removes ephemeral props", () => {
      const editor: IHubProjectEditor = {
        _groups: [],
        _thumbnail: "foo",
        view: { featuredImage: "bar" },
        _metric: {
          id: "123",
          cardTitle: "foo",
        },
      } as unknown as IHubProjectEditor;

      const res = editorToProject(editor, {
        urlKey: "foo",
      } as unknown as portalModule.IPortal);

      expect(res._groups).toBeUndefined();
      expect(res._thumbnail).toBeUndefined();
      expect(getProp(res, "view.featuredImage")).toBeUndefined();
      expect(res._metric).toBeUndefined();
    });
    it("ensures the project has an orgUrlKey", () => {
      const editor: IHubProjectEditor = {
        orgUrlKey: "bar",
      } as unknown as IHubProjectEditor;

      const res = editorToProject(editor, {
        urlKey: "foo",
      } as unknown as portalModule.IPortal);

      expect(res.orgUrlKey).toEqual("bar");
    });
    it("copies the location extent up one level", () => {
      const editor: IHubProjectEditor = {
        location: {
          extent: [
            [1, 2],
            [3, 4],
          ],
        },
      } as unknown as IHubProjectEditor;

      const res = editorToProject(editor, {
        urlKey: "foo",
      } as unknown as portalModule.IPortal);

      expect(res.extent).toEqual([
        [1, 2],
        [3, 4],
      ]);
    });
    describe("metrics", () => {
      let mockMetric: IMetric;
      let mockMetricDisplay: IMetricDisplayConfig;
      let editorToMetricSpy: jasmine.Spy;
      let setMetricAndDisplaySpy: jasmine.Spy;

      beforeEach(() => {
        mockMetric = {
          source: { type: "static-value", value: "10" },
          name: "123",
          id: "123",
        };
        mockMetricDisplay = {
          displayType: "stat-card",
          metricId: "123",
          cardTitle: "foo",
        };

        editorToMetricSpy = spyOn(
          editorToMetricModule,
          "editorToMetric"
        ).and.returnValue({ metric: {}, displayConfig: {} });
        setMetricAndDisplaySpy = spyOn(
          setMetricAndDisplayModule,
          "setMetricAndDisplay"
        ).and.returnValue({
          metrics: [mockMetric],
          view: { metricDisplays: [mockMetricDisplay] },
        });
      });
      it("handles creating new metrics", () => {
        const createIdSpy = spyOn(utilModule, "createId").and.returnValue(
          "123"
        );
        const editor = {
          _metric: {
            type: "static",
            value: "10",
            cardTitle: "foo",
          },
        } as unknown as IHubProjectEditor;

        const res = editorToProject(editor, {
          urlKey: "foo",
        } as unknown as portalModule.IPortal);

        expect(createIdSpy).toHaveBeenCalledTimes(1);
        expect(editorToMetricSpy).toHaveBeenCalledTimes(1);
        expect(setMetricAndDisplaySpy).toHaveBeenCalledTimes(1);
        expect(res.metrics).toEqual([mockMetric]);
        expect(getProp(res, "view.metricDisplays")).toEqual([
          mockMetricDisplay,
        ]);
      });
      it("handles updating existing metrics", () => {
        const editor = {
          _metric: {
            type: "static",
            id: "123",
            value: "10",
            cardTitle: "foo",
          },
        } as unknown as IHubProjectEditor;

        const res = editorToProject(editor, {
          urlKey: "foo",
        } as unknown as portalModule.IPortal);

        expect(editorToMetricSpy).toHaveBeenCalledTimes(1);
        expect(setMetricAndDisplaySpy).toHaveBeenCalledTimes(1);
        expect(res.metrics).toEqual([mockMetric]);
        expect(getProp(res, "view.metricDisplays")).toEqual([
          mockMetricDisplay,
        ]);
      });
    });
  });
});
