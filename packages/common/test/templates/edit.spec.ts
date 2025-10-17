vi.mock("@esri/arcgis-rest-portal", async (importOriginal) => ({
  ...(await importOriginal()),
  removeItem: vi.fn(),
}));

import { vi } from "vitest";
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
import * as getModelUtils from "../../src/models/getModel";
import * as updateModelUtils from "../../src/models/updateModel";
import type { IPortal } from "@esri/arcgis-rest-portal";
import * as portalModule from "@esri/arcgis-rest-portal";

describe("templates: edit module", () => {
  let authdCtxMgr: Partial<ArcGISContextManager>;
  let getUniqueSlugSpy: any;

  beforeEach(() => {
    authdCtxMgr = initContextManager();
    getUniqueSlugSpy = vi
      .spyOn(slugUtils, "getUniqueSlug")
      .mockImplementation(({ slug }: { slug: string }) =>
        Promise.resolve(slug)
      );
  });

  afterEach(() => {
    vi.restoreAllMocks();
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
      getModelSpy = vi
        .spyOn(getModelUtils, "getModel")
        .mockReturnValue(Promise.resolve(TEMPLATE_MODEL) as any);
      updateModelSpy = vi
        .spyOn(updateModelUtils, "updateModel")
        .mockImplementation((m: IModel) => Promise.resolve(m) as any);
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
      expect(getUniqueSlugSpy.mock.calls[0][0]).toEqual({
        slug: "qa-pre-a-hub|mock-template",
        existingId: GUID,
      });

      // updates the backing item
      expect(getModelSpy).toHaveBeenCalledTimes(1);
      expect(updateModelSpy).toHaveBeenCalledTimes(1);

      const modelToUpdate: IModel = updateModelSpy.mock.calls[0][0];
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
      } as unknown as IPortal);
      expect(mockTemplate1.orgUrlKey).toEqual("bar");

      const mockTemplate2 = editorToTemplate(
        {} as IHubTemplateEditor,
        { urlKey: "foo" } as unknown as IPortal
      );
      expect(mockTemplate2.orgUrlKey).toEqual("foo");
    });
  });

  describe("deleteTemplate", () => {
    it("deletes the template's backing item", async () => {
      const removeItemSpy = vi
        .spyOn(portalModule, "removeItem")
        .mockReturnValue(
          Promise.resolve({ success: true, itemId: "00c" } as any)
        );

      const chk = await deleteTemplate(
        "00c",
        authdCtxMgr.context.userRequestOptions
      );
      expect(chk).toBeUndefined();
      expect(removeItemSpy).toHaveBeenCalledTimes(1);
      expect(removeItemSpy.mock.calls[0][0].id).toBe("00c");
    });
  });
});
