import {
  HubEntityStatus,
  IHubProject,
  IHubRequestOptions,
  cloneObject,
  enrichProjectSearchResult,
  fetchProject,
} from "../../src";
import { GUID, PROJECT_DATA, PROJECT_ITEM, PROJECT_LOCATION } from "./fixtures";
import { MOCK_AUTH } from "../mocks/mock-auth";
import { IRequestOptions } from "@esri/arcgis-rest-request";
import * as portalModule from "@esri/arcgis-rest-portal";
import * as slugUtils from "../../src/items/slugs";
import * as FetchEnrichments from "../../src/items/_enrichments";

describe("project fetch module:", () => {
  describe("fetchProject:", () => {
    it("gets by id, if passed a guid", async () => {
      const getItemSpy = spyOn(portalModule, "getItem").and.returnValue(
        Promise.resolve(PROJECT_ITEM)
      );
      const getItemDataSpy = spyOn(portalModule, "getItemData").and.returnValue(
        Promise.resolve(PROJECT_DATA)
      );

      const chk = await fetchProject(GUID, {
        authentication: MOCK_AUTH,
      });
      expect(chk.id).toBe(GUID);
      expect(chk.owner).toBe(PROJECT_ITEM.owner);
      expect(chk.location).toEqual(PROJECT_LOCATION);
      // protected and recycling pass through
      expect(chk.canRecycle).toBe(PROJECT_ITEM.canRecycle);
      expect(chk.protected).toBe(PROJECT_ITEM.protected);

      expect(getItemSpy.calls.count()).toBe(1);
      expect(getItemSpy.calls.argsFor(0)[0]).toBe(GUID);
      expect(getItemDataSpy.calls.count()).toBe(1);
      expect(getItemDataSpy.calls.argsFor(0)[0]).toBe(GUID);
    });

    it("gets without auth", async () => {
      const getItemSpy = spyOn(portalModule, "getItem").and.returnValue(
        Promise.resolve(PROJECT_ITEM)
      );
      const getItemDataSpy = spyOn(portalModule, "getItemData").and.returnValue(
        Promise.resolve(PROJECT_DATA)
      );
      const ro: IRequestOptions = {
        portal: "https://gis.myserver.com/portal/sharing/rest",
      };
      const chk = await fetchProject(GUID, ro);
      expect(chk.id).toBe(GUID);
      expect(chk.owner).toBe(PROJECT_ITEM.owner);
      expect(chk.thumbnailUrl).toBe(
        "https://gis.myserver.com/portal/sharing/rest/content/items/9b77674e43cf4bbd9ecad5189b3f1fdc/info/thumbnail/mock-thumbnail.png"
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
      ).and.returnValue(Promise.resolve(PROJECT_ITEM));
      const getItemDataSpy = spyOn(portalModule, "getItemData").and.returnValue(
        Promise.resolve(PROJECT_DATA)
      );

      const chk = await fetchProject("dcdev-34th-street", {
        authentication: MOCK_AUTH,
      });
      expect(getItemBySlugSpy.calls.count()).toBe(1);
      expect(getItemBySlugSpy.calls.argsFor(0)[0]).toBe("dcdev-34th-street");
      expect(getItemDataSpy.calls.count()).toBe(1);
      expect(getItemDataSpy.calls.argsFor(0)[0]).toBe(GUID);
      expect(chk.id).toBe(GUID);
      expect(chk.owner).toBe(PROJECT_ITEM.owner);
    });

    it("returns null if no id found", async () => {
      const getItemBySlugSpy = spyOn(
        slugUtils,
        "getItemBySlug"
      ).and.returnValue(Promise.resolve(null));

      const chk = await fetchProject("dcdev-34th-street", {
        authentication: MOCK_AUTH,
      });
      expect(getItemBySlugSpy.calls.count()).toBe(1);
      expect(getItemBySlugSpy.calls.argsFor(0)[0]).toBe("dcdev-34th-street");
      // This next stuff is O_o but req'd by typescript
      expect(chk).toEqual(null as unknown as IHubProject);
    });
  });

  describe("enrichProjectSearchResult:", () => {
    let enrichmentSpy: jasmine.Spy;
    let hubRo: IHubRequestOptions;
    beforeEach(() => {
      enrichmentSpy = spyOn(
        FetchEnrichments,
        "fetchItemEnrichments"
      ).and.callFake(() => {
        return Promise.resolve({
          data: {
            status: HubEntityStatus.inProgress,
          },
        });
      });
      hubRo = {
        portal: "https://some-server.com/gis/sharing/rest",
      };
    });
    it("converts item to search result", async () => {
      const chk = await enrichProjectSearchResult(
        cloneObject(PROJECT_ITEM),
        [],
        hubRo
      );

      expect(enrichmentSpy.calls.count()).toBe(
        0,
        "should not fetch enrichments"
      );

      // verify expected output
      const ITM = cloneObject(PROJECT_ITEM);
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
      expect(chk.family).toEqual("project");
      expect(chk.tags).toEqual(ITM.tags);
      expect(chk.categories).toEqual(ITM.categories);
      expect(chk.links?.self).toEqual(
        `https://some-server.com/gis/home/item.html?id=${ITM.id}`
      );
      expect(chk.links?.siteRelative).toEqual(`/projects/${ITM.id}`);
      expect(chk.links?.thumbnail).toEqual(
        `${hubRo.portal}/content/items/${ITM.id}/info/${ITM.thumbnail}`
      );
      expect(chk.links?.workspaceRelative).toEqual(
        `/workspace/projects/${ITM.id}`
      );
    });
    it("uses description if snippet is undefined", async () => {
      const itm = cloneObject(PROJECT_ITEM);
      itm.snippet = undefined;
      const chk = await enrichProjectSearchResult(itm, [], hubRo);
      expect(chk.summary).toEqual(itm.description);
    });
    it("uses slug in site-relative link if defined", async () => {
      const itm = cloneObject(PROJECT_ITEM);
      itm.properties = { slug: "myorg|my-slug" };
      const chk = await enrichProjectSearchResult(itm, [], hubRo);
      expect(chk.links?.siteRelative).toEqual("/projects/myorg::my-slug");
    });
    it("fetches enrichments", async () => {
      const chk = await enrichProjectSearchResult(
        cloneObject(PROJECT_ITEM),
        ["data.status AS projectStatus"],
        hubRo
      );

      // verify the response
      expect(chk.projectStatus).toBe(HubEntityStatus.inProgress);

      // verify the spy
      expect(enrichmentSpy.calls.count()).toBe(1, "should fetch enrichments");
      const [item, enrichments, ro] = enrichmentSpy.calls.argsFor(0);
      expect(item).toEqual(PROJECT_ITEM);
      expect(enrichments).toEqual(["data"]);
      expect(ro).toBe(hubRo);
    });
  });
});
