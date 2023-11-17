import {
  cloneObject,
  IFilter,
  IHubRequestOptions,
  IHubSearchOptions,
  IHubSearchResponse,
  IHubSearchResult,
  IPredicate,
  IQuery,
} from "../../../src";

import { UserSession } from "@esri/arcgis-rest-auth";

import {
  formatPredicate,
  formatFilterBlock,
  getFilterQueryParam,
} from "../../../src/search/_internal/hubSearchItemsHelpers/getFilterQueryParam";
import {
  getOgcItemQueryParams,
  IOgcItemQueryParams,
} from "../../../src/search/_internal/hubSearchItemsHelpers/getOgcItemQueryParams";
import { getQueryString } from "../../../src/search/_internal/hubSearchItemsHelpers/getQueryString";
import { getOgcAggregationQueryParams } from "../../../src/search/_internal/hubSearchItemsHelpers/getOgcAggregationQueryParams";
import { getQQueryParam } from "../../../src/search/_internal/hubSearchItemsHelpers/getQQueryParam";
import { IOgcItem } from "../../../src/search/_internal/hubSearchItemsHelpers/interfaces";
import * as ogcItemToSearchResultModule from "../../../src/search/_internal/hubSearchItemsHelpers/ogcItemToSearchResult";
import { formatOgcItemsResponse } from "../../../src/search/_internal/hubSearchItemsHelpers/formatOgcItemsResponse";
import { formatOgcAggregationsResponse } from "../../../src/search/_internal/hubSearchItemsHelpers/formatOgcAggregationsResponse";
import * as searchOgcItemsModule from "../../../src/search/_internal/hubSearchItemsHelpers/searchOgcItems";
import * as portalSearchItemsModule from "../../../src/search/_internal/portalSearchItems";
import * as fetchMock from "fetch-mock";
import {
  ogcItemsResponse,
  ogcItemsResponseWithNext,
} from "./mocks/ogcItemsResponse";
import { ogcAggregationsResponse } from "./mocks/ogcAggregationsResponse";
import * as getNextOgcCallbackModule from "../../../src/search/_internal/hubSearchItemsHelpers/getNextOgcCallback";
import { hubSearchItems } from "../../../src/search/_internal/hubSearchItems";
import { ogcApiRequest } from "../../../src/search/_internal/hubSearchItemsHelpers/ogcApiRequest";
import { getOgcCollectionUrl } from "../../../src/search/_internal/hubSearchItemsHelpers/getOgcCollectionUrl";
import { getSortByQueryParam } from "../../../src/search/_internal/hubSearchItemsHelpers/getSortByQueryParam";

describe("hubSearchItems Module |", () => {
  describe("Request Transformation Helpers |", () => {
    describe("getOgcCollectionUrl", () => {
      it("defaults to the all collection if a collection id is not present", () => {
        const query: IQuery = {
          targetEntity: "item",
          filters: [],
        };
        const options: IHubSearchOptions = {
          api: {
            type: "arcgis-hub",
            url: "https://my-hub.com/api/search/v1",
          },
        };
        const result = getOgcCollectionUrl(query, options);
        expect(result).toBe("https://my-hub.com/api/search/v1/collections/all");
      });
      it("points to the provided collection if a collection id is present", () => {
        const query: IQuery = {
          targetEntity: "item",
          collection: "dataset",
          filters: [],
        };
        const options: IHubSearchOptions = {
          api: {
            type: "arcgis-hub",
            url: "https://my-hub.com/api/search/v1",
          },
        };
        const result = getOgcCollectionUrl(query, options);
        expect(result).toBe(
          "https://my-hub.com/api/search/v1/collections/dataset"
        );
      });
    });

    describe("formatPredicate |", () => {
      it("handles a date range predicate", () => {
        const predicate = {
          modified: {
            to: 3,
            from: 1,
          },
        };
        const result = formatPredicate(predicate);
        expect(result).toEqual("(modified BETWEEN 1 AND 3)");
      });

      it("handles a simple predicate", () => {
        const predicate = {
          type: "typeA",
        };
        const result = formatPredicate(predicate);
        expect(result).toEqual("(type=typeA)");
      });

      it("handles a boolean predicate", () => {
        const predicate = {
          openData: false,
        };
        const result = formatPredicate(predicate);
        expect(result).toEqual("(openData=false)");
      });

      it("handles a simple multi-predicate", () => {
        const predicate = {
          type: "typeA",
          tags: "tag A",
        };
        const result = formatPredicate(predicate);
        expect(result).toEqual("(type=typeA AND tags='tag A')");
      });

      it("ignores 'term' predicates", () => {
        const predicate = {
          type: "typeA",
          term: "termA",
        };
        const result = formatPredicate(predicate);
        expect(result).toEqual("(type=typeA)");
      });

      it("handles a string array", () => {
        const predicate = {
          type: ["typeA", "type B"],
        };
        const result = formatPredicate(predicate);
        expect(result).toEqual("(type IN (typeA, 'type B'))");
      });

      it("handles a multiple string arrays", () => {
        const predicate = {
          type: ["typeA", "type B"],
          tags: ["tagA", "tag B"],
        };
        const result = formatPredicate(predicate);
        expect(result).toEqual(
          "(type IN (typeA, 'type B') AND tags IN (tagA, 'tag B'))"
        );
      });

      it("handles a complex predicate with an anys array", () => {
        const predicate = {
          type: {
            any: ["typeA", "type B"],
          },
        };
        const result = formatPredicate(predicate);
        expect(result).toEqual("(type IN (typeA, 'type B'))");
      });

      it("handles a complex predicate with an anys string", () => {
        const predicate = {
          type: {
            any: "typeA",
          },
        };
        const result = formatPredicate(predicate);
        expect(result).toEqual("(type=typeA)");
      });

      it("handles a complex predicate with an alls string", () => {
        const predicate = {
          tags: {
            all: "tagC",
          },
        };
        const result = formatPredicate(predicate);
        expect(result).toEqual("(tags=tagC)");
      });

      it("handles a complex predicate with anys array and alls array", () => {
        const predicate = {
          tags: {
            any: ["tagA", "tag B"],
            all: ["tagC", "tag D"],
          },
        };
        const result = formatPredicate(predicate);
        expect(result).toEqual(
          "(tags IN (tagA, 'tag B') AND tags=tagC AND tags='tag D')"
        );
      });

      it("handles a complex predicate with a nots string", () => {
        const predicate = {
          tags: {
            not: "tagA",
          },
        };
        const result = formatPredicate(predicate);
        expect(result).toEqual("(tags NOT IN (tagA))");
      });

      it("handles a complex predicate with anys array, alls array and nots array", () => {
        const predicate = {
          tags: {
            any: ["tag A", "tagB"],
            all: ["tag C", "tagD"],
            not: ["tag E", "tagF"],
          },
        };
        const result = formatPredicate(predicate);
        expect(result).toEqual(
          "(tags IN ('tag A', tagB) AND tags='tag C' AND tags=tagD AND tags NOT IN ('tag E', tagF))"
        );
      });

      it("handles multiple complex predicates", () => {
        const predicate = {
          tags: {
            any: ["tag A", "tagB"],
            all: ["tag C", "tagD"],
          },
          type: {
            any: ["type A", "typeB"],
            not: ["type C", "typeD"],
          },
        };
        const result = formatPredicate(predicate);
        expect(result).toEqual(
          "(" +
            "tags IN ('tag A', tagB) AND tags='tag C' AND tags=tagD" +
            " AND " +
            "type IN ('type A', typeB) AND type NOT IN ('type C', typeD)" +
            ")"
        );
      });

      it("handles all 3 kinds of predicates", () => {
        const predicate = {
          type: "type A",
          tags: ["tag A", "tagB"],
          categories: {
            any: ["category A", "categoryB"],
            all: ["category C", "categoryD"],
            not: ["category E", "categoryF"],
          },
        };

        const result = formatPredicate(predicate);

        expect(result).toEqual(
          "(" +
            "type='type A'" +
            " AND " +
            "tags IN ('tag A', tagB)" +
            " AND " +
            "categories IN ('category A', categoryB) AND categories='category C' AND categories=categoryD AND categories NOT IN ('category E', categoryF)" +
            ")"
        );
      });
    });

    describe("formatFilterBlock |", () => {
      it("ORs together predicates by default", () => {
        const predicate1: IPredicate = { type: "typeA" };
        const predicate2: IPredicate = { tags: "tagA" };
        const filter: IFilter = {
          predicates: [predicate1, predicate2],
        };

        const result = formatFilterBlock(filter);
        expect(result).toEqual("((type=typeA) OR (tags=tagA))");
      });

      it("handles when operation is OR", () => {
        const predicate1: IPredicate = { type: "typeA" };
        const predicate2: IPredicate = { tags: "tagA" };
        const filter: IFilter = {
          operation: "OR",
          predicates: [predicate1, predicate2],
        };

        const result = formatFilterBlock(filter);
        expect(result).toEqual("((type=typeA) OR (tags=tagA))");
      });

      it("handles when operation is AND", () => {
        const predicate1: IPredicate = { type: "typeA" };
        const predicate2: IPredicate = { tags: "tagA" };
        const filter: IFilter = {
          operation: "AND",
          predicates: [predicate1, predicate2],
        };

        const result = formatFilterBlock(filter);
        expect(result).toEqual("((type=typeA) AND (tags=tagA))");
      });
    });

    describe("getFilterQueryParam |", () => {
      it("ANDs together all filter blocks", () => {
        const predicateA: IPredicate = { type: "typeA" };
        const predicateB: IPredicate = { tags: "tagA" };
        const filter1: IFilter = {
          operation: "OR",
          predicates: [predicateA, predicateB],
        };

        const predicateC: IPredicate = { type: "typeB" };
        const predicateD: IPredicate = { tags: "tagB" };
        const filter2: IFilter = {
          operation: "OR",
          predicates: [predicateC, predicateD],
        };

        const query: IQuery = {
          targetEntity: "item",
          filters: [filter1, filter2],
        };

        const result = getFilterQueryParam(query);

        expect(result).toEqual(
          "((type=typeA) OR (tags=tagA))" +
            " AND " +
            "((type=typeB) OR (tags=tagB))"
        );
      });
      it("ignores term filters / predicates", () => {
        const predicateA: IPredicate = { type: "typeA" };
        const predicateB: IPredicate = { tags: "tagA" };
        const termPredicate: IPredicate = { term: "term1" };
        const filter1: IFilter = {
          operation: "AND",
          predicates: [predicateA, predicateB, termPredicate],
        };

        const predicateC: IPredicate = { type: "typeB" };
        const predicateD: IPredicate = { tags: "tagB" };
        const filter2: IFilter = {
          operation: "OR",
          predicates: [predicateC, predicateD],
        };

        const termFilter: IFilter = {
          predicates: [{ term: "term2" }],
        };

        const query: IQuery = {
          targetEntity: "item",
          filters: [filter1, filter2, termFilter],
        };

        const result = getFilterQueryParam(query);

        expect(result).toEqual(
          "((type=typeA) AND (tags=tagA))" +
            " AND " +
            "((type=typeB) OR (tags=tagB))"
        );
      });
    });

    describe("getOgcItemQueryParams |", () => {
      const query: IQuery = {
        targetEntity: "item",
        filters: [
          {
            operation: "OR",
            predicates: [{ type: "typeA" }],
          },
        ],
      };

      it("handles query", () => {
        const options: IHubSearchOptions = {};
        const result = getOgcItemQueryParams(query, options);
        const expected = {
          filter: "((type=typeA))",
          token: undefined,
          limit: undefined,
          startindex: undefined,
          q: undefined,
          sortBy: undefined,
          bbox: undefined,
        } as IOgcItemQueryParams;
        expect(result).toEqual(expected);
      });

      it("handles query and auth", () => {
        const options: IHubSearchOptions = {
          requestOptions: {
            authentication: {
              token: "abc",
            } as UserSession,
          },
        };

        const result = getOgcItemQueryParams(query, options);
        const expected = {
          filter: "((type=typeA))",
          token: "abc",
          limit: undefined,
          startindex: undefined,
          q: undefined,
          sortBy: undefined,
          bbox: undefined,
        } as IOgcItemQueryParams;
        expect(result).toEqual(expected);
      });

      it("handles query, auth and limit", () => {
        const options: IHubSearchOptions = {
          requestOptions: {
            authentication: {
              token: "abc",
            } as UserSession,
          },
          num: 9,
        };

        const result = getOgcItemQueryParams(query, options);
        const expected = {
          filter: "((type=typeA))",
          token: "abc",
          limit: 9,
          startindex: undefined,
          q: undefined,
          sortBy: undefined,
          bbox: undefined,
        } as IOgcItemQueryParams;
        expect(result).toEqual(expected);
      });

      it("handles query, auth, limit and startindex", () => {
        const options: IHubSearchOptions = {
          requestOptions: {
            authentication: {
              token: "abc",
            } as UserSession,
          },
          num: 9,
          start: 10,
        };

        const result = getOgcItemQueryParams(query, options);
        const expected = {
          filter: "((type=typeA))",
          token: "abc",
          limit: 9,
          startindex: 10,
          q: undefined,
          sortBy: undefined,
          bbox: undefined,
        } as IOgcItemQueryParams;
        expect(result).toEqual(expected);
      });

      it("handles query, auth, limit, startindex and q", () => {
        const options: IHubSearchOptions = {
          requestOptions: {
            authentication: {
              token: "abc",
            } as UserSession,
          },
          num: 9,
          start: 10,
        };

        const termQuery: IQuery = cloneObject(query);
        termQuery.filters.push({ predicates: [{ term: "term1" }] });

        const result = getOgcItemQueryParams(termQuery, options);
        const expected = {
          filter: "((type=typeA))",
          token: "abc",
          limit: 9,
          startindex: 10,
          q: "term1",
          sortBy: undefined,
          bbox: undefined,
        } as IOgcItemQueryParams;
        expect(result).toEqual(expected);
      });

      it("handles query, auth, limit, startindex, q and sortBy", () => {
        const options: IHubSearchOptions = {
          requestOptions: {
            authentication: {
              token: "abc",
            } as UserSession,
          },
          num: 9,
          start: 10,
          sortField: "title",
          sortOrder: "asc",
        };

        const termQuery: IQuery = cloneObject(query);
        termQuery.filters.push({
          operation: "AND",
          predicates: [{ term: "term1" }, { bbox: "1,2,3,4" }],
        });

        const result = getOgcItemQueryParams(termQuery, options);
        const expected = {
          filter: "((type=typeA))",
          token: "abc",
          limit: 9,
          startindex: 10,
          q: "term1",
          sortBy: "properties.title",
          bbox: "1,2,3,4",
        } as IOgcItemQueryParams;
        expect(result).toEqual(expected);
      });
    });

    describe("getQueryString", () => {
      it("encodes query string values", () => {
        const queryParams = {
          filter: "((source='Anytown, USA R&D Center (2nd)'))",
          sortBy: "-properties.created",
        };
        const queryString = getQueryString(queryParams);
        expect(queryString).toEqual(
          `?filter=${encodeURIComponent(
            "((source='Anytown, USA R&D Center (2nd)'))"
          )}&sortBy=${encodeURIComponent("-properties.created")}`
        );
      });
    });

    describe("getOgcAggregationsQueryString |", () => {
      const baseQuery: IQuery = {
        targetEntity: "item",
        filters: [
          {
            operation: "OR",
            predicates: [{ type: "typeA" }],
          },
        ],
      };

      it("handles aggregations", () => {
        const options: IHubSearchOptions = {
          aggFields: ["type", "tags", "categories"],
        };
        const emptyQuery: IQuery = {
          targetEntity: "item",
          filters: [],
        };
        const result = getOgcAggregationQueryParams(emptyQuery, options);
        const queryString = getQueryString(result);
        expect(queryString).toEqual(
          `?aggregations=${encodeURIComponent(
            "terms(fields=(type,tags,categories))"
          )}`
        );
      });

      it("handles aggregations and filter", () => {
        const options: IHubSearchOptions = {
          aggFields: ["type", "tags", "categories"],
        };
        const result = getOgcAggregationQueryParams(baseQuery, options);
        const queryString = getQueryString(result);
        expect(queryString).toEqual(
          `?aggregations=${encodeURIComponent(
            "terms(fields=(type,tags,categories))"
          )}&filter=${encodeURIComponent("((type=typeA))")}`
        );
      });

      it("handles aggregations, filter, and token", () => {
        const options: IHubSearchOptions = {
          aggFields: ["type", "tags", "categories"],
          requestOptions: {
            authentication: {
              token: "abc",
            } as UserSession,
          },
        };
        const opendataQuery = cloneObject(baseQuery);
        opendataQuery.filters.push({ predicates: [{ openData: true }] });

        const result = getOgcAggregationQueryParams(opendataQuery, options);
        const queryString = getQueryString(result);
        expect(queryString).toEqual(
          `?aggregations=${encodeURIComponent(
            "terms(fields=(type,tags,categories))"
          )}&filter=${encodeURIComponent(
            "((type=typeA)) AND ((openData=true))"
          )}&token=abc`
        );
      });
    });

    describe("getQQueryParam |", () => {
      it("returns the value of the term predicate", () => {
        const query: IQuery = {
          targetEntity: "item",
          filters: [
            {
              operation: "AND",
              predicates: [{ term: "term1" }, { tags: "tagA" }],
            },
            {
              predicates: [{ tags: "tagB" }],
            },
          ],
        };

        const result = getQQueryParam(query);
        expect(result).toBe("term1");
      });

      it("returns undefined when there is no term predicate", () => {
        const query: IQuery = {
          targetEntity: "item",
          filters: [
            {
              predicates: [{ tags: "tagA" }],
            },
            {
              predicates: [{ tags: "tagB" }],
            },
          ],
        };

        const result = getQQueryParam(query);
        expect(result).toBeUndefined();
      });
    });

    describe("getSortByQueryParam |", () => {
      it("returns undefined if no sortField is provided", () => {
        const options: IHubSearchOptions = {
          sortOrder: "asc",
        };
        const result = getSortByQueryParam(options);
        expect(result).toBeUndefined();
      });
      it("handles sorting in descending order", () => {
        const options: IHubSearchOptions = {
          sortField: "title",
          sortOrder: "desc",
        };
        const result = getSortByQueryParam(options);
        expect(result).toBe("-properties.title");
      });
    });
  });

  const expectedItemResults: IHubSearchResult[] = [
    {
      access: "public",
      id: "f4bcc",
      type: "Feature Service",
      name: "training grounds",
      owner: "goku",
      tags: [],
      typeKeywords: [],
      categories: [],
      summary: "How else can I push past my limits?",
      createdDate: new Date(1611934478000),
      createdDateSource: "item.created",
      updatedDate: new Date(1671554653000),
      updatedDateSource: "item.modified",
      family: "map",
      source: "my-source",
      license: "CC-BY-4.0",
      links: {
        self: "https://www.arcgis.com/home/item.html?id=f4bcc",
        siteRelative: "/maps/f4bcc",
        thumbnail:
          "https://www.arcgis.com/sharing/rest/content/items/f4bcc/info/thumbnail/hub_thumbnail_1658341016537.png",
      },
      // TODO: fill this and add some verification
      rawResult: ogcItemsResponse.features[0].properties as IOgcItem,
    },
  ];

  describe("Response Transformation Helpers |", () => {
    describe("ogcItemToSearchResult |", () => {
      const { ogcItemToSearchResult } = ogcItemToSearchResultModule;
      const ogcItemProperties: any = {
        id: "9001",
        owner: "goku",
        created: 1006,
        modified: 1006,
        name: "Item Name",
        title: "Item Title",
        description: "Item Description",
        snippet: "Item Snippet",
        type: "Feature Service",
        typeKeywords: [],
        tags: [],
        categories: [],
        source: "my-source",
        license: "CC-BY-4.0",
      };

      it("delegates to itemToSearchResult, then tacks on enrichment fields", async () => {
        const mockedItemToSearchResultResponse = {
          id: "9001",
          type: "Feature Service",
          family: "map",
        } as unknown as IHubSearchResult;
        const delegateSpy = spyOn(
          portalSearchItemsModule,
          "itemToSearchResult"
        ).and.returnValue(
          Promise.resolve(cloneObject(mockedItemToSearchResultResponse))
        );
        const ogcItem: IOgcItem = {
          id: "9001",
          type: "Feature",
          geometry: null, // for simplicity
          time: null, // for simplicity
          links: [], // for simplicity
          properties: cloneObject(ogcItemProperties),
        };
        const includes: string[] = [];
        const requestOptions: IHubRequestOptions = {};

        const result = await ogcItemToSearchResult(
          ogcItem,
          includes,
          requestOptions
        );
        expect(delegateSpy).toHaveBeenCalledTimes(1);
        expect(delegateSpy).toHaveBeenCalledWith(
          ogcItemProperties,
          includes,
          requestOptions
        );
        expect(result).toEqual({
          ...mockedItemToSearchResultResponse,
          source: "my-source",
          license: "CC-BY-4.0",
        });
      });
    });

    describe("getNextOgcCallback", () => {
      const { getNextOgcCallback } = getNextOgcCallbackModule;
      const query: IQuery = {
        targetEntity: "item",
        filters: [],
      };
      const options: IHubSearchOptions = { num: 1 };
      const nextResponse: IHubSearchResponse<IHubSearchResult> = {
        total: 0,
        results: [],
        hasNext: false,
        next: async () => null as any,
      };

      let searchOgcItemsSpy: jasmine.Spy;
      beforeEach(() => {
        searchOgcItemsSpy = spyOn(
          searchOgcItemsModule,
          "searchOgcItems"
        ).and.returnValue(Promise.resolve(nextResponse));
      });

      it("returns an empty callback when no next link is present", async () => {
        const callback = getNextOgcCallback(ogcItemsResponse, query, options);
        const callbackResult = await callback();
        expect(callbackResult).toBeNull();
        // NOTE: using `toHaveBeenCalled` throws a fatal error ONLY in Karma
        // Use this workaround for the time being
        const numCalls = searchOgcItemsSpy.calls.count();
        expect(numCalls).toBe(0);
      });

      it("returns a callback with modified options when next link is present", async () => {
        const callback = getNextOgcCallback(
          ogcItemsResponseWithNext,
          query,
          options
        );
        const callbackResult = await callback();
        expect(callbackResult).toBe(nextResponse);

        // NOTE: using `toHaveBeenCalledWith` throws a fatal error ONLY in Karma
        // Use this workaround for the time being
        const numCalls = searchOgcItemsSpy.calls.count();
        expect(numCalls).toBe(1);
        const callInfo = searchOgcItemsSpy.calls.first();
        expect(callInfo.args).toEqual([query, { ...options, start: 2 }]);
      });
    });

    // TODO: Trying to spy on `itemToSearchResult` and `getNextOgcCallback`
    // Ends up throwing errors ONLY in Karma. Figure out why that is and
    // test that `formatOgcItemsResponse` is delegating accordingly
    describe("formatOgcItemsResponse |", () => {
      const query: IQuery = {
        targetEntity: "item",
        filters: [],
      };
      const requestOptions: IHubSearchOptions = {
        include: [],
        requestOptions: {},
      };

      it("correctly handles when no next link is present", async () => {
        const formattedResponse = await formatOgcItemsResponse(
          ogcItemsResponse,
          query,
          requestOptions
        );
        expect(formattedResponse).toBeDefined();
        expect(formattedResponse.total).toBe(2);
        expect(formattedResponse.hasNext).toBe(false);
      });

      it("correctly handles when the next link is present", async () => {
        const formattedResponse = await formatOgcItemsResponse(
          ogcItemsResponseWithNext,
          query,
          requestOptions
        );

        expect(formattedResponse).toBeDefined();
        expect(formattedResponse.total).toEqual(2);
        expect(formattedResponse.hasNext).toEqual(true); // Verify that hasNext is true this time
      });
    });

    describe("formatOgcAggregationsResponse |", () => {
      it("converts between OGC and Hub Aggregation interfaces", async () => {
        const formatted = formatOgcAggregationsResponse(
          ogcAggregationsResponse
        );

        // Sets unnecessary props to defaults
        expect(formatted.total).toBe(0);
        expect(formatted.results).toEqual([]);
        expect(formatted.hasNext).toEqual(false);

        const nextResult = await formatted.next();
        expect(nextResult).toBeNull();

        // Test aggregation results
        expect(formatted.aggregations?.length).toEqual(2);

        const accessAgg = formatted.aggregations?.find(
          (a) => a.field === "access"
        );
        expect(accessAgg).toEqual({
          mode: "terms",
          field: "access",
          values: [
            {
              value: "public",
              count: 141,
            },
          ],
        });

        const typeAgg = formatted.aggregations?.find((a) => a.field === "type");
        expect(typeAgg).toEqual({
          mode: "terms",
          field: "type",
          values: [
            { value: "feature service", count: 128 },
            { value: "csv", count: 8 },
          ],
        });
      });
    });
  });

  describe("Main Search Functions |", () => {
    describe("ogcApiRequest", () => {
      const hubApiUrl = "https://hub.arcgis.com";
      const siteHostname = "my-hub.com";
      const queryParams = { type: "CSV" };

      it("appends the ?target query param when the target site domain is different from the url passed in", async () => {
        const fakeResponse = {
          ok: true,
          statusText: "200: Ok",
          status: 200,
          json: () => Promise.resolve(),
        };
        const _fetch: any = async (finalUrl: string) => {
          expect(finalUrl).toBe(`${hubApiUrl}?type=CSV&target=${siteHostname}`);
          return fakeResponse;
        };

        const options: IHubSearchOptions = {
          site: `https://${siteHostname}`,
          requestOptions: {
            fetch: _fetch,
            hubApiUrl,
          },
        };
        await ogcApiRequest(hubApiUrl, queryParams, options);
      });

      it("does not append the ?target query param when the target site domain is the same as the url passed in", async () => {
        const fakeResponse = {
          ok: true,
          statusText: "200: Ok",
          status: 200,
          json: () => Promise.resolve(),
        };
        const _fetch: any = async (finalUrl: string) => {
          expect(finalUrl).toBe(`${hubApiUrl}?type=CSV`);
          return fakeResponse;
        };

        const options: IHubSearchOptions = {
          site: hubApiUrl,
          requestOptions: {
            fetch: _fetch,
            hubApiUrl,
          },
        };
        await ogcApiRequest(hubApiUrl, queryParams, options);
      });

      it("throws an error if the response is not ok", async () => {
        const fakeResponse = {
          ok: false,
          statusText: "404: Not Found",
          status: 404,
        };
        const _fetch: any = async () => fakeResponse;
        const options: IHubSearchOptions = {
          site: `https://${siteHostname}`,
          requestOptions: {
            fetch: _fetch,
            hubApiUrl,
          },
        };
        try {
          await ogcApiRequest(hubApiUrl, queryParams, options);
          expect(true).toBe(false);
        } catch (err) {
          expect(err.message).toEqual("404: Not Found");
        }
      });
    });
    describe("hubSearchItems", () => {
      describe("searchOgcItems |", () => {
        afterEach(fetchMock.restore);
        it("hits the items endpoint for the specified collection", async () => {
          const query: IQuery = {
            targetEntity: "item",
            collection: "dataset",
            filters: [
              {
                predicates: [
                  {
                    type: "Feature Service",
                  },
                ],
              },
            ],
          };

          const siteHostname = "my-test-site.arcgis.com";
          const options: IHubSearchOptions = {
            api: {
              type: "arcgis-hub",
              url: "https://hubqa.arcgis.com/api/v1/search",
            },
            num: 1,
            targetEntity: "item",
            site: `https://${siteHostname}`,
          };

          fetchMock.once(
            `https://hubqa.arcgis.com/api/v1/search/collections/dataset/items?filter=${encodeURIComponent(
              "((type='Feature Service'))"
            )}&limit=1&target=${siteHostname}`,
            ogcItemsResponse
          );
          const response = await hubSearchItems(query, options);
          expect(response.total).toEqual(2);
          expect(response.hasNext).toEqual(false);
          expect(response.results).toEqual(expectedItemResults);
        });
      });

      describe("searchOgcAggregations |", () => {
        afterEach(fetchMock.restore);
        it("hits the aggregations endpoint for the specified collection api url", async () => {
          // TODO: add a query once the aggregations endpoint can handle arbitrary filters
          const query: IQuery = {
            targetEntity: "item",
            collection: "dataset",
            filters: [],
          };
          const siteHostname = "my-test-site.arcgis.com";
          const options: IHubSearchOptions = {
            api: {
              type: "arcgis-hub",
              url: "https://hubqa.arcgis.com/api/v1/search",
            },
            site: `https://${siteHostname}`,
            aggFields: ["access", "type"],
            // TODO: include aggLimit once the aggregations endpoint can handle it
            // aggLimit: 2,
          };

          fetchMock.once(
            `https://hubqa.arcgis.com/api/v1/search/collections/dataset/aggregations?aggregations=${encodeURIComponent(
              "terms(fields=(access,type))"
            )}&target=${siteHostname}`,
            ogcAggregationsResponse
          );
          const response = await hubSearchItems(query, options);

          // Validate defaults
          expect(response.total).toEqual(0);
          expect(response.results).toEqual([]);
          expect(response.hasNext).toEqual(false),
            // Test aggregation results
            expect(response.aggregations?.length).toEqual(2);

          const accessAgg = response.aggregations?.find(
            (a) => a.field === "access"
          );
          expect(accessAgg).toEqual({
            mode: "terms",
            field: "access",
            values: [
              {
                value: "public",
                count: 141,
              },
            ],
          });

          const typeAgg = response.aggregations?.find(
            (a) => a.field === "type"
          );
          expect(typeAgg).toEqual({
            mode: "terms",
            field: "type",
            values: [
              { value: "feature service", count: 128 },
              { value: "csv", count: 8 },
            ],
          });
        });
      });
    });
  });
});
