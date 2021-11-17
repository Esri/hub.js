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
import { MOCK_AUTH } from "../mocks/mock-auth";

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
    it("simple search enterprise", async () => {
      const searchItemsSpy = spyOn(Portal, "searchItems").and.callFake(() => {
        return Promise.resolve(cloneObject(SimpleResponse));
      });
      const f: Filter<"content"> = {
        filterType: "content",
        term: "water",
      };
      const opts: IHubSearchOptions = {
        api: {
          type: "arcgis",
          url: "https://my-portal.com/gis",
        },
      };

      const res = await _searchContent(f, opts);

      expect(searchItemsSpy.calls.count()).toBe(1, "should call searchItems");
      const [expectedParams] = searchItemsSpy.calls.argsFor(0);
      // verify q
      expect(expectedParams.q).toEqual("water");
      expect(expectedParams.portal).toEqual(
        "https://my-portal.com/gis/sharing/rest"
      );
      // verify countFields
      expect(expectedParams.countFields).not.toBeDefined();
    });
    it("simple search next", async () => {
      const searchItemsSpy = spyOn(Portal, "searchItems").and.callFake(() => {
        return Promise.resolve(cloneObject(SimpleResponse));
      });
      const f: Filter<"content"> = {
        filterType: "content",
        term: "water",
      };
      const opts: IHubSearchOptions = {};

      const res = await _searchContent(f, opts);
      await res.next();
      expect(searchItemsSpy.calls.count()).toBe(2, "should call searchItems");
      const [expectedParams] = searchItemsSpy.calls.argsFor(1);
      // verify q
      expect(expectedParams.q).toEqual("water");
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
        site: {
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

    it("search with aggregations and sorting", async () => {
      const searchItemsSpy = spyOn(Portal, "searchItems").and.callFake(() => {
        return Promise.resolve(cloneObject(AggResponse));
      });
      const f: Filter<"content"> = {
        filterType: "content",
        term: "water",
      };
      const opts: IHubSearchOptions = {
        api: "arcgis",
        aggregations: ["tags", "access"],
        sortField: "title",
        sortOrder: "desc",
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
        authentication: MOCK_AUTH,
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
    it("next with auth", async () => {
      const searchItemsSpy = spyOn(Portal, "searchItems").and.callFake(() => {
        return Promise.resolve(cloneObject(SimpleResponse));
      });
      const f: Filter<"content"> = {
        filterType: "content",
        term: "water",
      };
      const opts: IHubSearchOptions = {
        authentication: MOCK_AUTH,
      };

      const res = await _searchContent(f, opts);
      await res.next(opts.authentication);
      expect(searchItemsSpy.calls.count()).toBe(2, "should call searchItems");
      const [expectedParams] = searchItemsSpy.calls.argsFor(1);
      // verify q
      expect(expectedParams.q).toEqual("water");
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
        api: "hubQA",
      };

      const res = await _searchContent(f, opts);

      // TODO: Add tests for real implementation
      expect(res.facets?.length).toEqual(0);
      expect(res.facets?.length).toEqual(0);
    });
    it("next", async () => {
      const f: Filter<"content"> = {
        filterType: "content",
        term: "water",
      };
      const opts: IHubSearchOptions = {
        api: "hubQA",
      };

      const res = await _searchContent(f, opts);
      const res2 = await res.next();
      expect(res2).not.toBeDefined();
      // TODO: Add tests for real implementation
      expect(res.facets?.length).toEqual(0);
      expect(res.facets?.length).toEqual(0);
    });
  });
});
