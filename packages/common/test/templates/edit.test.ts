import {
  createTemplate,
  updateTemplate,
  deleteTemplate,
  editorToTemplate,
} from "../../src/templates/edit";
import {
  GUID,
  TEMPLATE_MODEL,
  TEMPLATE_ENTITY,
  initContextManager,
} from "./fixtures";
import { IModel } from "../../src/hub-types";
import { ArcGISContextManager } from "../../src/ArcGISContextManager";
import {
  IHubTemplate,
  IHubTemplateEditor,
} from "../../src/core/types/IHubTemplate";
import * as slugUtils from "../../src/items/slugs";
import * as modelUtils from "../../src/models";
import * as portalModule from "@esri/arcgis-rest-portal";

describe("templates: edit module", () => {
  let authdCtxMgr: ArcGISContextManager;
  let getUniqueSlugSpy: any;

  beforeEach(async () => {
    authdCtxMgr = await initContextManager();
    getUniqueSlugSpy = spyOn(slugUtils, "getUniqueSlug").and.callFake(
      ({ slug }: { slug: string }) => Promise.resolve(slug)
    );
  });

  describe("createTemplate", () => {
    it("throws an error", async () => {
      try {
        await createTemplate(
          { name: "Template Test", orgUrlKey: "dcdev" },
          authdCtxMgr.context.userRequestOptions
        );
      } catch (e) {
        expect(e).toBeTruthy();
      }
    });
  });

  describe("updateTemplate", () => {
    let getModelSpy: any;
    let updateModelSpy: any;
    beforeEach(() => {
      getModelSpy = spyOn(modelUtils, "getModel").and.returnValue(
        Promise.resolve(TEMPLATE_MODEL)
      );
      updateModelSpy = spyOn(modelUtils, "updateModel").and.callFake(
        (m: IModel) => Promise.resolve(m)
      );
    });
    it("updates the backing model + returns the updated template entity", async () => {
      const updatedTemplate: IHubTemplate = {
        ...TEMPLATE_ENTITY,
        name: "Updated Template Title",
        previewUrl: "updated-preview-url",
        summary: "Updated template summary",
        description: "Updated template description",
      };
      const chk = await updateTemplate(
        updatedTemplate,
        authdCtxMgr.context.userRequestOptions
      );

      // ensures slug is unique
      expect(getUniqueSlugSpy).toHaveBeenCalledTimes(1);
      expect(getUniqueSlugSpy.calls.argsFor(0)[0]).toEqual(
        { slug: "qa-pre-a-hub|mock-template", existingId: GUID },
        authdCtxMgr.context.userRequestOptions
      );

      // updates the backing item
      expect(getModelSpy).toHaveBeenCalledTimes(1);
      expect(updateModelSpy).toHaveBeenCalledTimes(1);

      const modelToUpdate: IModel = updateModelSpy.calls.argsFor(0)[0];
      expect(modelToUpdate.item.title).toBe("Updated Template Title");
      expect(modelToUpdate.item.properties.previewUrl).toBe(
        "updated-preview-url"
      );
      expect(modelToUpdate.item.snippet).toBe("Updated template summary");
      expect(modelToUpdate.item.description).toBe(
        "Updated template description"
      );

      // returns the updated entity
      expect(chk.name).toBe("Updated Template Title");
      expect(chk.previewUrl).toBe("updated-preview-url");
      expect(chk.summary).toBe("Updated template summary");
      expect(chk.description).toBe("Updated template description");
    });
  });

  describe("editor to template", () => {
    it("ensures there is an org url key", () => {
      const editor: IHubTemplateEditor = {
        orgUrlKey: "bar",
      } as unknown as IHubTemplateEditor;
      const mockTemplate1 = editorToTemplate(editor, {
        urlKey: "foo",
      } as unknown as portalModule.IPortal);
      expect(mockTemplate1.orgUrlKey).toEqual("bar");

      const mockTemplate2 = editorToTemplate(
        {} as IHubTemplateEditor,
        { urlKey: "foo" } as unknown as portalModule.IPortal
      );
      expect(mockTemplate2.orgUrlKey).toEqual("foo");
    });
  });

  describe("delteTemplate", () => {
    it("deletes the template's backing item", async () => {
      const removeItemSpy = spyOn(portalModule, "removeItem").and.returnValue(
        Promise.resolve({ success: true })
      );

      const chk = await deleteTemplate(
        "00c",
        authdCtxMgr.context.userRequestOptions
      );
      expect(chk).toBeUndefined();
      expect(removeItemSpy).toHaveBeenCalledTimes(1);
      expect(removeItemSpy.calls.argsFor(0)[0].id).toBe("00c");
    });
  });
});
