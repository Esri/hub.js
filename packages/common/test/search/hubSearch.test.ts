import { FilterType, IFilterGroup, IHubSearchOptions, IQuery } from "../../src";
import { hubSearch, hubSearchQuery } from "../../src/search/hubSearch";

import * as SearchFunctionModule from "../../src/search/_internal";

describe("hubSearch Module:", () => {
  describe("hubSearch - FilterGroups:", () => {
    describe("guards:", () => {
      it("throws if filterGroups not passed", async () => {
        try {
          await hubSearch(
            null as unknown as Array<IFilterGroup<FilterType>>,
            {} as unknown as IHubSearchOptions
          );
        } catch (err) {
          expect(err.name).toBe("HubError");
          expect(err.message).toBe(
            "FilterGroups are required and must be an array."
          );
        }
      });
      it("throws if filter groups not an array with entries", async () => {
        try {
          await hubSearch(
            [] as unknown as Array<IFilterGroup<FilterType>>,
            {} as unknown as IHubSearchOptions
          );
        } catch (err) {
          expect(err.name).toBe("HubError");
          expect(err.message).toBe(
            "FilterGrous array must contain at least one entry."
          );
        }
      });
      it("throws if options does not have requestOptions", async () => {
        const fg: Array<IFilterGroup<FilterType>> = [
          {
            filterType: "item",
            operation: "OR",
            filters: [
              {
                filterType: "item",
                term: "water",
              },
            ],
          },
        ];
        try {
          await hubSearch(fg, {} as unknown as IHubSearchOptions);
        } catch (err) {
          expect(err.name).toBe("HubError");
          expect(err.message).toBe(
            "requestOptions: IHubRequestOptions is required."
          );
        }
      });
      it("throws if function is not available", async () => {
        const fg: Array<IFilterGroup<FilterType>> = [
          {
            filterType: "group",
            operation: "OR",
            filters: [
              {
                filterType: "group",
                term: "water",
              },
            ],
          },
        ];
        const opts: IHubSearchOptions = {
          requestOptions: {
            portal: "https://qaext.arcgis.com/sharing/rest",
          },
          api: "hubDEV",
          include: ["server"],
        };
        try {
          await hubSearch(fg, opts);
        } catch (err) {
          expect(err.name).toBe("HubError");
          expect(err.message).toBe(
            `Search via "group" filter against "arcgis-hub" api is not implemented`
          );
        }
      });
    });
    describe("delegations:", () => {
      let portalSearchItemsSpyFG: jasmine.Spy;
      let portalSearchGroupsSpyFG: jasmine.Spy;
      let hubSearchFilterGroupsItemsSpyFG: jasmine.Spy;
      beforeEach(() => {
        // we are only interested in verifying that the fn was called with specific args
        // so all the responses are fake
        portalSearchItemsSpyFG = spyOn(
          SearchFunctionModule,
          "portalSearchItemsFilterGroups"
        ).and.callFake(() => {
          return Promise.resolve({
            hasNext: false,
            results: [],
            total: 99,
          });
        });
        portalSearchGroupsSpyFG = spyOn(
          SearchFunctionModule,
          "portalSearchGroupsFilterGroups"
        ).and.callFake(() => {
          return Promise.resolve({
            hasNext: false,
            results: [],
            total: 99,
          });
        });
        hubSearchFilterGroupsItemsSpyFG = spyOn(
          SearchFunctionModule,
          "hubSearchItems"
        ).and.callFake(() => {
          return Promise.resolve({
            hasNext: false,
            results: [],
            total: 99,
          });
        });
      });
      it("items: portalSearchItems", async () => {
        const fg: Array<IFilterGroup<FilterType>> = [
          {
            filterType: "item",
            operation: "OR",
            filters: [
              {
                filterType: "item",
                term: "water",
              },
            ],
          },
        ];
        const opts: IHubSearchOptions = {
          requestOptions: {
            portal: "https://qaext.arcgis.com/sharing/rest",
          },
        };
        const chk = await hubSearch(fg, opts);
        expect(chk.total).toBe(99);
        expect(portalSearchItemsSpyFG.calls.count()).toBe(1);
        expect(portalSearchGroupsSpyFG.calls.count()).toBe(0);
        expect(hubSearchFilterGroupsItemsSpyFG.calls.count()).toBe(0);
        const [filterGroups, options] = portalSearchItemsSpyFG.calls.argsFor(0);
        expect(filterGroups).toEqual(fg);
        expect(options.include).toBeDefined();
        expect(options.requestOptions).toEqual(opts.requestOptions);
      });
      it("items + arcgis: portalSearchItems", async () => {
        const fg: Array<IFilterGroup<FilterType>> = [
          {
            filterType: "item",
            operation: "OR",
            filters: [
              {
                filterType: "item",
                term: "water",
              },
            ],
          },
        ];
        const opts: IHubSearchOptions = {
          requestOptions: {
            portal: "https://qaext.arcgis.com/sharing/rest",
          },
          api: "arcgis",
          include: ["server"],
        };
        const chk = await hubSearch(fg, opts);
        expect(chk.total).toBe(99);
        expect(portalSearchItemsSpyFG.calls.count()).toBe(1);
        expect(portalSearchGroupsSpyFG.calls.count()).toBe(0);
        expect(hubSearchFilterGroupsItemsSpyFG.calls.count()).toBe(0);
        const [filterGroups, options] = portalSearchItemsSpyFG.calls.argsFor(0);
        expect(filterGroups).toEqual(fg);
        expect(options.include).toBeDefined();
        expect(options.requestOptions).toEqual(opts.requestOptions);
      });
      it("items + arcgis-hub: hubSearchFilterGroupsItems", async () => {
        const fg: Array<IFilterGroup<FilterType>> = [
          {
            filterType: "item",
            operation: "OR",
            filters: [
              {
                filterType: "item",
                term: "water",
              },
            ],
          },
        ];
        const opts: IHubSearchOptions = {
          requestOptions: {
            portal: "https://qaext.arcgis.com/sharing/rest",
          },
          api: "hubDEV",
          include: ["server"],
        };
        const chk = await hubSearch(fg, opts);
        expect(chk.total).toBe(99);
        expect(portalSearchItemsSpyFG.calls.count()).toBe(0);
        expect(portalSearchGroupsSpyFG.calls.count()).toBe(0);
        expect(hubSearchFilterGroupsItemsSpyFG.calls.count()).toBe(1);
        const [filterGroups, options] =
          hubSearchFilterGroupsItemsSpyFG.calls.argsFor(0);
        expect(filterGroups).toEqual(fg);
        expect(options.include).toBeDefined();
        expect(options.requestOptions).toEqual(opts.requestOptions);
      });
      it("groups + arcgis: portalSearchItems", async () => {
        const fg: Array<IFilterGroup<FilterType>> = [
          {
            filterType: "group",
            operation: "OR",
            filters: [
              {
                filterType: "group",
                term: "water",
              },
            ],
          },
        ];
        const opts: IHubSearchOptions = {
          requestOptions: {
            portal: "https://qaext.arcgis.com/sharing/rest",
          },
          api: "arcgis",
          include: ["server"],
        };
        const chk = await hubSearch(fg, opts);
        expect(chk.total).toBe(99);
        expect(portalSearchItemsSpyFG.calls.count()).toBe(0);
        expect(portalSearchGroupsSpyFG.calls.count()).toBe(1);
        expect(hubSearchFilterGroupsItemsSpyFG.calls.count()).toBe(0);
        const [filterGroups, options] =
          portalSearchGroupsSpyFG.calls.argsFor(0);
        expect(filterGroups).toEqual(fg);
        expect(options.include).toBeDefined();
        expect(options.requestOptions).toEqual(opts.requestOptions);
      });
    });
  });
  describe("hubSearch:", () => {
    describe("guards:", () => {
      it("throws if Query not passed", async () => {
        try {
          await hubSearchQuery(
            null as unknown as IQuery,
            {} as unknown as IHubSearchOptions
          );
        } catch (err) {
          expect(err.name).toBe("HubError");
          expect(err.message).toBe("Query is required.");
        }
      });
      it("throws if Query does not have filters prop", async () => {
        try {
          await hubSearchQuery(
            {} as unknown as IQuery,
            {} as unknown as IHubSearchOptions
          );
        } catch (err) {
          expect(err.name).toBe("HubError");
          expect(err.message).toBe("Query must contain at least one Filter.");
        }
      });
      it("throws if Query does not have filters with entries", async () => {
        try {
          await hubSearchQuery(
            { filters: [] } as unknown as IQuery,
            {} as unknown as IHubSearchOptions
          );
        } catch (err) {
          expect(err.name).toBe("HubError");
          expect(err.message).toBe("Query must contain at least one Filter.");
        }
      });
      it("throws if options does not have requestOptions", async () => {
        const qry: IQuery = {
          targetEntity: "item",
          filters: [
            {
              predicates: [{ term: "water" }],
            },
          ],
        };

        try {
          await hubSearchQuery(qry, {} as unknown as IHubSearchOptions);
        } catch (err) {
          expect(err.name).toBe("HubError");
          expect(err.message).toBe(
            "requestOptions: IHubRequestOptions is required."
          );
        }
      });
      it("throws if function is not available", async () => {
        const qry: IQuery = {
          targetEntity: "group",
          filters: [
            {
              predicates: [{ term: "water" }],
            },
          ],
        };
        const opts: IHubSearchOptions = {
          requestOptions: {
            portal: "https://qaext.arcgis.com/sharing/rest",
          },
          api: "hubDEV",
          include: ["server"],
        };
        try {
          await hubSearchQuery(qry, opts);
        } catch (err) {
          expect(err.name).toBe("HubError");
          expect(err.message).toBe(
            `Search via "group" filter against "arcgis-hub" api is not implemented`
          );
        }
      });
    });
    describe("delegations:", () => {
      let portalSearchItemsSpy: jasmine.Spy;
      let portalSearchGroupsSpy: jasmine.Spy;
      let hubSearchItemsSpy: jasmine.Spy;
      beforeEach(() => {
        // we are only interested in verifying that the fn was called with specific args
        // so all the responses are fake
        portalSearchItemsSpy = spyOn(
          SearchFunctionModule,
          "portalSearchItems"
        ).and.callFake(() => {
          return Promise.resolve({
            hasNext: false,
            results: [],
            total: 99,
          });
        });
        portalSearchGroupsSpy = spyOn(
          SearchFunctionModule,
          "portalSearchGroups"
        ).and.callFake(() => {
          return Promise.resolve({
            hasNext: false,
            results: [],
            total: 99,
          });
        });
        hubSearchItemsSpy = spyOn(
          SearchFunctionModule,
          "hubSearchItems"
        ).and.callFake(() => {
          return Promise.resolve({
            hasNext: false,
            results: [],
            total: 99,
          });
        });
      });
      it("items: portalSearchItems", async () => {
        const qry: IQuery = {
          targetEntity: "item",
          filters: [
            {
              predicates: [{ term: "water" }],
            },
          ],
        };
        const opts: IHubSearchOptions = {
          requestOptions: {
            portal: "https://qaext.arcgis.com/sharing/rest",
          },
        };
        const chk = await hubSearchQuery(qry, opts);
        expect(chk.total).toBe(99);
        expect(portalSearchItemsSpy.calls.count()).toBe(
          1,
          "should call portalSearchItems once"
        );
        expect(portalSearchGroupsSpy.calls.count()).toBe(
          0,
          "should not call portalSearchGroups"
        );
        expect(hubSearchItemsSpy.calls.count()).toBe(
          0,
          "should not call hubSearch"
        );
        const [query, options] = portalSearchItemsSpy.calls.argsFor(0);
        expect(query).toEqual(qry);
        expect(options.include).toBeDefined();
        expect(options.requestOptions).toEqual(opts.requestOptions);
      });
      it("items + arcgis: portalSearchItems", async () => {
        const qry: IQuery = {
          targetEntity: "item",
          filters: [
            {
              predicates: [{ term: "water" }],
            },
          ],
        };
        const opts: IHubSearchOptions = {
          requestOptions: {
            portal: "https://qaext.arcgis.com/sharing/rest",
          },
          api: "arcgis",
          include: ["server"],
        };
        const chk = await hubSearchQuery(qry, opts);
        expect(chk.total).toBe(99);
        expect(portalSearchItemsSpy.calls.count()).toBe(1);
        expect(portalSearchGroupsSpy.calls.count()).toBe(0);
        expect(hubSearchItemsSpy.calls.count()).toBe(0);
        const [query, options] = portalSearchItemsSpy.calls.argsFor(0);
        expect(query).toEqual(qry);
        expect(options.include).toBeDefined();
        expect(options.requestOptions).toEqual(opts.requestOptions);
      });
      it("items + arcgis-hub: hubSearchItems", async () => {
        const qry: IQuery = {
          targetEntity: "item",
          filters: [
            {
              predicates: [{ term: "water" }],
            },
          ],
        };
        const opts: IHubSearchOptions = {
          requestOptions: {
            portal: "https://qaext.arcgis.com/sharing/rest",
          },
          api: "hubDEV",
          include: ["server"],
        };
        const chk = await hubSearchQuery(qry, opts);
        expect(chk.total).toBe(99);
        expect(portalSearchItemsSpy.calls.count()).toBe(0);
        expect(portalSearchGroupsSpy.calls.count()).toBe(0);
        expect(hubSearchItemsSpy.calls.count()).toBe(1);
        const [query, options] = hubSearchItemsSpy.calls.argsFor(0);
        expect(query).toEqual(qry);
        expect(options.include).toBeDefined();
        expect(options.requestOptions).toEqual(opts.requestOptions);
      });
      it("groups + arcgis: portalSearchGroups", async () => {
        const qry: IQuery = {
          targetEntity: "group",
          filters: [
            {
              predicates: [{ term: "water" }],
            },
          ],
        };
        const opts: IHubSearchOptions = {
          requestOptions: {
            portal: "https://qaext.arcgis.com/sharing/rest",
          },
          api: "arcgis",
          include: ["server"],
        };
        const chk = await hubSearchQuery(qry, opts);
        expect(chk.total).toBe(99);
        expect(portalSearchItemsSpy.calls.count()).toBe(0);
        expect(portalSearchGroupsSpy.calls.count()).toBe(1);
        expect(hubSearchItemsSpy.calls.count()).toBe(0);
        const [query, options] = portalSearchGroupsSpy.calls.argsFor(0);
        expect(query).toEqual(qry);
        expect(options.include).toBeDefined();
        expect(options.requestOptions).toEqual(opts.requestOptions);
      });
    });
  });
});
