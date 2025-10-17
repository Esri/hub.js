import { vi } from "vitest";
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

vi.mock("@esri/arcgis-rest-portal", async (importOriginal) => ({
  ...(await importOriginal()),
  getItem: vi.fn(),
  getItemData: vi.fn(),
}));

describe("templates: fetch module", () => {
  let authdCtxMgr: Partial<ArcGISContextManager>;
  beforeEach(() => {
    authdCtxMgr = initContextManager();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("fetchTemplate", () => {
    beforeEach(() => {
      vi.spyOn(portalModule, "getItemData").mockReturnValue(
        Promise.resolve(TEMPLATE_DATA) as any
      );
    });
    it("fetches by id if provided a guid", async () => {
      const getItemSpy = vi
        .spyOn(portalModule, "getItem")
        .mockReturnValue(Promise.resolve(TEMPLATE_ITEM) as any);

      const chk = await fetchTemplate(GUID, authdCtxMgr.context.requestOptions);

      expect(chk.id).toBe(GUID);
      expect(getItemSpy).toHaveBeenCalledTimes(1);
      expect(getItemSpy.mock.calls[0][0]).toBe(GUID);
    });
    it("fetches by slug if not provided a guid", async () => {
      const getItemBySlugSpy = vi
        .spyOn(getItemBySlugModule, "getItemBySlug")
        .mockReturnValue(Promise.resolve(TEMPLATE_ITEM) as any);

      const mockSlug = TEMPLATE_ITEM.properties.slug;
      const chk = await fetchTemplate(
        mockSlug,
        authdCtxMgr.context.requestOptions
      );

      expect(chk.slug).toBe(mockSlug);
      expect(getItemBySlugSpy).toHaveBeenCalledTimes(1);
      expect(getItemBySlugSpy.mock.calls[0][0]).toBe(mockSlug);
    });
    it("returns null if no item was found", async () => {
      const getItemSpy = vi
        .spyOn(portalModule, "getItem")
        .mockReturnValue(Promise.resolve(undefined) as any);

      const chk = await fetchTemplate(GUID, authdCtxMgr.context.requestOptions);

      expect(getItemSpy).toHaveBeenCalledTimes(1);
      expect(chk).toBeNull();
    });
  });

  describe("enrichTemplateSearchResult", () => {
    let fetchItemEnrichmentsSpy: any;
    let computLinksSpy: any;
    let getDeployedTemplateTypeSpy: any;

    beforeEach(() => {
      fetchItemEnrichmentsSpy = vi
        .spyOn(fetchItemEnrichmentsModule, "fetchItemEnrichments")
        .mockImplementation(() => Promise.resolve({}) as any);
      computLinksSpy = vi
        .spyOn(computeLinksModule, "computeLinks")
        .mockReturnValue({ self: "some-link" } as any);
      getDeployedTemplateTypeSpy = vi
        .spyOn(templateUtilsModule, "getDeployedTemplateType")
        .mockReturnValue("StoryMap" as any);
    });
    afterEach(() => {
      fetchItemEnrichmentsSpy.mockClear();
      computLinksSpy.mockClear();
      getDeployedTemplateTypeSpy.mockClear();
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
      const getItemDataSpy = vi
        .spyOn(portalModule, "getItemData")
        .mockReturnValue(Promise.resolve(TEMPLATE_DATA) as any);

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
