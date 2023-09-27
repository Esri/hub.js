import {
  IHubInitiativeTemplate,
  IHubRequestOptions,
  enrichInitiativeTemplateSearchResult,
  cloneObject,
} from "../../src";
import {
  convertItemToInitiativeTemplate,
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

describe("initiative template fetch module:", () => {
  describe("fetchInitiativeTemplate:", () => {
    it("gets by id, if passed a guid", async () => {
      const getItemSpy = spyOn(portalModule, "getItem").and.returnValue(
        Promise.resolve(INITIATIVE_TEMPLATE_ITEM)
      );
      const getItemDataSpy = spyOn(portalModule, "getItemData").and.returnValue(
        Promise.resolve(INITIATIVE_TEMPLATE_DATA)
      );

      const chk = await fetchInitiativeTemplate(GUID, {
        authentication: MOCK_AUTH,
      });
      expect(chk.id).toBe(GUID);
      expect(chk.owner).toBe(INITIATIVE_TEMPLATE_ITEM.owner);

      expect(getItemSpy.calls.count()).toBe(1);
      expect(getItemSpy.calls.argsFor(0)[0]).toBe(GUID);
      expect(getItemDataSpy.calls.count()).toBe(1);
      expect(getItemDataSpy.calls.argsFor(0)[0]).toBe(GUID);
    });

    it("gets without auth", async () => {
      const getItemSpy = spyOn(portalModule, "getItem").and.returnValue(
        Promise.resolve(INITIATIVE_TEMPLATE_ITEM)
      );
      const getItemDataSpy = spyOn(portalModule, "getItemData").and.returnValue(
        Promise.resolve(INITIATIVE_TEMPLATE_DATA)
      );
      const ro: IRequestOptions = {
        portal: "https://gis.myserver.com/portal/sharing/rest",
      };
      const chk = await fetchInitiativeTemplate(GUID, ro);
      expect(chk.id).toBe(GUID);
      expect(chk.owner).toBe(INITIATIVE_TEMPLATE_ITEM.owner);
      expect(chk.thumbnailUrl).toBe(
        "https://gis.myserver.com/portal/sharing/rest/content/items/8b77674e43cf4bbd9ecad5189b3f1fdc/info/thumbnail/mock-thumbnail.png"
      );
      expect(getItemSpy.calls.count()).toBe(1);
      expect(getItemSpy.calls.argsFor(0)[0]).toBe(GUID);
      expect(getItemDataSpy.calls.count()).toBe(1);
      expect(getItemDataSpy.calls.argsFor(0)[0]).toBe(GUID);
    });

    it("gets by slug if not passed guid", async () => {
      const getItemBySlugSpy = spyOn(
        slugUtils,
        "getItemBySlug"
      ).and.returnValue(Promise.resolve(INITIATIVE_TEMPLATE_ITEM));
      const getItemDataSpy = spyOn(portalModule, "getItemData").and.returnValue(
        Promise.resolve(INITIATIVE_TEMPLATE_DATA)
      );

      const chk = await fetchInitiativeTemplate("dcdev-34th-street", {
        authentication: MOCK_AUTH,
      });
      expect(getItemBySlugSpy.calls.count()).toBe(1);
      expect(getItemBySlugSpy.calls.argsFor(0)[0]).toBe("dcdev-34th-street");
      expect(getItemDataSpy.calls.count()).toBe(1);
      expect(getItemDataSpy.calls.argsFor(0)[0]).toBe(GUID);
      expect(chk.id).toBe(GUID);
      expect(chk.owner).toBe(INITIATIVE_TEMPLATE_ITEM.owner);
    });

    it("returns null if no id found", async () => {
      const getItemBySlugSpy = spyOn(
        slugUtils,
        "getItemBySlug"
      ).and.returnValue(Promise.resolve(null));

      const chk = await fetchInitiativeTemplate("dcdev-34th-street", {
        authentication: MOCK_AUTH,
      });
      expect(getItemBySlugSpy.calls.count()).toBe(1);
      expect(getItemBySlugSpy.calls.argsFor(0)[0]).toBe("dcdev-34th-street");
      // This next stuff is O_o but req'd by typescript
      expect(chk).toEqual(null as unknown as IHubInitiativeTemplate);
    });
  });

  describe("enrichInitiativeTemplateSearchResult:", () => {
    let enrichmentSpy: jasmine.Spy;
    let hubRo: IHubRequestOptions;
    beforeEach(() => {
      enrichmentSpy = spyOn(
        FetchEnrichments,
        "fetchItemEnrichments"
      ).and.callFake(() => {
        return Promise.resolve({});
      });
      hubRo = {
        portal: "https://some-server.com/gis/sharing/rest",
      };
    });
    it("converts item to search result", async () => {
      const chk = await enrichInitiativeTemplateSearchResult(
        cloneObject(INITIATIVE_TEMPLATE_ITEM),
        [],
        hubRo
      );

      expect(enrichmentSpy.calls.count()).toBe(
        0,
        "should not fetch enrichments"
      );

      // verify expected output
      const ITM = cloneObject(INITIATIVE_TEMPLATE_ITEM);
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
        `https://some-server.com/gis/home/item.html?id=${ITM.id}`
      );
      expect(chk.links?.siteRelative).toEqual(
        `/initiatives/templates/${ITM.id}/about`
      );
      expect(chk.links?.thumbnail).toEqual(
        `${hubRo.portal}/content/items/${ITM.id}/info/${ITM.thumbnail}`
      );
      expect(chk.links?.workspaceRelative).toEqual(
        `/workspace/initiativeTemplates/${ITM.id}`
      );
    });
    it("uses description if snippet is undefined", async () => {
      const itm = cloneObject(INITIATIVE_TEMPLATE_ITEM);
      itm.snippet = undefined;
      const chk = await enrichInitiativeTemplateSearchResult(itm, [], hubRo);
      expect(chk.summary).toEqual(itm.description);
    });
    it("uses slug in site-relative link if defined", async () => {
      const itm = cloneObject(INITIATIVE_TEMPLATE_ITEM);
      itm.properties = { slug: "myorg|my-slug" };
      const chk = await enrichInitiativeTemplateSearchResult(itm, [], hubRo);
      expect(chk.links?.siteRelative).toEqual(
        "/initiatives/templates/myorg::my-slug/about"
      );
    });
    // it("fetches enrichments", async () => {
    //   const chk = await enrichInitiativeTemplateSearchResult(
    //     cloneObject(INITIATIVE_TEMPLATE_ITEM),
    //     ["data.previewUrl AS https://fake-url.arcgis.com"],
    //     hubRo
    //   );

    //   // verify the response
    //   expect(chk.previewUrl).toBe('https://fake-url.arcgis.com');

    //   // verify the spy
    //   expect(enrichmentSpy.calls.count()).toBe(1, "should fetch enrichments");
    //   const [item, enrichments, ro] = enrichmentSpy.calls.argsFor(0);
    //   expect(item).toEqual(INITIATIVE_TEMPLATE_ITEM);
    //   expect(enrichments).toEqual(["data"]);
    //   expect(ro).toBe(hubRo);
    // });
  });

  describe("convertItemToInitiativeTemplate", () => {
    it("converts the item correctly", async () => {
      const getItemDataSpy = spyOn(portalModule, "getItemData").and.returnValue(
        Promise.resolve(INITIATIVE_TEMPLATE_DATA)
      );
      const chk = await convertItemToInitiativeTemplate(
        INITIATIVE_TEMPLATE_ITEM,
        MOCK_CONTEXT.requestOptions
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
