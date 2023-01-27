import {
  cloneObject,
  IFilter,
  IHubRequestOptions,
  IHubSearchOptions,
  IHubSearchResult,
  IPredicate,
  IQuery,
} from "../../../src";
import {
  formatFilterBlock,
  formatOgcAggregationsResponse,
  formatOgcItemsResponse,
  formatPredicate,
  getFilterQueryParam,
  getOgcAggregationQueryParams,
  getOgcItemQueryParams,
  getQPredicate,
  getQQueryParam,
  getQueryString,
  IOgcAggregationsResponse,
  IOgcItem,
  IOgcItemsResponse,
  ogcItemToSearchResult,
  searchOgcAggregations,
  searchOgcItems,
} from "../../../src/search/_internal/hubSearchItems";
import { UserSession } from "@esri/arcgis-rest-auth";

import * as portalSearchItemsModule from "../../../src/search/_internal/portalSearchItems";
import { IItem } from "@esri/arcgis-rest-types";
import * as fetchMock from "fetch-mock";

describe("hubSearchItems Module:", () => {
  describe("Request Transformation Helpers", () => {
    describe("formatPredicate", () => {
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
            all: ["tagC"],
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

    describe("formatFilterBlock", () => {
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

    describe("getFilterQueryParam", () => {
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

    describe("getOgcItemQueryString", () => {
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
        const queryString = getQueryString(result);
        expect(queryString).toEqual("?filter=((type=typeA))");
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
        const queryString = getQueryString(result);
        expect(queryString).toEqual("?filter=((type=typeA))&token=abc");
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
        const queryString = getQueryString(result);
        expect(queryString).toEqual("?filter=((type=typeA))&token=abc&limit=9");
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
        const queryString = getQueryString(result);
        expect(queryString).toEqual(
          "?filter=((type=typeA))&token=abc&limit=9&startindex=10"
        );
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
        const queryString = getQueryString(result);
        expect(queryString).toEqual(
          "?filter=((type=typeA))&token=abc&limit=9&startindex=10&q=term1"
        );
      });
    });

    describe("getOgcAggregationsQueryString", () => {
      const query: IQuery = {
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
        const result = getOgcAggregationQueryParams(query, options);
        const queryString = getQueryString(result);
        expect(queryString).toEqual(
          "?aggregations=terms(fields=(type,tags,categories))"
        );
      });

      it("handles aggregations and token", () => {
        const options: IHubSearchOptions = {
          aggFields: ["type", "tags", "categories"],
          requestOptions: {
            authentication: {
              token: "abc",
            } as UserSession,
          },
        };
        const result = getOgcAggregationQueryParams(query, options);
        const queryString = getQueryString(result);
        expect(queryString).toEqual(
          "?aggregations=terms(fields=(type,tags,categories))&token=abc"
        );
      });
    });

    describe("getQPredicate", () => {
      it("returns undefined when passed an empty array", () => {
        const result = getQPredicate([]);
        expect(result).toBeUndefined();
      });
      it("throws an error when more than 1 filter is passed in", () => {
        const filters: IFilter[] = [
          { predicates: [{ term: "term1" }] },
          { predicates: [{ term: "term2" }] },
        ];

        try {
          getQPredicate(filters);
          expect(true).toBe(false);
        } catch (err) {
          expect(err.message).toEqual(
            "IQuery can only have 1 IFilter with a 'term' predicate but 2 were detected"
          );
        }
      });

      it("throws an error when a filter with more than one term predicate is passed in", () => {
        const filters: IFilter[] = [
          {
            predicates: [{ term: "term1" }, { term: "term2" }],
          },
        ];

        try {
          getQPredicate(filters);
          expect(true).toBe(false);
        } catch (err) {
          expect(err.message).toEqual(
            "IQuery can only have 1 'term' predicate but 2 were detected"
          );
        }
      });

      it("throws an error when a term predicate ORd with another predicate", () => {
        const filters: IFilter[] = [
          {
            operation: "OR",
            predicates: [{ term: "term1" }, { type: "typeA" }],
          },
        ];

        try {
          getQPredicate(filters);
          expect(true).toBe(false);
        } catch (err) {
          expect(err.message).toEqual(
            "'term' predicates cannot be OR'd to other predicates"
          );
        }
      });

      it("throws an error when a term predicate is an array", () => {
        const filters: IFilter[] = [
          {
            predicates: [{ term: ["term1", "term2"] }],
          },
        ];

        try {
          getQPredicate(filters);
          expect(true).toBe(false);
        } catch (err) {
          expect(err.message).toEqual(
            "'term' predicate must have a string value, string[] and IMatchOptions are not allowed."
          );
        }
      });

      it("throws an error when a term predicate is an IMatchOptions", () => {
        const filters: IFilter[] = [
          {
            predicates: [
              {
                term: {
                  any: ["term1", "term2"],
                },
              },
            ],
          },
        ];

        try {
          getQPredicate(filters);
          expect(true).toBe(false);
        } catch (err) {
          expect(err.message).toEqual(
            "'term' predicate must have a string value, string[] and IMatchOptions are not allowed."
          );
        }
      });

      it("returns the predicate when term is a string", () => {
        const expected = { term: "term1" };
        const filters: IFilter[] = [
          {
            predicates: [expected],
          },
        ];

        const result = getQPredicate(filters);
        expect(result).toBe(expected);
      });
    });

    describe("getQQueryParam", () => {
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

      it("returns undefined when there is noterm predicate", () => {
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
  });

  // TODO: move these to dedicated mock json files
  const mockedItemsResponse: IOgcItemsResponse = {
    type: "FeatureCollection",
    features: [
      {
        id: "f4bcc",
        type: "Feature",
        geometry: {
          type: "Polygon",
          coordinates: [
            [
              [-121.11799999999793, 39.37030746927015],
              [-119.00899999999801, 39.37030746927015],
              [-119.00899999999801, 38.67499450446548],
              [-121.11799999999793, 38.67499450446548],
              [-121.11799999999793, 39.37030746927015],
            ],
          ],
        },
        properties: {
          id: "f4bcc",
          owner: "goku",
          created: 1611934478000,
          modified: 1671554653000,
          guid: null,
          name: "Training_Grounds",
          title: "training grounds",
          type: "Feature Service",
          typeKeywords: [],
          description: "Gotta get those reps in!",
          tags: [],
          snippet: "How else can I push past my limits?",
          thumbnail: "thumbnail/hub_thumbnail_1658341016537.png",
          documentation: null,
          extent: {
            type: "Polygon",
            coordinates: [
              [
                [-121.11799999999793, 39.37030746927015],
                [-119.00899999999801, 39.37030746927015],
                [-119.00899999999801, 38.67499450446548],
                [-121.11799999999793, 38.67499450446548],
                [-121.11799999999793, 39.37030746927015],
              ],
            ],
          },
          categories: [],
          spatialReference: "102100",
          url: "https://servicesqa.arcgis.com/Xj56SBi2udA78cC9/arcgis/rest/services/Training_Grounds/FeatureServer",
          access: "public",
        },
        time: null,
        links: [
          {
            rel: "self",
            type: "application/geo+json",
            title: "This document as GeoJSON",
            href: "https://foo-bar.com/api/search/v1/collections/datasets/items/f4bcc",
          },
          {
            rel: "collection",
            type: "application/json",
            title: "All",
            href: "https://foo-bar.com/api/search/v1/collections/all",
          },
        ],
      },
    ],
    timestamp: "2023-01-23T18:53:40.715Z",
    numberMatched: 2,
    numberReturned: 1,
    links: [
      {
        rel: "self",
        type: "application/geo+json",
        title: "This document as GeoJSON",
        href: "https://foo-bar.com/api/search/v1/collections/all/items",
      },
      {
        rel: "collection",
        type: "application/json",
        title: "All",
        href: "https://foo-bar.com/api/search/v1/collections/all",
      },
    ],
  };
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
      links: {
        self: "https://www.arcgis.com/home/item.html?id=f4bcc",
        siteRelative: "/maps/f4bcc",
        thumbnail:
          "https://www.arcgis.com/sharing/rest/content/items/f4bcc/info/thumbnail/hub_thumbnail_1658341016537.png",
      },
    },
  ];

  const mockedAggregationsResponse: IOgcAggregationsResponse = {
    aggregations: {
      aggregations: [
        {
          field: "access",
          aggregations: [
            {
              label: "public",
              value: 141,
            },
          ],
        },
        {
          field: "type",
          aggregations: [
            {
              label: "feature service",
              value: 128,
            },
            {
              label: "csv",
              value: 8,
            },
          ],
        },
      ],
    },
    timestamp: "2023-01-23T23:43:42.523Z",
    links: [
      {
        rel: "self",
        type: "application/json",
        title: "This document as JSON",
        href: "https://my-test-site.arcgis.com/api/search/v1/collections/all/aggregations",
      },
    ],
  };

  describe("Response Transformation Helpers", () => {
    describe("ogcItemToSearchResult", () => {
      const item = {
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
      } as unknown as IItem;

      it("delegates to itemToSearchResult", async () => {
        const mockedResult = {
          id: "9001",
          type: "Feature Service",
          family: "map",
        } as unknown as IHubSearchResult;
        const delegateSpy = spyOn(
          portalSearchItemsModule,
          "itemToSearchResult"
        ).and.returnValue(Promise.resolve(mockedResult));
        const ogcItem: IOgcItem = {
          id: "9001",
          type: "Feature",
          geometry: null, // for simplicity
          time: null, // for simplicity
          links: [], // for simplicity
          properties: item,
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
          item,
          includes,
          requestOptions
        );
        expect(result).toEqual(mockedResult);
      });
    });

    // We can't really test getNextOgcCallback because we can't stub
    // `searchOgcItems`. I believe this could be fixed by exporting
    // every helper from it's own file
    // describe('getNextOgcCallback')

    describe("formatOgcItemsResponse", () => {
      const query: IQuery = {
        targetEntity: "item",
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
      const requestOptions: IHubSearchOptions = {};
      it("correctly handles when no next link is present", async () => {
        const formattedResponse = await formatOgcItemsResponse(
          mockedItemsResponse,
          query,
          requestOptions
        );
        expect(formattedResponse.total).toEqual(2);
        expect(formattedResponse.hasNext).toEqual(false);
        expect(formattedResponse.next).toBeDefined();
        expect(formattedResponse.results).toEqual(expectedItemResults);
      });

      it("correctly handles when the next link is present", async () => {
        const responseWithNextLink = cloneObject(mockedItemsResponse);
        responseWithNextLink.links.push({
          rel: "next",
          type: "application/geo+json",
          title: "items (next)",
          href: "https://foo-bar.com/api/search/v1/collections/all/items?limit=1&startindex=2",
        });

        const formattedResponse = await formatOgcItemsResponse(
          responseWithNextLink,
          query,
          requestOptions
        );
        expect(formattedResponse.total).toEqual(2);
        // Verify that hasNext is true this time
        expect(formattedResponse.hasNext).toEqual(true);
        // Because we cannot stub searchOgcItems, we can't check
        // that the callback correctly delegates with updated args
        expect(formattedResponse.next).toBeDefined();
        expect(formattedResponse.results).toEqual(expectedItemResults);
      });
    });

    describe("formatOgcAggregationsResponse", () => {
      it("converts between OGC and Hub Aggregation interfaces", () => {
        const formatted = formatOgcAggregationsResponse(
          mockedAggregationsResponse
        );

        // Sets unnecessary props to defaults
        expect(formatted.total).toBe(0);
        expect(formatted.results).toEqual([]);
        expect(formatted.hasNext).toEqual(false);
        expect(formatted.next).toBeDefined();

        // Test aggregation results
        expect(formatted.aggregations.length).toEqual(2);

        const accessAgg = formatted.aggregations.find(
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

        const typeAgg = formatted.aggregations.find((a) => a.field === "type");
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
  describe("Main Search Functions", () => {
    describe("searchOgcItems", () => {
      afterEach(fetchMock.restore);
      it("hits the items endpoint for the specified collection api url", async () => {
        const query: IQuery = {
          targetEntity: "item",
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

        const options: IHubSearchOptions = {
          api: {
            type: "arcgis-hub",
            url: "https://my-test-site.arcgis.com/api/v1/search/collections/all",
          },
          num: 1,
          targetEntity: "item",
        };

        fetchMock.once(
          "https://my-test-site.arcgis.com/api/v1/search/collections/all/items?filter=((type='Feature Service'))&limit=1",
          mockedItemsResponse
        );
        const response = await searchOgcItems(query, options);
        expect(response.total).toEqual(2);
        expect(response.hasNext).toEqual(false);
        expect(response.results).toEqual(expectedItemResults);
      });
    });

    describe("searchOgcAggregations", () => {
      afterEach(fetchMock.restore);
      it("hits the aggregations endpoint for the specified collection api url", async () => {
        // TODO: add a query once the aggregations endpoint can handle arbitrary filters
        const query: IQuery = null;
        const options: IHubSearchOptions = {
          api: {
            type: "arcgis-hub",
            url: "https://my-test-site.arcgis.com/api/v1/search/collections/all",
          },
          targetEntity: "item",
          aggFields: ["access", "type"],
          // TODO: include aggLimit once the aggregations endpoint can handle it
          // aggLimit: 2,
        };

        fetchMock.once(
          "https://my-test-site.arcgis.com/api/v1/search/collections/all/aggregations?aggregations=terms(fields=(access,type))",
          mockedAggregationsResponse
        );
        const response = await searchOgcAggregations(query, options);

        // Validate defaults
        expect(response.total).toEqual(0);
        expect(response.results).toEqual([]);
        expect(response.hasNext).toEqual(false),
          // Test aggregation results
          expect(response.aggregations.length).toEqual(2);

        const accessAgg = response.aggregations.find(
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

        const typeAgg = response.aggregations.find((a) => a.field === "type");
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
