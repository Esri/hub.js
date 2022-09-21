import { IItem } from "@esri/arcgis-rest-portal";

import {
  cloneObject,
  enrichPageSearchResult,
  IHubRequestOptions,
  IHubSearchResult,
} from "../../src";
import * as FetchEnrichments from "../../src/items/_enrichments";

const PAGE_ITEM: IItem = {
  id: "f995804e9e0e42cc84187258de0b710d",
  owner: "collabadmin7",
  created: 1592615052000,
  modified: 1592615052000,
  guid: null,
  name: null,
  title: "CDO Annual Goals",
  type: "Hub Page",
  typeKeywords: [
    "Hub",
    "hubPage",
    "JavaScript",
    "Map",
    "Mapping Site",
    "Online Map",
    "OpenData",
    "selfConfigured",
    "Web Map",
  ],
  description:
    "DO NOT DELETE OR MODIFY THIS ITEM. This item is managed by the ArcGIS Hub application. To make changes to this page, please visit https://hub.arcgis.com/admin/",
  tags: ["tag"],
  snippet: null,
  thumbnail: "thumbnail/foo.png",
  documentation: null,
  extent: [],
  categories: ["category"],
  spatialReference: null,
  accessInformation: null,
  licenseInfo: null,
  culture: "en-us",
  properties: {
    collaborationGroupId: "33280c225a1c4cc98834825e2e3c0433",
  },
  advancedSettings: null,
  url: "https://opendata.arcgis.com/admin/",
  proxyFilter: null,
  access: "public",
  size: -1,
  subInfo: 0,
  appCategories: ["[]"],
  industries: ["[]"],
  languages: ["[]"],
  largeThumbnail: null,
  banner: null,
  screenshots: [],
  listed: false,
  numComments: 0,
  numRatings: 0,
  avgRating: 0,
  numViews: 136,
  scoreCompleteness: 26,
  groupDesignations: null,
  contentOrigin: "other",
};

describe("HubPages Module", () => {
  describe("enrichments:", () => {
    let enrichmentSpy: jasmine.Spy;
    let hubRo: IHubRequestOptions;
    beforeEach(() => {
      enrichmentSpy = spyOn(
        FetchEnrichments,
        "fetchItemEnrichments"
      ).and.callFake(() => {
        return Promise.resolve({
          data: {
            sites: [{ id: 1 }],
          },
        });
      });
      hubRo = {
        portal: "https://some-server.com/gis/sharing/rest",
      };
    });

    it("converts item to search result", async () => {
      const chk = await enrichPageSearchResult(
        cloneObject(PAGE_ITEM),
        [],
        hubRo
      );

      expect(enrichmentSpy.calls.count()).toBe(
        0,
        "should not fetch enrichments"
      );

      // verify expected output
      const ITM = cloneObject(PAGE_ITEM);
      expect(chk.access).toEqual(ITM.access);
      expect(chk.id).toEqual(ITM.id);
      expect(chk.type).toEqual(ITM.type);
      expect(chk.name).toEqual(ITM.title);
      expect(chk.owner).toEqual(ITM.owner);
      expect(chk.summary).toEqual(ITM.description);
      expect(chk.createdDate).toEqual(new Date(ITM.created));
      expect(chk.createdDateSource).toEqual("item.created");
      expect(chk.updatedDate).toEqual(new Date(ITM.modified));
      expect(chk.updatedDateSource).toEqual("item.modified");
      expect(chk.family).toEqual("document");
      expect(chk.tags).toEqual(ITM.tags);
      expect(chk.categories).toEqual(ITM.categories);
      expect(chk.links.self).toEqual(
        `https://some-server.com/gis/home/item.html?id=${ITM.id}`
      );
      expect(chk.links.siteRelative).toEqual(`/pages/${ITM.id}`);
      expect(chk.links.thumbnail).toEqual(
        `${hubRo.portal}/content/items/${ITM.id}/info/${ITM.thumbnail}`
      );
    });
    it("uses snippet if defined", async () => {
      const itm = cloneObject(PAGE_ITEM);
      itm.snippet = "This should be used";
      const chk = await enrichPageSearchResult(itm, [], hubRo);
      expect(chk.summary).toEqual(itm.snippet);
    });

    it("fetches enrichments", async () => {
      const chk = await enrichPageSearchResult(
        cloneObject(PAGE_ITEM),
        ["data.sites.length AS siteCount"],
        hubRo
      );

      // verify the response
      expect(chk.siteCount).toBe(1);

      // verify the spy
      expect(enrichmentSpy.calls.count()).toBe(1, "should fetch enrichments");
      const [item, enrichments, ro] = enrichmentSpy.calls.argsFor(0);
      expect(item).toEqual(PAGE_ITEM);
      expect(enrichments).toEqual(["data"]);
      expect(ro).toBe(hubRo);
    });
  });
});
