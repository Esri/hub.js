import * as Portal from "@esri/arcgis-rest-portal";
import {
  cloneObject,
  getWellknownCollection,
  IHubSearchOptions,
  IQuery,
  WellKnownCollection,
} from "../../../src";

import * as SimpleResponse from "../../mocks/portal-search/simple-response.json";
import * as AllTypesResponse from "../../mocks/portal-search/response-with-key-types.json";
import { MOCK_AUTH } from "../../mocks/mock-auth";
import {
  applyWellKnownCollectionFilters,
  applyWellKnownItemPredicates,
  portalSearchItems,
  portalSearchItemsAsItems,
  WellKnownItemPredicates,
} from "../../../src/search/_internal/portalSearchItems";

describe("portalSearchItems Module:", () => {
  describe("portalSearchItems:", () => {
    it("throws if requestOptions not passed in IHubSearchOptions", async () => {
      const qry: IQuery = {
        targetEntity: "item",
        filters: [
          {
            predicates: [
              {
                term: "water",
              },
            ],
          },
        ],
      };
      const opts: IHubSearchOptions = {};

      try {
        await portalSearchItems(qry, opts);
      } catch (err) {
        expect(err.name).toBe("HubError");
        expect(err.message).toBe("options.requestOptions is required.");
      }
    });
    it("simple search", async () => {
      const searchItemsSpy = spyOn(Portal, "searchItems").and.callFake(() => {
        return Promise.resolve(cloneObject(AllTypesResponse));
      });

      const qry: IQuery = {
        targetEntity: "item",
        filters: [
          {
            predicates: [
              {
                term: "water",
              },
            ],
          },
        ],
      };
      const opts: IHubSearchOptions = {
        requestOptions: {
          portal: "https://www.arcgis.com/sharing/rest",
        },
      };

      const resp = await portalSearchItems(qry, opts);

      // find the hubsite entry and ensure that it does not have .properties
      const hubSite = resp.results.find(
        (e) => e.type === "Hub Site Application"
      );
      expect(hubSite?.properties).not.toBeDefined();

      expect(searchItemsSpy.calls.count()).toBe(1, "should call searchItems");
      const [expectedParams] = searchItemsSpy.calls.argsFor(0);
      expect(expectedParams.portal).toEqual(opts.requestOptions?.portal);
      expect(expectedParams.q).toEqual('(water) AND (-type:"Code Attachment")');
      expect(expectedParams.countFields).not.toBeDefined();
    });
    it("simple search with bbox", async () => {
      const searchItemsSpy = spyOn(Portal, "searchItems").and.callFake(() => {
        return Promise.resolve(cloneObject(AllTypesResponse));
      });
      const qry: IQuery = {
        targetEntity: "item",
        filters: [
          {
            predicates: [
              {
                term: "water",
                bbox: "1,2,3,4",
              },
            ],
          },
        ],
      };
      const opts: IHubSearchOptions = {
        requestOptions: {
          portal: "https://www.arcgis.com/sharing/rest",
        },
      };

      await portalSearchItems(qry, opts);

      expect(searchItemsSpy.calls.count()).toBe(1, "should call searchItems");
      const [expectedParams] = searchItemsSpy.calls.argsFor(0);
      expect(expectedParams.portal).toEqual(opts.requestOptions?.portal);
      expect(expectedParams.q).toEqual('(water) AND (-type:"Code Attachment")');
      expect(expectedParams.params.bbox).toEqual("1,2,3,4");
      expect(expectedParams.countFields).not.toBeDefined();
    });
    it("simple search with auth", async () => {
      const searchItemsSpy = spyOn(Portal, "searchItems").and.callFake(() => {
        return Promise.resolve(cloneObject(SimpleResponse));
      });
      const qry: IQuery = {
        targetEntity: "item",
        filters: [
          {
            predicates: [
              {
                term: "water",
              },
            ],
          },
        ],
      };
      const opts: IHubSearchOptions = {
        requestOptions: {
          portal: "https://www.arcgis.com/sharing/rest",
          authentication: MOCK_AUTH,
        },
      };

      await portalSearchItems(qry, opts);

      expect(searchItemsSpy.calls.count()).toBe(1, "should call searchItems");
      const [expectedParams] = searchItemsSpy.calls.argsFor(0);
      expect(expectedParams.portal).toBeUndefined();
      expect(expectedParams.q).toEqual('(water) AND (-type:"Code Attachment")');
      expect(expectedParams.authentication).toEqual(
        opts.requestOptions?.authentication
      );
      expect(expectedParams.countFields).not.toBeDefined();
    });
    it("simple search with aggregations", async () => {
      const searchItemsSpy = spyOn(Portal, "searchItems").and.callFake(() => {
        return Promise.resolve(cloneObject(SimpleResponse));
      });
      const qry: IQuery = {
        targetEntity: "item",
        filters: [
          {
            predicates: [
              {
                term: "water",
              },
            ],
          },
        ],
      };
      const opts: IHubSearchOptions = {
        aggFields: ["tags"],
        requestOptions: {
          portal: "https://www.arcgis.com/sharing/rest",
        },
      };

      await portalSearchItems(qry, opts);

      expect(searchItemsSpy.calls.count()).toBe(1, "should call searchItems");
      const [expectedParams] = searchItemsSpy.calls.argsFor(0);
      // verify q
      expect(expectedParams.q).toEqual('(water) AND (-type:"Code Attachment")');
      expect(expectedParams.countFields).toEqual("tags");
      expect(expectedParams.countSize).toEqual(10);
    });
    it("simple search enterprise", async () => {
      const searchItemsSpy = spyOn(Portal, "searchItems").and.callFake(() => {
        return Promise.resolve(cloneObject(SimpleResponse));
      });
      const qry: IQuery = {
        targetEntity: "item",
        filters: [
          {
            predicates: [
              {
                term: "water",
              },
            ],
          },
        ],
      };
      const opts: IHubSearchOptions = {
        requestOptions: {
          portal: "https://my-portal.com/gis/sharing/rest",
        },
        aggFields: ["tags"],
        aggLimit: 100,
      };

      await portalSearchItems(qry, opts);

      expect(searchItemsSpy.calls.count()).toBe(1, "should call searchItems");
      const [expectedParams] = searchItemsSpy.calls.argsFor(0);
      // verify q
      expect(expectedParams.q).toEqual('(water) AND (-type:"Code Attachment")');
      expect(expectedParams.countFields).toEqual("tags");
      expect(expectedParams.countSize).toEqual(100);
      expect(expectedParams.portal).toEqual(
        "https://my-portal.com/gis/sharing/rest"
      );
    });
    it("simple search for old site type", async () => {
      const qry: IQuery = {
        targetEntity: "item",
        filters: [
          {
            operation: "AND",
            predicates: [
              {
                id: ["2698f21f93a24fb087cbbd34125c8191"],
              },
            ],
          },
        ],
      };
      const opts: IHubSearchOptions = {
        num: 1,
        sortField: "numviews",
        sortOrder: "desc",
        api: {
          type: "arcgis",
          url: "https://dc.mapsqa.arcgis.com",
        },
        include: [],
        requestOptions: {
          isPortal: false,
          hubApiUrl: "https://hubqa.arcgis.com",
          portal: "https://dc.mapsqa.arcgis.com/sharing/rest",
        },
      };
      const searchResult = await portalSearchItems(qry, opts);
      expect(searchResult.results[0].type).toBe("Web Mapping Application");
      expect(
        searchResult.results[0].typeKeywords?.includes("hubSite")
      ).toBeTruthy();
      expect(searchResult?.results[0]?.links?.self).toBe(
        "https://upsidedownbirds-dc.opendataqa.arcgis.com"
      );
    });
    it("simple search for old solution template", async () => {
      const qry: IQuery = {
        targetEntity: "item",
        filters: [
          {
            operation: "AND",
            predicates: [
              {
                id: ["125f58a8beaf4105bd8fac02d331c8f9"],
              },
            ],
          },
        ],
      };
      const opts: IHubSearchOptions = {
        num: 1,
        sortField: "numviews",
        sortOrder: "desc",
        api: {
          type: "arcgis",
          url: "https://qaext.arcgis.com",
        },
        include: [],
        requestOptions: {
          isPortal: false,
          hubApiUrl: "https://hubqa.arcgis.com",
          portal: "https://qaext.arcgis.com/sharing/rest",
        },
      };

      const searchResult = await portalSearchItems(qry, opts);
      expect(searchResult.results[0].type).toBe("Web Mapping Application");
      expect(
        searchResult.results[0].typeKeywords?.includes("hubSite")
      ).toBeFalsy();
    });
    // xit("simple search next", async () => {
    //   const searchItemsSpy = spyOn(Portal, "searchItems").and.callFake(() => {
    //     return Promise.resolve(cloneObject(SimpleResponse));
    //   });
    //  const qry: IQuery = {
    //    targetEntity: "item",
    //    filters: [
    //      {
    //        predicates: [
    //          {
    //            term: "water",
    //          },
    //        ],
    //      },
    //    ],
    //  };
    //   const opts: IHubSearchOptions = {
    //     requestOptions: {
    //       portal: "https://www.arcgis.com/sharing/rest",
    //     },
    //   };

    //   const res = await _searchContent(f, opts);
    //   await res.next();
    //   expect(searchItemsSpy.calls.count()).toBe(2, "should call searchItems");
    //   const [expectedParams] = searchItemsSpy.calls.argsFor(1);
    //   // verify q
    //   expect(expectedParams.q).toEqual("water");
    // });
    describe("applyWellKnownItemPredicates:", () => {
      it("expands simple query", () => {
        const qry: IQuery = {
          targetEntity: "item",
          filters: [
            {
              predicates: [
                {
                  type: "$dashboard",
                },
              ],
            },
          ],
        };

        const chk = applyWellKnownItemPredicates(qry);
        expect(chk.filters.length).toBe(1);
        const expected = cloneObject(
          WellKnownItemPredicates.$dashboard[0].type
        );
        expect(chk.filters[0].predicates[0].type).toEqual(expected);
      });
      it("expands multiple filters", () => {
        const qry: IQuery = {
          targetEntity: "item",
          filters: [
            {
              predicates: [
                {
                  type: "$dashboard",
                },
              ],
            },
            {
              predicates: [
                {
                  type: "$storymap",
                },
              ],
            },
          ],
        };

        const chk = applyWellKnownItemPredicates(qry);
        expect(chk.filters.length).toBe(2);
        expect(chk.filters[0].operation).toBe("OR");

        expect(chk.filters[0].predicates.length).toBe(1);
        expect(chk.filters[0].predicates[0].type).toEqual(
          WellKnownItemPredicates.$dashboard[0].type
        );
        expect(chk.filters[1].predicates.length).toBe(2);
        expect(chk.filters[1].operation).toBe("OR");
        expect(chk.filters[1].predicates[0].type).toEqual(
          WellKnownItemPredicates.$storymap[0].type
        );
        expect(chk.filters[1].predicates[1].type).toEqual(
          WellKnownItemPredicates.$storymap[1].type
        );
      });
      it("skips non-well-known string keys", () => {
        const qry: IQuery = {
          targetEntity: "item",
          filters: [
            {
              operation: "AND",
              predicates: [
                {
                  type: "Web Map",
                },
              ],
            },
          ],
        };

        const chk = applyWellKnownItemPredicates(qry);
        expect(chk.filters.length).toBe(1);
        expect(chk.filters).toEqual(qry.filters);
        expect(chk.filters[0].operation).toBe("AND");
      });
      it("skips non-well-known keys", () => {
        const qry: IQuery = {
          targetEntity: "item",
          filters: [
            {
              predicates: [
                {
                  type: { any: ["Web Map"] },
                },
              ],
            },
          ],
        };

        const chk = applyWellKnownItemPredicates(qry);
        expect(chk.filters.length).toBe(1);
        expect(chk.filters).toEqual(qry.filters);
      });
      it("handles two multiple filters", () => {
        const qry: IQuery = {
          targetEntity: "item",
          filters: [
            {
              operation: "AND",
              predicates: [
                {
                  type: "$dashboard",
                },
                {
                  type: "$storymap",
                },
              ],
            },
          ],
        };

        const chk = applyWellKnownItemPredicates(qry);
        expect(chk.filters.length).toBe(1);

        expect(chk.filters[0].predicates.length).toBe(3);
        expect(chk.filters[0].operation).toBe("OR");
        expect(chk.filters[0].predicates[0].type).toEqual(
          WellKnownItemPredicates.$dashboard[0].type
        );

        expect(chk.filters[0].predicates[1].type).toEqual(
          WellKnownItemPredicates.$storymap[0].type
        );
        expect(chk.filters[0].predicates[2].type).toEqual(
          WellKnownItemPredicates.$storymap[1].type
        );
      });

      it("drops other props if type is found", () => {
        const qry: IQuery = {
          targetEntity: "item",
          filters: [
            {
              predicates: [
                {
                  type: "$dashboard",
                  owner: "dave",
                },
              ],
            },
          ],
        };

        const chk = applyWellKnownItemPredicates(qry);
        expect(chk.filters.length).toBe(1);
        const expected = cloneObject(
          WellKnownItemPredicates.$dashboard[0].type
        );
        expect(chk.filters[0].operation).toBe("OR");
        expect(chk.filters[0].predicates[0].type).toEqual(expected);
        expect(chk.filters[0].predicates[0].owner).not.toBeDefined();
      });
    });
    describe("applyWellKnownCollectionFilters", () => {
      const baseQuery: IQuery = {
        targetEntity: "item",
        filters: [
          {
            predicates: [
              {
                term: "My Search Terms",
              },
            ],
          },
        ],
      };
      it("performs a no-op when no collection collection is indicated", () => {
        const query = cloneObject(baseQuery);
        const result = applyWellKnownCollectionFilters(query);
        expect(result).toEqual(query);
      });

      it("performs a no-op when an invalid collection id is indicated", () => {
        const query = cloneObject(baseQuery);
        query.collection = "fake" as WellKnownCollection;
        const result = applyWellKnownCollectionFilters(query);
        expect(result).toEqual(query);
      });

      it("appends the a collection's filters when available", () => {
        const query = cloneObject(baseQuery);
        query.collection = "dataset";
        const result = applyWellKnownCollectionFilters(query);

        const datasetCollection = getWellknownCollection("", "item", "dataset");
        const expected = cloneObject(query);
        expected.filters = [
          ...expected.filters,
          ...datasetCollection.scope.filters,
        ];

        expect(result).toEqual(expected);
      });
    });
  });

  describe("portalSearchItemsAsItems:", () => {
    it("simple search", async () => {
      const searchItemsSpy = spyOn(Portal, "searchItems").and.callFake(() => {
        return Promise.resolve(cloneObject(AllTypesResponse));
      });
      const qry: IQuery = {
        targetEntity: "item",
        filters: [
          {
            predicates: [
              {
                term: "water",
              },
            ],
          },
        ],
      };
      const opts: IHubSearchOptions = {
        requestOptions: {
          portal: "https://www.arcgis.com/sharing/rest",
        },
      };

      const resp = await portalSearchItemsAsItems(qry, opts);
      // find the hubsite entry and ensure that it does not have .properties
      const hubSite = resp.results.find(
        (e) => e.type === "Hub Site Application"
      );
      expect(hubSite?.properties).toBeDefined();

      expect(searchItemsSpy.calls.count()).toBe(1, "should call searchItems");
      const [expectedParams] = searchItemsSpy.calls.argsFor(0);
      expect(expectedParams.portal).toEqual(opts.requestOptions?.portal);
      expect(expectedParams.q).toEqual("(water)");
      expect(expectedParams.countFields).not.toBeDefined();
    });
  });
});
