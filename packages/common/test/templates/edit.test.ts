import { createTemplate, updateTemplate } from "../../src/templates/edit";
import {
  GUID,
  TEMPLATE_MODEL,
  TEMPLATE_ENTITY,
  initContextManager,
} from "./fixtures";
import * as slugUtils from "../../src/items/slugs";
import * as modelUtils from "../../src/models";
import { IModel } from "../../src/types";
import { cloneObject } from "../../src/util";
import { ArcGISContextManager } from "../../src/ArcGISContextManager";
import { IHubTemplate } from "../../src/core/types/IHubTemplate";

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
    let createSpy: any;
    beforeEach(() => {
      createSpy = spyOn(modelUtils, "createModel").and.callFake((m: IModel) => {
        const newModel = cloneObject(m);
        newModel.item.id = GUID;
        return Promise.resolve(newModel);
      });
    });
    it("creates the backing model + returns a template entity", async () => {
      const constructSlugSpy = spyOn(
        slugUtils,
        "constructSlug"
      ).and.returnValue("dcdev|template-test");
      const chk = await createTemplate(
        { name: "Template Test", orgUrlKey: "dcdev" },
        authdCtxMgr.context.userRequestOptions
      );

      // constructs + ensures slug is unique
      expect(constructSlugSpy).toHaveBeenCalledTimes(1);
      expect(getUniqueSlugSpy).toHaveBeenCalledTimes(1);
      expect(getUniqueSlugSpy.calls.argsFor(0)[0]).toEqual(
        { slug: "dcdev|template-test" },
        authdCtxMgr.context.userRequestOptions
      );

      // creates the backing item
      expect(createSpy.calls.count()).toBe(1);
      const modelToCreate = createSpy.calls.argsFor(0)[0];
      expect(modelToCreate.item.title).toBe("Template Test");
      expect(modelToCreate.item.type).toBe("Solution");
      expect(modelToCreate.item.properties.slug).toBe("dcdev|template-test");
      expect(modelToCreate.item.properties.orgUrlKey).toBe("dcdev");

      // returns the template entity
      expect(chk.id).toBe(GUID);
      expect(chk.name).toBe("Template Test");
      expect(chk.typeKeywords).toEqual([
        "Solution",
        "slug|dcdev|template-test",
        "cannotDiscuss",
      ]);
    });
    it("uses the slug when provided", async () => {
      const chk = await createTemplate(
        { name: "Template Test", slug: "dcdev|provided-slug" },
        authdCtxMgr.context.userRequestOptions
      );
      expect(chk.slug).toBe("dcdev|provided-slug");
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
});
