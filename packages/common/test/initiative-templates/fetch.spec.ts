import { vi } from "vitest";
vi.mock("@esri/arcgis-rest-portal", async (importOriginal) => {
  const original = await importOriginal();
  return {
    ...(original as any),
    getItem: vi.fn(),
    getItemData: vi.fn(),
    removeItem: vi.fn(),
  };
});
import {
  convertItemToInitiativeTemplate,
  enrichInitiativeTemplateSearchResult,
  fetchInitiativeTemplate,
} from "../../src/initiative-templates/fetch";
import {
  INITIATIVE_TEMPLATE_ITEM,
  INITIATIVE_TEMPLATE_DATA,
  GUID,
} from "./fixtures";
import { MOCK_AUTH, MOCK_CONTEXT } from "../mocks/mock-auth";
import { IRequestOptions } from "@esri/arcgis-rest-request";
import * as portalModule from "@esri/arcgis-rest-portal";
import * as slugUtils from "../../src/items/slugs";
import * as FetchEnrichments from "../../src/items/_enrichments";
import { IHubInitiativeTemplate } from "../../src/core/types/IHubInitiativeTemplate";
import { IHubRequestOptions } from "../../src/hub-types";
import { cloneObject } from "../../src/util";

describe("initiative template fetch module:", () => {
  describe("fetchInitiativeTemplate:", () => {
    it("gets by id, if passed a guid", async () => {
      const getItemSpy = vi
        .spyOn(portalModule as any, "getItem")
        .mockResolvedValue(INITIATIVE_TEMPLATE_ITEM as any);
      const getItemDataSpy = vi
        .spyOn(portalModule as any, "getItemData")
        .mockResolvedValue(INITIATIVE_TEMPLATE_DATA as any);

      const chk = await fetchInitiativeTemplate(GUID, {
        authentication: MOCK_AUTH,
      } as any);
      expect(chk.id).toBe(GUID);
      expect(chk.owner).toBe(INITIATIVE_TEMPLATE_ITEM.owner);

      expect(getItemSpy).toHaveBeenCalledTimes(1);
      expect(getItemSpy.mock.calls[0][0]).toBe(GUID);
      expect(getItemDataSpy).toHaveBeenCalledTimes(1);
      expect(getItemDataSpy.mock.calls[0][0]).toBe(GUID);
    });

    it("gets without auth", async () => {
      const getItemSpy = vi
        .spyOn(portalModule as any, "getItem")
        .mockResolvedValue(INITIATIVE_TEMPLATE_ITEM as any);
      const getItemDataSpy = vi
        .spyOn(portalModule as any, "getItemData")
        .mockResolvedValue(INITIATIVE_TEMPLATE_DATA as any);
      const ro: IRequestOptions = {
        portal: "https://gis.myserver.com/portal/sharing/rest",
      } as any;
      const chk = await fetchInitiativeTemplate(GUID, ro as any);
      expect(chk.id).toBe(GUID);
      expect(chk.owner).toBe(INITIATIVE_TEMPLATE_ITEM.owner);
      expect(chk.thumbnailUrl).toBe(
        "https://gis.myserver.com/portal/sharing/rest/content/items/8b77674e43cf4bbd9ecad5189b3f1fdc/info/thumbnail/mock-thumbnail.png"
      );
      expect(getItemSpy).toHaveBeenCalledTimes(1);
      expect(getItemSpy.mock.calls[0][0]).toBe(GUID);
      expect(getItemDataSpy).toHaveBeenCalledTimes(1);
      expect(getItemDataSpy.mock.calls[0][0]).toBe(GUID);
    });

    it("gets by slug if not passed guid", async () => {
      const getItemBySlugSpy = vi
        .spyOn(slugUtils as any, "getItemBySlug")
        .mockResolvedValue(INITIATIVE_TEMPLATE_ITEM as any);
      const getItemDataSpy = vi
        .spyOn(portalModule as any, "getItemData")
        .mockResolvedValue(INITIATIVE_TEMPLATE_DATA as any);

      const chk = await fetchInitiativeTemplate("dcdev-34th-street", {
        authentication: MOCK_AUTH,
      } as any);
      expect(getItemBySlugSpy).toHaveBeenCalledTimes(1);
      expect(getItemBySlugSpy.mock.calls[0][0]).toBe("dcdev-34th-street");
      expect(getItemDataSpy).toHaveBeenCalledTimes(1);
      expect(getItemDataSpy.mock.calls[0][0]).toBe(GUID);
      expect(chk.id).toBe(GUID);
      expect(chk.owner).toBe(INITIATIVE_TEMPLATE_ITEM.owner);
    });

    it("returns null if no id found", async () => {
      const getItemBySlugSpy = vi
        .spyOn(slugUtils as any, "getItemBySlug")
        .mockResolvedValue(null as any);

      const chk = await fetchInitiativeTemplate("dcdev-34th-street", {
        authentication: MOCK_AUTH,
      } as any);
      expect(getItemBySlugSpy).toHaveBeenCalledTimes(1);
      expect(getItemBySlugSpy.mock.calls[0][0]).toBe("dcdev-34th-street");
      expect(chk).toEqual(null as unknown as IHubInitiativeTemplate);
    });
  });

  describe("enrichInitiativeTemplateSearchResult:", () => {
    let enrichmentSpy: any;
    let hubRo: IHubRequestOptions;
    beforeEach(() => {
      enrichmentSpy = vi
        .spyOn(FetchEnrichments as any, "fetchItemEnrichments")
        .mockResolvedValue({} as any);
      hubRo = {
        portal: "https://some-server.com/gis/sharing/rest",
      } as any;
    });
    it("converts item to search result", () => {
      const chk = enrichInitiativeTemplateSearchResult(
        cloneObject(INITIATIVE_TEMPLATE_ITEM as any),
        [],
        hubRo as any
      );

      expect(enrichmentSpy).toHaveBeenCalledTimes(0);

      const ITM = cloneObject(INITIATIVE_TEMPLATE_ITEM as any);
      expect(chk.access).toEqual(ITM.access);
      expect(chk.id).toEqual(ITM.id);
      expect(chk.type).toEqual(ITM.type);
      expect(chk.name).toEqual(ITM.title);
      expect(chk.owner).toEqual(ITM.owner);
      expect(chk.summary).toEqual(ITM.snippet);
      expect(chk.createdDate).toEqual(new Date(ITM.created));
      expect(chk.createdDateSource).toEqual("item.created");
      expect(chk.updatedDate).toEqual(new Date(ITM.modified));
      expect(chk.updatedDateSource).toEqual("item.modified");
      expect(chk.family).toEqual("template");
      expect(chk.tags).toEqual(ITM.tags);
      expect(chk.categories).toEqual(ITM.categories);
      expect(chk.links?.self).toEqual(
        "https://some-server.com/gis/home/item.html?id=" + String(ITM.id)
      );
      expect(chk.links?.siteRelative).toEqual(
        "/initiatives/templates/" + String(ITM.id) + "/about"
      );
      expect(chk.links?.thumbnail).toEqual(
        String(hubRo.portal) +
          "/content/items/" +
          String(ITM.id) +
          "/info/" +
          String((ITM.thumbnail as string) || "")
      );
      expect(chk.links?.workspaceRelative).toEqual(
        "/workspace/initiativeTemplates/" + String(ITM.id)
      );
    });
    it("uses description if snippet is undefined", () => {
      const itm = cloneObject(INITIATIVE_TEMPLATE_ITEM as any);
      itm.snippet = undefined;
      const chk = enrichInitiativeTemplateSearchResult(itm, [], hubRo as any);
      expect(chk.summary).toEqual(itm.description);
    });
    it("uses slug in site-relative link if defined", () => {
      const itm = cloneObject(INITIATIVE_TEMPLATE_ITEM as any);
      itm.properties = { slug: "myorg|my-slug" } as any;
      const chk = enrichInitiativeTemplateSearchResult(itm, [], hubRo as any);
      expect(chk.links?.siteRelative).toEqual(
        "/initiatives/templates/myorg::my-slug/about"
      );
    });
  });

  describe("convertItemToInitiativeTemplate", () => {
    it("converts the item correctly", async () => {
      const getItemDataSpy = vi
        .spyOn(portalModule as any, "getItemData")
        .mockResolvedValue(INITIATIVE_TEMPLATE_DATA as any);
      const chk = await convertItemToInitiativeTemplate(
        INITIATIVE_TEMPLATE_ITEM as any,
        MOCK_CONTEXT.requestOptions as any
      );
      expect(chk.previewUrl).toBe(
        "https://dog-house-qa-pre-a-hub.hubqa.arcgis.com"
      );
      expect(chk.siteSolutionId).toBe("c123");
      expect(chk.recommendedTemplates).toEqual(["c456"]);
      expect(getItemDataSpy).toHaveBeenCalledTimes(1);
    });
  });
});
