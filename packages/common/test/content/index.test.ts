import { IItem } from "@esri/arcgis-rest-portal";

import {
  cloneObject,
  enrichContentSearchResult,
  IHubLocation,
  IHubRequestOptions,
} from "../../src";
import * as FetchEnrichments from "../../src/items/_enrichments";
import * as Extent from "../../src/extent";

const LOCATION: IHubLocation = {
  type: "custom",
  geometries: [
    {
      xmin: -157.92997000002723,
      ymin: 17.069699999614166,
      xmax: -65.79849542073713,
      ymax: 53.57133351703125,
      spatialReference: {
        wkid: 4326,
      },
      type: "extent",
    } as any,
  ],
  spatialReference: {
    wkid: 4326,
  },
  extent: [
    [-157.92997000002723, 17.069699999614166],
    [-65.79849542073713, 53.57133351703125],
  ],
};

const FEATURE_SERVICE_ITEM: IItem = {
  id: "bbc0882d4713479c87bedcd6b3c41d1a",
  owner: "andrewstauffer",
  created: 1411060006000,
  modified: 1429562151000,
  guid: null,
  name: null,
  title: "  Lease Positions -  ",
  type: "Feature Service",
  typeKeywords: [
    "ArcGIS Server",
    "Data",
    "Feature Access",
    "Feature Service",
    "Service",
  ],
  description: "<div>Active Lease Positions</div>",
  tags: ["gaiaose", "leases", "railroads", "Greece"],
  snippet: null,
  thumbnail: "thumbnail/ago_downloaded.png",
  documentation: null,
  extent: [
    [20.9847, 37.0075],
    [26.6331, 41.7264],
  ],
  categories: ["category"],
  spatialReference: null,
  accessInformation: null,
  licenseInfo: null,
  culture: "en-us",
  properties: { location: LOCATION },
  advancedSettings: null,
  url: "http://gaiacloud.gaiaose.gr/arcgis/rest/services/Public/MisthoseisPlot/MapServer",
  proxyFilter: null,
  access: "public",
  size: -1,
  subInfo: 0,
  appCategories: [],
  industries: [],
  languages: [],
  largeThumbnail: null,
  banner: null,
  screenshots: [],
  listed: false,
  numComments: 4,
  numRatings: 0,
  avgRating: 0,
  numViews: 121,
  scoreCompleteness: 53,
  groupDesignations: null,
  contentOrigin: "other",
};

describe("content module:", () => {
  beforeAll(() => {
    // suppress deprecation warnings
    // tslint:disable-next-line: no-empty
    spyOn(console, "warn").and.callFake(() => {});
  });
  describe("enrichments:", () => {
    let enrichmentSpy: jasmine.Spy;
    let hubRo: IHubRequestOptions;
    beforeEach(() => {
      enrichmentSpy = spyOn(
        FetchEnrichments,
        "fetchItemEnrichments"
      ).and.callFake(() => {
        return Promise.resolve({
          server: {
            layers: [{ id: 1 }],
          },
        });
      });
      hubRo = {
        portal: "https://some-server.com/gis/sharing/rest",
      };
    });

    it("converts item to search result", async () => {
      const chk = await enrichContentSearchResult(
        cloneObject(FEATURE_SERVICE_ITEM),
        [],
        hubRo
      );

      expect(enrichmentSpy.calls.count()).toBe(
        0,
        "should not fetch enrichments"
      );

      // verify expected output
      const ITM = cloneObject(FEATURE_SERVICE_ITEM);
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
      expect(chk.family).toEqual("map");
      expect(chk.tags).toEqual(ITM.tags);
      expect(chk.categories).toEqual(ITM.categories);
      expect(chk.links.self).toEqual(
        `https://some-server.com/gis/home/item.html?id=${ITM.id}`
      );
      expect(chk.links.siteRelative).toEqual(`/maps/${ITM.id}`);
      expect(chk.links.thumbnail).toEqual(
        `${hubRo.portal}/content/items/${ITM.id}/info/${ITM.thumbnail}`
      );
      expect(chk.location).toEqual(LOCATION);
    });

    it("uses snippet if defined", async () => {
      const itm = cloneObject(FEATURE_SERVICE_ITEM);
      itm.snippet = "This should be used";
      const chk = await enrichContentSearchResult(itm, [], hubRo);
      expect(chk.summary).toEqual(itm.snippet);
    });

    it("fetches enrichments", async () => {
      const chk = await enrichContentSearchResult(
        cloneObject(FEATURE_SERVICE_ITEM),
        ["server.layers.length AS layerCount"],
        hubRo
      );

      // verify the response
      expect(chk.layerCount).toBe(1);

      // verify the spy
      expect(enrichmentSpy.calls.count()).toBe(1, "should fetch enrichments");
      const [item, enrichments, ro] = enrichmentSpy.calls.argsFor(0);
      expect(item).toEqual(FEATURE_SERVICE_ITEM);
      expect(enrichments).toEqual(["server"]);
      expect(ro).toBe(hubRo);
    });

    it("adds geometry to search result", async () => {
      const isBBoxSpy = spyOn(Extent, "isBBox").and.callThrough();
      const bBoxToExtentSpy = spyOn(Extent, "bBoxToExtent").and.callThrough();
      const extentToPolygonSpy = spyOn(
        Extent,
        "extentToPolygon"
      ).and.callThrough();
      const chk = await enrichContentSearchResult(
        cloneObject(FEATURE_SERVICE_ITEM),
        ["server.layers.length AS layerCount"],
        hubRo
      );
      expect(isBBoxSpy.calls.count()).toBe(
        1,
        "should call isBBoxSpy on item.extent"
      );
      expect(isBBoxSpy.calls.allArgs()[0]).toEqual([
        FEATURE_SERVICE_ITEM.extent,
      ]);
      expect(bBoxToExtentSpy.calls.count()).toBe(
        1,
        "should convert bbox to extent"
      );
      expect(bBoxToExtentSpy.calls.allArgs()[0]).toEqual([
        FEATURE_SERVICE_ITEM.extent,
      ]);
      expect(extentToPolygonSpy.calls.count()).toBe(
        1,
        "should call extentToPolygon"
      );
      expect(extentToPolygonSpy.calls.allArgs()[0]).toEqual([
        {
          xmin: 20.9847,
          ymin: 37.0075,
          xmax: 26.6331,
          ymax: 41.7264,
          spatialReference: { wkid: 4326 },
        },
      ]);
    });
  });
});
