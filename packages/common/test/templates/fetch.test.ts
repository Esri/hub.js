import { ArcGISContextManager } from "../../src/ArcGISContextManager";
import {
  GUID,
  TEMPLATE_DATA,
  TEMPLATE_ITEM,
  initContextManager,
} from "./fixtures";
import {
  fetchTemplate,
  convertItemToTemplate,
  enrichTemplateSearchResult,
} from "../../src/templates/fetch";
import * as portalModule from "@esri/arcgis-rest-portal";
import * as getItemBySlugModule from "../../src/items/slugs";
import * as fetchItemEnrichmentsModule from "../../src/items/_enrichments";
import * as computeLinksModule from "../../src/templates/_internal/computeLinks";
import * as templateUtilsModule from "../../src/templates/utils";

describe("templates: fetch module", () => {
  let authdCtxMgr: ArcGISContextManager;
  beforeEach(async () => {
    authdCtxMgr = await initContextManager();
  });

  describe("fetchTemplate", () => {
    beforeEach(() => {
      spyOn(portalModule, "getItemData").and.returnValue(
        Promise.resolve(TEMPLATE_DATA)
      );
    });
    it("fetches by id if provided a guid", async () => {
      const getItemSpy = spyOn(portalModule, "getItem").and.returnValue(
        Promise.resolve(TEMPLATE_ITEM)
      );

      const chk = await fetchTemplate(GUID, authdCtxMgr.context.requestOptions);

      expect(chk.id).toBe(GUID);
      expect(getItemSpy).toHaveBeenCalledTimes(1);
      expect(getItemSpy.calls.argsFor(0)[0]).toBe(GUID);
    });
    it("fetches by slug if not provided a guid", async () => {
      const getItemBySlugSpy = spyOn(
        getItemBySlugModule,
        "getItemBySlug"
      ).and.returnValue(Promise.resolve(TEMPLATE_ITEM));

      const mockSlug = TEMPLATE_ITEM.properties.slug;
      const chk = await fetchTemplate(
        mockSlug,
        authdCtxMgr.context.requestOptions
      );

      expect(chk.slug).toBe(mockSlug);
      expect(getItemBySlugSpy).toHaveBeenCalledTimes(1);
      expect(getItemBySlugSpy.calls.argsFor(0)[0]).toBe(mockSlug);
    });
    it("returns null if no item was found", async () => {
      const getItemSpy = spyOn(portalModule, "getItem").and.returnValue(
        Promise.resolve(undefined)
      );

      const chk = await fetchTemplate(GUID, authdCtxMgr.context.requestOptions);

      expect(getItemSpy).toHaveBeenCalledTimes(1);
      expect(chk).toBeNull();
    });
  });

  describe("enrichTemplateSearchResult", () => {
    let fetchItemEnrichmentsSpy: jasmine.Spy;
    let computLinksSpy: jasmine.Spy;
    let getDeployedTemplateTypeSpy: jasmine.Spy;

    beforeEach(() => {
      fetchItemEnrichmentsSpy = spyOn(
        fetchItemEnrichmentsModule,
        "fetchItemEnrichments"
      ).and.callFake(() => Promise.resolve({}));
      computLinksSpy = spyOn(
        computeLinksModule,
        "computeLinks"
      ).and.returnValue({ self: "some-link" });
      getDeployedTemplateTypeSpy = spyOn(
        templateUtilsModule,
        "getDeployedTemplateType"
      ).and.returnValue("StoryMap");
    });
    afterEach(() => {
      fetchItemEnrichmentsSpy.calls.reset();
      computLinksSpy.calls.reset();
      getDeployedTemplateTypeSpy.calls.reset();
    });

    it("enriches the templates with well-known item enrichments", async () => {
      await enrichTemplateSearchResult(
        TEMPLATE_ITEM,
        ["someEnrichment AS enrichment"],
        authdCtxMgr.context.hubRequestOptions
      );

      expect(fetchItemEnrichmentsSpy).toHaveBeenCalledTimes(1);
    });
    it("enriches the template with well-known links", async () => {
      const chk = await enrichTemplateSearchResult(
        TEMPLATE_ITEM,
        [],
        authdCtxMgr.context.hubRequestOptions
      );

      expect(computLinksSpy).toHaveBeenCalledTimes(1);
      expect(chk.links).toEqual({ self: "some-link" });
    });
    it("enriches the template with the activated solution type", async () => {
      const chk = await enrichTemplateSearchResult(
        TEMPLATE_ITEM,
        [],
        authdCtxMgr.context.hubRequestOptions
      );

      expect(getDeployedTemplateTypeSpy).toHaveBeenCalledTimes(1);
      expect(chk.deployedType).toBe("StoryMap");
    });
  });

  describe("convertItemToTemplate", () => {
    it("converts the item correctly", async () => {
      const getItemDataSpy = spyOn(portalModule, "getItemData").and.returnValue(
        Promise.resolve(TEMPLATE_DATA)
      );

      const chk = await convertItemToTemplate(
        TEMPLATE_ITEM,
        authdCtxMgr.context.requestOptions
      );

      expect(getItemDataSpy).toHaveBeenCalledTimes(1);
      expect(chk.name).toBe("Mock Template");
      expect(chk.previewUrl).toBe(
        "https://dog-house-qa-pre-a-hub.hubqa.arcgis.com"
      );
    });
  });
});
