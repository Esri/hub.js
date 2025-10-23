import { vi } from "vitest";
vi.mock("@esri/arcgis-rest-portal", async (importOriginal) => {
  const original = await importOriginal();
  return {
    ...(original as any),
    removeItem: vi.fn(),
  };
});
import { MOCK_AUTH } from "../mocks/mock-auth";
import * as portalModule from "@esri/arcgis-rest-portal";
import * as slugUtils from "../../src/items/slugs";
import * as createModelModule from "../../src/models/createModel";
import * as updateModelModule from "../../src/models/updateModel";
import * as getModelModule from "../../src/models/getModel";
import { GUID, INITIATIVE_TEMPLATE_MODEL } from "./fixtures";
import {
  createInitiativeTemplate,
  deleteInitiativeTemplate,
  updateInitiativeTemplate,
} from "../../src/initiative-templates/edit";
import { cloneObject } from "../../src/util";
import { IModel } from "../../src/hub-types";
import { IHubInitiativeTemplate } from "../../src/core/types/IHubInitiativeTemplate";

describe("initiative template edit module:", () => {
  describe("destroyInitiativeTemplate:", () => {
    it("deletes the item", async () => {
      const removeSpy = vi
        .spyOn(portalModule as any, "removeItem")
        .mockResolvedValue({ success: true } as any);

      const result = await deleteInitiativeTemplate("3ef", {
        authentication: MOCK_AUTH,
      } as any);
      expect(result).toBeUndefined();
      expect(removeSpy).toHaveBeenCalledTimes(1);
      expect(removeSpy.mock.calls[0][0].authentication).toBe(MOCK_AUTH);
      expect(removeSpy.mock.calls[0][0].id).toBe("3ef");
    });
  });

  describe("createInitiativeTemplate:", () => {
    it("works with very limited initial structure", async () => {
      const slugSpy = vi
        .spyOn(slugUtils as any, "getUniqueSlug")
        .mockResolvedValue("dcdev|hello-world");
      const createSpy = vi
        .spyOn(createModelModule as any, "createModel")
        .mockImplementation((m: IModel) => {
          const newModel = cloneObject(m as any);
          newModel.item.id = GUID;
          return Promise.resolve(newModel);
        });
      const chk = await createInitiativeTemplate(
        { name: "Hello World", orgUrlKey: "dcdev" } as any,
        { authentication: MOCK_AUTH } as any
      );

      expect(chk.id).toBe(GUID);
      expect(chk.name).toBe("Hello World");
      expect(chk.typeKeywords).toEqual([
        "Hub Initiative Template",
        "slug|dcdev|hello-world",
        "cannotDiscuss",
      ]);
      expect(slugSpy).toHaveBeenCalledTimes(1);
      expect(slugSpy.mock.calls[0][0]).toEqual({ slug: "dcdev|hello-world" });
      expect(createSpy).toHaveBeenCalledTimes(1);
      const modelToCreate = createSpy.mock.calls[0][0];
      expect(modelToCreate.item.title).toBe("Hello World");
      expect(modelToCreate.item.type).toBe("Hub Initiative Template");
      expect(modelToCreate.item.properties.slug).toBe("dcdev|hello-world");
      expect(modelToCreate.item.properties.orgUrlKey).toBe("dcdev");
    });

    it("works with more complete object", async () => {
      const slugSpy = vi
        .spyOn(slugUtils as any, "getUniqueSlug")
        .mockResolvedValue("dcdev|hello-world");
      const createSpy = vi
        .spyOn(createModelModule as any, "createModel")
        .mockImplementation((m: IModel) => {
          const newModel = cloneObject(m as any);
          newModel.item.id = GUID;
          return Promise.resolve(newModel);
        });
      const chk = await createInitiativeTemplate(
        {
          name: "Hello World",
          slug: "dcdev|hello-world",
          description: "my desc",
          orgUrlKey: "dcdev",
          previewUrl: "https://some-preview-url.com",
          siteSolutionId: "c123",
          recommendedTemplates: ["c456"],
        } as any,
        { authentication: MOCK_AUTH } as any
      );
      expect(chk.id).toBe(GUID);
      expect(chk.name).toBe("Hello World");
      expect(chk.description).toBe("my desc");
      expect(chk.typeKeywords).toEqual([
        "Hub Initiative Template",
        "slug|dcdev|hello-world",
        "cannotDiscuss",
      ]);
      expect(chk.previewUrl).toBe("https://some-preview-url.com");
      expect(chk.siteSolutionId).toBe("c123");
      expect(chk.recommendedTemplates).toEqual(["c456"]);
      expect(slugSpy).toHaveBeenCalledTimes(1);
      expect(slugSpy.mock.calls[0][0]).toEqual({ slug: "dcdev|hello-world" });
      expect(createSpy).toHaveBeenCalledTimes(1);
      const modelToCreate = createSpy.mock.calls[0][0];
      expect(modelToCreate.item.properties.slug).toBe("dcdev|hello-world");
      expect(modelToCreate.item.properties.orgUrlKey).toBe("dcdev");
    });
  });

  describe("updateInitiativeTemplate: ", () => {
    it("updates backing model", async () => {
      const slugSpy = vi
        .spyOn(slugUtils as any, "getUniqueSlug")
        .mockResolvedValue("dcdev|dcdev-wat-blarg-1");
      const getModelSpy = vi
        .spyOn(getModelModule as any, "getModel")
        .mockResolvedValue(INITIATIVE_TEMPLATE_MODEL as any);
      const updateModelSpy = vi
        .spyOn(updateModelModule as any, "updateModel")
        .mockImplementation((m: IModel) => Promise.resolve(m as any));

      const it: IHubInitiativeTemplate = {
        itemControl: "edit",
        id: GUID,
        name: "Hello World",
        tags: ["Transportation"],
        description: "Some longer description",
        slug: "dcdev-wat-blarg",
        orgUrlKey: "dcdev",
        owner: "dcdev_dude",
        type: "Hub Initiative Template",
        createdDate: new Date(1595878748000),
        createdDateSource: "item.created",
        updatedDate: new Date(1595878750000),
        updatedDateSource: "item.modified",
        thumbnailUrl: "",
        permissions: [],
        previewUrl: "https://dog-house-qa-pre-a-hub.hubqa.arcgis.com",
        recommendedTemplates: ["c456"],
        siteSolutionId: "c123",
        catalog: {
          schemaVersion: 0,
        },
        schemaVersion: 1,
        canEdit: false,
        canDelete: false,
        location: {
          type: "none",
        },
        typeKeywords: ["Hub Initiative Template", "slug|dcdev-wat-blarg"],
      };
      const chk = await updateInitiativeTemplate(
        it as any,
        {
          authentication: MOCK_AUTH,
        } as any
      );
      expect(chk.id).toBe(GUID);
      expect(chk.name).toBe("Hello World");
      expect(chk.description).toBe("Some longer description");
      expect(chk.typeKeywords).toEqual([
        "Hub Initiative Template",
        "slug|dcdev|dcdev-wat-blarg-1",
        "cannotDiscuss",
      ]);
      expect(chk.location).toEqual({
        type: "none",
      });
      expect(chk.previewUrl).toBe(
        "https://dog-house-qa-pre-a-hub.hubqa.arcgis.com"
      );
      expect(chk.siteSolutionId).toBe("c123");
      expect(chk.recommendedTemplates).toEqual(["c456"]);
      expect(slugSpy).toHaveBeenCalledTimes(1);
      expect(slugSpy.mock.calls[0][0]).toEqual({
        slug: "dcdev|dcdev-wat-blarg",
        existingId: GUID,
      });
      expect(getModelSpy).toHaveBeenCalledTimes(1);
      expect(updateModelSpy).toHaveBeenCalledTimes(1);
      const modelToUpdate = updateModelSpy.mock.calls[0][0];
      expect(modelToUpdate.item.description).toBe(it.description);
      expect(modelToUpdate.item.properties.slug).toBe(
        "dcdev|dcdev-wat-blarg-1"
      );
    });
    it("sets showMap to true when view.showMap is undefined", async () => {
      vi.spyOn(slugUtils as any, "getUniqueSlug").mockResolvedValue(
        "dcdev|dcdev-wat-blarg-1"
      );
      vi.spyOn(getModelModule as any, "getModel").mockResolvedValue(
        INITIATIVE_TEMPLATE_MODEL as any
      );
      const it: IHubInitiativeTemplate = {
        itemControl: "edit",
        id: GUID,
        name: "No Map",
        description: "No map in view",
        type: "Hub Initiative Template",
        schemaVersion: 1,
        location: { type: "none" },
        typeKeywords: ["Hub Initiative Template"],
        orgUrlKey: "dcdev",
      } as IHubInitiativeTemplate;
      const updateModelSpy = vi
        .spyOn(updateModelModule as any, "updateModel")
        .mockImplementation((m: IModel) => Promise.resolve(m as any));
      const chk = await updateInitiativeTemplate(
        it as any,
        {
          authentication: MOCK_AUTH,
        } as any
      );
      expect(chk.view.showMap).toBe(true);
      expect(updateModelSpy).toHaveBeenCalledTimes(1);
    });

    it("does not overwrite showMap when view.showMap is defined", async () => {
      vi.spyOn(slugUtils as any, "getUniqueSlug").mockResolvedValue(
        "dcdev|dcdev-wat-blarg-1"
      );
      vi.spyOn(getModelModule as any, "getModel").mockResolvedValue(
        INITIATIVE_TEMPLATE_MODEL as any
      );
      const it: IHubInitiativeTemplate = {
        itemControl: "edit",
        id: GUID,
        name: "With Map",
        description: "Map in view",
        type: "Hub Initiative Template",
        schemaVersion: 1,
        location: { type: "none" },
        typeKeywords: ["Hub Initiative Template"],
        orgUrlKey: "dcdev",
        view: { showMap: false },
      } as IHubInitiativeTemplate;
      const updateModelSpy = vi
        .spyOn(updateModelModule as any, "updateModel")
        .mockImplementation((m: IModel) => Promise.resolve(m as any));
      const chk = await updateInitiativeTemplate(
        it as any,
        {
          authentication: MOCK_AUTH,
        } as any
      );
      expect(chk.view).toBeDefined();
      expect(chk.view.showMap).toBe(false);
      expect(updateModelSpy).toHaveBeenCalledTimes(1);
    });
  });
});
