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
  formatOgcSearchResponse,
  formatPredicate,
  getFilterQueryParam,
  getOgcAggregrationsQueryParams,
  getOgcItemQueryParams,
  getQueryString,
  IOgcItem,
  IOgcResponse,
  ogcItemToSearchResult,
  searchOgcItems,
} from "../../../src/search/_internal/hubSearchItems";
import { UserSession } from "@esri/arcgis-rest-auth";

import * as portalSearchItemsModule from "../../../src/search/_internal/portalSearchItems";
import { IItem } from "@esri/arcgis-rest-types";
import * as fetchMock from "fetch-mock";

describe("hubSearchItems Module:", () => {
  describe("Request Transformation Helpers", () => {
    describe("formatPredicate", () => {
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
          tags: "tagA",
        };
        const result = formatPredicate(predicate);
        expect(result).toEqual("(type=typeA AND tags=tagA)");
      });

      it("handles a string array", () => {
        const predicate = {
          type: ["typeA", "typeB"],
        };
        const result = formatPredicate(predicate);
        expect(result).toEqual("(type IN (typeA, typeB))");
      });

      it("handles a multiple string arrays", () => {
        const predicate = {
          type: ["typeA", "typeB"],
          tags: ["tagA", "tagB"],
        };
        const result = formatPredicate(predicate);
        expect(result).toEqual(
          "(type IN (typeA, typeB) AND tags IN (tagA, tagB))"
        );
      });

      it("handles a complex predicate with anys", () => {
        const predicate = {
          type: {
            any: ["typeA", "typeB"],
          },
        };
        const result = formatPredicate(predicate);
        expect(result).toEqual("(type IN (typeA, typeB))");
      });

      it("handles a complex predicate with anys and alls", () => {
        const predicate = {
          tags: {
            any: ["tagA", "tagB"],
            all: ["tagC", "tagD"],
          },
        };
        const result = formatPredicate(predicate);
        expect(result).toEqual(
          "(tags IN (tagA, tagB) AND tags=tagC AND tags=tagD)"
        );
      });

      it("handles a complex predicate with anys, alls and nots", () => {
        const predicate = {
          tags: {
            any: ["tagA", "tagB"],
            all: ["tagC", "tagD"],
            not: ["tagE", "tagF"],
          },
        };
        const result = formatPredicate(predicate);
        expect(result).toEqual(
          "(tags IN (tagA, tagB) AND tags=tagC AND tags=tagD AND tags NOT IN (tagE, tagF))"
        );
      });

      it("handles multiple complex predicates", () => {
        const predicate = {
          tags: {
            any: ["tagA", "tagB"],
            all: ["tagC", "tagD"],
          },
          type: {
            any: ["typeA", "typeB"],
            not: ["typeC", "typeD"],
          },
        };
        const result = formatPredicate(predicate);
        expect(result).toEqual(
          "(" +
            "tags IN (tagA, tagB) AND tags=tagC AND tags=tagD" +
            " AND " +
            "type IN (typeA, typeB) AND type NOT IN (typeC, typeD)" +
            ")"
        );
      });

      it("handles all 3 kinds of predicates", () => {
        const predicate = {
          type: "typeA",
          tags: ["tagA", "tagB"],
          categories: {
            any: ["categoryA", "categoryB"],
            all: ["categoryC", "categoryD"],
            not: ["categoryE", "categoryF"],
          },
        };

        const result = formatPredicate(predicate);

        expect(result).toEqual(
          "(" +
            "type=typeA" +
            " AND " +
            "tags IN (tagA, tagB)" +
            " AND " +
            "categories IN (categoryA, categoryB) AND categories=categoryC AND categories=categoryD AND categories NOT IN (categoryE, categoryF)" +
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
        const result = getOgcAggregrationsQueryParams(query, options);
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
        const result = getOgcAggregrationsQueryParams(query, options);
        const queryString = getQueryString(result);
        expect(queryString).toEqual(
          "?aggregations=terms(fields=(type,tags,categories))&token=abc"
        );
      });
    });
  });

  // TODO: move these to dedicated mock json files
  const mockedResponse: IOgcResponse = {
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
  const expectedResults: IHubSearchResult[] = [
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

    describe("formatOgcSearchResponse", () => {
      it("correctly handles when no next link is present", async () => {
        const formattedResponse = await formatOgcSearchResponse(
          mockedResponse,
          null,
          null
        );
        expect(formattedResponse.total).toEqual(2);
        expect(formattedResponse.hasNext).toEqual(false);
        expect(formattedResponse.next).toBeDefined();
        expect(formattedResponse.results).toEqual(expectedResults);
      });

      it("correctly handles when the next link is present", async () => {
        const responseWithNextLink = cloneObject(mockedResponse);
        responseWithNextLink.links.push({
          rel: "next",
          type: "application/geo+json",
          title: "items (next)",
          href: "https://foo-bar.com/api/search/v1/collections/all/items?limit=1&startindex=2",
        });

        const formattedResponse = await formatOgcSearchResponse(
          responseWithNextLink,
          null,
          null
        );
        expect(formattedResponse.total).toEqual(2);
        // Verify that hasNext is true this time
        expect(formattedResponse.hasNext).toEqual(true);
        // Because we cannot stub searchOgcItems, we can't check
        // that the callback correctly delegates with updated args
        expect(formattedResponse.next).toBeDefined();
        expect(formattedResponse.results).toEqual(expectedResults);
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
          "https://my-test-site.arcgis.com/api/v1/search/collections/all/items?filter=((type=Feature Service))&limit=1",
          mockedResponse
        );
        const response = await searchOgcItems(query, options);
        expect(response.total).toEqual(2);
        expect(response.hasNext).toEqual(false);
        expect(response.results).toEqual(expectedResults);
      });
    });
  });
});
