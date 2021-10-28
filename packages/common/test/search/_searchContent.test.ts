import { UserSession } from "@esri/arcgis-rest-auth";
import * as Portal from "@esri/arcgis-rest-portal";
import {
  cloneObject,
  Filter,
  IHubSearchOptions,
  _searchContent,
} from "../../src";
import * as AggResponse from "../mocks/portal-search/response-with-aggregations.json";
import * as SimpleResponse from "../mocks/portal-search/simple-response.json";

describe("_searchContent:", () => {
  describe("portal:", () => {
    it("simple search", async () => {
      const searchItemsSpy = spyOn(Portal, "searchItems").and.callFake(() => {
        return Promise.resolve(cloneObject(SimpleResponse));
      });
      const f: Filter<"content"> = {
        filterType: "content",
        term: "water",
      };
      const opts: IHubSearchOptions = {};

      const res = await _searchContent(f, opts);

      expect(searchItemsSpy.calls.count()).toBe(1, "should call searchItems");
      const [expectedParams] = searchItemsSpy.calls.argsFor(0);
      // verify q
      expect(expectedParams.q).toEqual("water");
      // verify countFields
      expect(expectedParams.countFields).not.toBeDefined();
    });
    it("search with siteModel", async () => {
      const searchItemsSpy = spyOn(Portal, "searchItems").and.callFake(() => {
        return Promise.resolve(cloneObject(SimpleResponse));
      });
      const f: Filter<"content"> = {
        filterType: "content",
        term: "water",
      };
      const opts: IHubSearchOptions = {
        siteModel: {
          item: {
            url: "https://foo.com",
          } as Portal.IItem,
        },
      };

      const res = await _searchContent(f, opts);

      expect(searchItemsSpy.calls.count()).toBe(1, "should call searchItems");
      const [expectedParams] = searchItemsSpy.calls.argsFor(0);
      // verify q
      expect(expectedParams.q).toEqual("water");
      // verify countFields
      expect(expectedParams.countFields).not.toBeDefined();
      // verify the urls
      const content = res.results[0];
      expect(content.urls.relative).toContain("maps/");
      expect(content.urls.site).toContain("https://foo.com");
    });

    it("search with aggregations", async () => {
      const searchItemsSpy = spyOn(Portal, "searchItems").and.callFake(() => {
        return Promise.resolve(cloneObject(AggResponse));
      });
      const f: Filter<"content"> = {
        filterType: "content",
        term: "water",
      };
      const opts: IHubSearchOptions = {
        apis: ["arcgis"],
        aggregations: ["tags", "access"],
      };

      const res = await _searchContent(f, opts);

      expect(searchItemsSpy.calls.count()).toBe(1, "should call searchItems");
      const [expectedParams] = searchItemsSpy.calls.argsFor(0);
      // verify q
      expect(expectedParams.q).toEqual("water");
      // verify countFields
      expect(expectedParams.countFields).toEqual("tags,access");
      // verify Facets
      expect(res.facets).toBeDefined();
      expect(res.facets?.length).toBe(2, "should have two facets");
    });

    it("search with auth", async () => {
      const searchItemsSpy = spyOn(Portal, "searchItems").and.callFake(() => {
        return Promise.resolve(cloneObject(SimpleResponse));
      });
      const f: Filter<"content"> = {
        filterType: "content",
        term: "water",
      };
      const opts: IHubSearchOptions = {
        authentication: { fake: "auth" } as unknown as UserSession,
        num: 22,
      };

      const res = await _searchContent(f, opts);

      expect(searchItemsSpy.calls.count()).toBe(1, "should call searchItems");
      const [expectedParams] = searchItemsSpy.calls.argsFor(0);
      // verify q
      expect(expectedParams.q).toEqual("water");
      // verify num
      expect(expectedParams.num).toEqual(22);
      // verify auth
      expect(expectedParams.authentication).toBeDefined();
    });
  });

  describe("hub api: ", () => {
    it("simple search", async () => {
      const f: Filter<"content"> = {
        filterType: "content",
        term: "water",
      };
      const opts: IHubSearchOptions = {
        apis: ["hubQA"],
      };

      const res = await _searchContent(f, opts);

      // TODO: Add tests for real implementation
      expect(res.facets?.length).toEqual(0);
      expect(res.facets?.length).toEqual(0);
    });
  });
});
