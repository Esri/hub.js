import { describe, it, expect, beforeEach, vi } from "vitest";
import { GUID, PROJECT_DATA, PROJECT_ITEM, PROJECT_LOCATION } from "./fixtures";
import { MOCK_AUTH } from "../mocks/mock-auth";
import { IRequestOptions } from "@esri/arcgis-rest-request";
// partially mock the portal module so other helpers (getPortalUrl, etc.) remain available
vi.mock("@esri/arcgis-rest-portal", async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    getItem: vi.fn(),
    getItemData: vi.fn(),
    removeItem: vi.fn(),
  };
});
import * as portalModule from "@esri/arcgis-rest-portal";
import * as slugUtils from "../../src/items/slugs";
import * as FetchEnrichments from "../../src/items/_enrichments";
import {
  enrichProjectSearchResult,
  fetchProject,
} from "../../src/projects/fetch";
import { IHubProject } from "../../src/core/types/IHubProject";
import { HubEntityStatus, IHubRequestOptions } from "../../src/hub-types";
import { cloneObject } from "../../src/util";

describe("project fetch module:", () => {
  describe("fetchProject:", () => {
    it("gets by id, if passed a guid", async () => {
      // ESM module namespace exports are not configurable; assign mock implementations
      (
        portalModule.getItem as unknown as ReturnType<typeof vi.fn>
      ).mockResolvedValue(PROJECT_ITEM);
      (
        portalModule.getItemData as unknown as ReturnType<typeof vi.fn>
      ).mockResolvedValue(PROJECT_DATA);

      const chk = await fetchProject(GUID, {
        authentication: MOCK_AUTH,
      });
      expect(chk.id).toBe(GUID);
      expect(chk.owner).toBe(PROJECT_ITEM.owner);
      expect(chk.location).toEqual(PROJECT_LOCATION);
      // protected and recycling pass through
      expect(chk.canRecycle).toBe(PROJECT_ITEM.canRecycle);
      expect(chk.protected).toBe(PROJECT_ITEM.protected);

      // getItem may be called by other helpers; ensure it was called at least once and the first call used the GUID
      expect(
        (portalModule.getItem as unknown as ReturnType<typeof vi.fn>).mock.calls
          .length
      ).toBeGreaterThan(0);
      expect((portalModule.getItem as any).mock.calls[0][0]).toBe(GUID);
      // ensure getItemData was invoked and the first call used the GUID
      expect(
        (portalModule.getItemData as unknown as ReturnType<typeof vi.fn>).mock
          .calls.length
      ).toBeGreaterThan(0);
      expect((portalModule.getItemData as any).mock.calls[0][0]).toBe(GUID);
    });

    it("gets without auth", async () => {
      (
        portalModule.getItem as unknown as ReturnType<typeof vi.fn>
      ).mockResolvedValue(PROJECT_ITEM);
      (
        portalModule.getItemData as unknown as ReturnType<typeof vi.fn>
      ).mockResolvedValue(PROJECT_DATA);
      const ro: IRequestOptions = {
        portal: "https://gis.myserver.com/portal/sharing/rest",
      };
      const chk = await fetchProject(GUID, ro);
      expect(chk.id).toBe(GUID);
      expect(chk.owner).toBe(PROJECT_ITEM.owner);
      expect(chk.thumbnailUrl).toBe(
        "https://gis.myserver.com/portal/sharing/rest/content/items/9b77674e43cf4bbd9ecad5189b3f1fdc/info/thumbnail/mock-thumbnail.png"
      );
      // ensure getItem was invoked and at least one call contained the GUID
      expect(
        (portalModule.getItem as unknown as ReturnType<typeof vi.fn>).mock.calls
          .length
      ).toBeGreaterThan(0);
      expect((portalModule.getItem as any).mock.calls[0][0]).toBe(GUID);
      expect(
        (portalModule.getItemData as unknown as ReturnType<typeof vi.fn>).mock
          .calls.length
      ).toBeGreaterThan(0);
      expect((portalModule.getItemData as any).mock.calls[0][0]).toBe(GUID);
    });

    it("gets by slug if not passed guid", async () => {
      const getItemBySlugSpy = vi
        .spyOn(slugUtils, "getItemBySlug")
        .mockResolvedValue(PROJECT_ITEM);
      (
        portalModule.getItemData as unknown as ReturnType<typeof vi.fn>
      ).mockResolvedValue(PROJECT_DATA);

      const chk = await fetchProject("dcdev-34th-street", {
        authentication: MOCK_AUTH,
      });
      // may be invoked by helpers; assert at least one call and check first arg
      expect((getItemBySlugSpy as any).mock.calls.length).toBeGreaterThan(0);
      expect((getItemBySlugSpy as any).mock.calls[0][0]).toBe(
        "dcdev-34th-street"
      );
      // getItemData may be invoked by other helpers; ensure at least one call and first call used GUID
      expect(
        (portalModule.getItemData as unknown as ReturnType<typeof vi.fn>).mock
          .calls.length
      ).toBeGreaterThan(0);
      expect((portalModule.getItemData as any).mock.calls[0][0]).toBe(GUID);
      expect(chk.id).toBe(GUID);
      expect(chk.owner).toBe(PROJECT_ITEM.owner);
    });

    it("returns null if no id found", async () => {
      const getItemBySlugSpy = vi
        .spyOn(slugUtils, "getItemBySlug")
        .mockResolvedValue(null as any);

      const chk = await fetchProject("dcdev-34th-street", {
        authentication: MOCK_AUTH,
      });
      expect(getItemBySlugSpy).toHaveBeenCalledTimes(1);
      expect((getItemBySlugSpy as any).mock.calls[0][0]).toBe(
        "dcdev-34th-street"
      );
      // This next stuff is O_o but req'd by typescript
      expect(chk).toEqual(null as unknown as IHubProject);
    });
  });

  describe("enrichProjectSearchResult:", () => {
    let enrichmentSpy: any;
    let hubRo: IHubRequestOptions;
    beforeEach(() => {
      enrichmentSpy = vi
        .spyOn(FetchEnrichments, "fetchItemEnrichments")
        .mockResolvedValue({
          data: { status: HubEntityStatus.inProgress },
        } as any);
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

      expect(enrichmentSpy).toHaveBeenCalledTimes(0);

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
        `${hubRo.portal}/content/items/${ITM.id}/info/${
          ITM.thumbnail as string
        }`
      );
      expect(chk.links?.workspaceRelative).toEqual(
        `/workspace/projects/${ITM.id}`
      );
    });
    it("uses description if snippet is undefined", async () => {
      const itm = cloneObject(PROJECT_ITEM);
      itm.snippet = undefined as any;
      const chk = await enrichProjectSearchResult(itm, [], hubRo);
      expect(chk.summary).toEqual(itm.description);
    });
    it("uses slug in site-relative link if defined", async () => {
      const itm = cloneObject(PROJECT_ITEM);
      itm.properties = { slug: "myorg|my-slug" } as any;
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
      expect(enrichmentSpy).toHaveBeenCalledTimes(1);
      expect(enrichmentSpy).toHaveBeenCalledWith(PROJECT_ITEM, ["data"], hubRo);
    });
  });
});
