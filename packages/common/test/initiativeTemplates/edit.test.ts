import {
  IModel,
  cloneObject,
  deleteInitiativeTemplate,
  createInitiativeTemplate,
  IHubInitiativeTemplate,
  updateInitiativeTemplate,
  IHubInitiativeTemplateEditor,
  editorToInitiativeTemplate,
  getProp,
} from "../../src";
import { MOCK_AUTH } from "../mocks/mock-auth";
import * as portalModule from "@esri/arcgis-rest-portal";
import * as slugUtils from "../../src/items/slugs";
import * as modelUtils from "../../src/models";
import { GUID, INITIATIVE_TEMPLATE_MODEL } from "./fixtures";

describe("initiative template edit module:", () => {
  describe("destroyInitiativeTemplate:", () => {
    it("deletes the item", async () => {
      const removeSpy = spyOn(portalModule, "removeItem").and.returnValue(
        Promise.resolve({ success: true })
      );

      const result = await deleteInitiativeTemplate("3ef", {
        authentication: MOCK_AUTH,
      });
      expect(result).toBeUndefined();
      expect(removeSpy.calls.count()).toBe(1);
      expect(removeSpy.calls.argsFor(0)[0].authentication).toBe(MOCK_AUTH);
      expect(removeSpy.calls.argsFor(0)[0].id).toBe("3ef");
    });
  });

  describe("createInitiativeTemplate:", () => {
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
      const chk = await createInitiativeTemplate(
        { name: "Hello World", orgUrlKey: "dcdev" },
        { authentication: MOCK_AUTH }
      );

      expect(chk.id).toBe(GUID);
      expect(chk.name).toBe("Hello World");
      expect(chk.typeKeywords).toEqual([
        "Hub Initiative Template",
        "slug|dcdev|hello-world",
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
      expect(modelToCreate.item.type).toBe("Hub Initiative Template");
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
      const chk = await createInitiativeTemplate(
        {
          name: "Hello World",
          slug: "dcdev|hello-world", // important for coverage
          description: "my desc",
          orgUrlKey: "dcdev",
          previewUrl: "https://some-preview-url.com",
          siteSolutionId: "c123",
          recommendedTemplates: ["c456"],
        },
        { authentication: MOCK_AUTH }
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
    });
  });

  describe("updateInitiativeTemplate: ", () => {
    it("updates backing model", async () => {
      const slugSpy = spyOn(slugUtils, "getUniqueSlug").and.returnValue(
        Promise.resolve("dcdev-wat-blarg-1")
      );
      const getModelSpy = spyOn(modelUtils, "getModel").and.returnValue(
        Promise.resolve(INITIATIVE_TEMPLATE_MODEL)
      );
      const updateModelSpy = spyOn(modelUtils, "updateModel").and.callFake(
        (m: IModel) => {
          return Promise.resolve(m);
        }
      );

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
      const chk = await updateInitiativeTemplate(it, {
        authentication: MOCK_AUTH,
      });
      expect(chk.id).toBe(GUID);
      expect(chk.name).toBe("Hello World");
      expect(chk.description).toBe("Some longer description");
      expect(chk.typeKeywords).toEqual([
        "Hub Initiative Template",
        "slug|dcdev-wat-blarg",
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
      // should ensure unique slug
      expect(slugSpy.calls.count()).toBe(1);
      expect(slugSpy.calls.argsFor(0)[0]).toEqual(
        { slug: "dcdev-wat-blarg", existingId: GUID },
        "should recieve slug"
      );
      expect(getModelSpy.calls.count()).toBe(1);
      expect(updateModelSpy.calls.count()).toBe(1);
      const modelToUpdate = updateModelSpy.calls.argsFor(0)[0];
      expect(modelToUpdate.item.description).toBe(it.description);
      expect(modelToUpdate.item.properties.slug).toBe("dcdev-wat-blarg-1");
    });
  });

  describe("editor to initiative template", () => {
    it("basic transform", () => {
      const editor: IHubInitiativeTemplateEditor = {
        orgUrlKey: "bar",
      } as unknown as IHubInitiativeTemplateEditor;
      const it = editorToInitiativeTemplate(editor, {
        urlKey: "foo",
      } as unknown as portalModule.IPortal);
      expect(it.orgUrlKey).toEqual("bar");
    });

    it("sparse transform", () => {
      const editor: IHubInitiativeTemplateEditor =
        {} as unknown as IHubInitiativeTemplateEditor;
      const p = editorToInitiativeTemplate(editor, {
        urlKey: "foo",
      } as unknown as portalModule.IPortal);
      expect(p.orgUrlKey).toEqual("foo");
      expect(p.extent).toBeUndefined();
    });
  });
});
