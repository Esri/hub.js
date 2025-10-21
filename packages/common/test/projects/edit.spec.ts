import { describe, it, expect, vi } from "vitest";
import { GUID, PROJECT_LOCATION, PROJECT_MODEL } from "./fixtures";
import { MOCK_AUTH } from "../mocks/mock-auth";
// partially mock portal module while preserving other helpers used by utils
vi.mock("@esri/arcgis-rest-portal", async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...(actual as any),
    getItem: vi.fn(),
    getItemData: vi.fn(),
    removeItem: vi.fn(),
  };
});
import * as portalModule from "@esri/arcgis-rest-portal";
import * as slugUtils from "../../src/items/slugs";
import * as createModelUtils from "../../src/models/createModel";
import * as updateModelUtils from "../../src/models/updateModel";
import * as getModelUtils from "../../src/models/getModel";
import {
  createProject,
  deleteProject,
  updateProject,
} from "../../src/projects/edit";
import { HubEntityStatus, IModel } from "../../src/hub-types";
import { cloneObject } from "../../src/util";
import { IHubProject } from "../../src/core/types/IHubProject";

describe("project edit module:", () => {
  describe("destroyProject:", () => {
    it("deletes the item", async () => {
      (
        portalModule.removeItem as unknown as ReturnType<typeof vi.fn>
      ).mockResolvedValue({ success: true } as any);

      const result = await deleteProject("3ef", {
        authentication: MOCK_AUTH,
      } as any);
      expect(result).toBeUndefined();
      expect(
        portalModule.removeItem as unknown as ReturnType<typeof vi.fn>
      ).toHaveBeenCalledTimes(1);
      // inspect the first call's first arg to avoid strict equality on the full auth object
      expect(
        (portalModule.removeItem as any).mock.calls[0][0].authentication
      ).toBe(MOCK_AUTH);
      expect((portalModule.removeItem as any).mock.calls[0][0].id).toBe("3ef");
    });
  });

  describe("createProject:", () => {
    it("works with very limited initial structure", async () => {
      const slugSpy = vi
        .spyOn(slugUtils, "getUniqueSlug")
        .mockResolvedValue("dcdev|hello-world");
      const createSpy = vi
        .spyOn(createModelUtils, "createModel")
        .mockImplementation((m: IModel) => {
          const newModel = cloneObject(m);
          newModel.item.id = GUID;
          return Promise.resolve(newModel);
        });
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
      // should ensure unique slug (may be called with additional auth param)
      expect((slugSpy as any).mock.calls.length).toBeGreaterThan(0);
      expect((slugSpy as any).mock.calls[0][0]).toEqual({
        slug: "dcdev|hello-world",
      });
      // should create the item
      expect(createSpy).toHaveBeenCalledTimes(1);
      const modelToCreate = createSpy.mock.calls[0][0];
      expect(modelToCreate.item.title).toBe("Hello World");
      expect(modelToCreate.item.type).toBe("Hub Project");
      expect(modelToCreate.item.properties.slug).toBe("dcdev|hello-world");
      expect(modelToCreate.item.properties.orgUrlKey).toBe("dcdev");
    });
    it("works with more complete object", async () => {
      const slugSpy = vi
        .spyOn(slugUtils, "getUniqueSlug")
        .mockResolvedValue("dcdev|hello-world");
      const createSpy = vi
        .spyOn(createModelUtils, "createModel")
        .mockImplementation((m: IModel) => {
          const newModel = cloneObject(m);
          newModel.item.id = GUID;
          return Promise.resolve(newModel);
        });
      const chk = await createProject(
        {
          name: "Hello World",
          slug: "dcdev|hello-world",
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
      expect((slugSpy as any).mock.calls.length).toBeGreaterThan(0);
      expect((slugSpy as any).mock.calls[0][0]).toEqual({
        slug: "dcdev|hello-world",
      });
      expect(createSpy).toHaveBeenCalledTimes(1);
      const modelToCreate = createSpy.mock.calls[0][0];
      expect(modelToCreate.item.properties.slug).toBe("dcdev|hello-world");
      expect(modelToCreate.item.properties.orgUrlKey).toBe("dcdev");

      expect(chk.location).toEqual(PROJECT_LOCATION);
    });
  });

  describe("updateProject: ", () => {
    it("updates backing model", async () => {
      const slugSpy = vi
        .spyOn(slugUtils, "getUniqueSlug")
        .mockResolvedValue("dcdev|dcdev-wat-blarg-1");
      const getModelSpy = vi
        .spyOn(getModelUtils, "getModel")
        .mockResolvedValue(PROJECT_MODEL as any);
      const updateModelSpy = vi
        .spyOn(updateModelUtils, "updateModel")
        .mockImplementation((m: IModel) => Promise.resolve(m));

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
        catalog: { schemaVersion: 0 },
        catalogs: [],
        schemaVersion: 1,
        canEdit: false,
        canDelete: false,
        location: { type: "none" },
        typeKeywords: [
          "Hub Project",
          "slug|dcdev-wat-blarg",
          "status|notStarted",
        ],
      } as IHubProject;
      const chk = await updateProject(prj, {
        authentication: MOCK_AUTH,
      } as any);
      expect(chk.id).toBe(GUID);
      expect(chk.name).toBe("Hello World");
      expect(chk.description).toBe("Some longer description");
      expect(chk.typeKeywords).toContain("Hub Project");
      expect(chk.typeKeywords).toContain("slug|dcdev|dcdev-wat-blarg-1");
      expect(chk.typeKeywords).toContain("status|inProgress");
      expect(chk.typeKeywords).toContain("cannotDiscuss");
      expect(chk.location).toEqual({ type: "none" });
      expect((slugSpy as any).mock.calls.length).toBeGreaterThan(0);
      expect((slugSpy as any).mock.calls[0][0]).toEqual({
        slug: "dcdev|dcdev-wat-blarg",
        existingId: GUID,
      });
      expect(getModelSpy).toHaveBeenCalledTimes(1);
      expect(updateModelSpy).toHaveBeenCalledTimes(1);
      const modelToUpdate = updateModelSpy.mock.calls[0][0];
      expect(modelToUpdate.item.description).toBe(prj.description);
      expect(modelToUpdate.item.properties.slug).toBe(
        "dcdev|dcdev-wat-blarg-1"
      );
    });
  });
});
