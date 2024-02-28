import { IHubSearchOptions, IQuery } from "../../src";
import { hubSearch } from "../../src/search/hubSearch";

describe("hubSearch Module:", () => {
  describe("hubSearch:", () => {
    describe("guards:", () => {
      it("throws if Query not passed", async () => {
        try {
          await hubSearch(
            null as unknown as IQuery,
            {} as unknown as IHubSearchOptions
          );
        } catch (err) {
          expect(err.name).toBe("HubError");
          expect(err.message).toBe("Query is required.");
        }
      });
      it("throws if Query does not have filters", async () => {
        try {
          await hubSearch(
            {} as unknown as IQuery,
            {} as unknown as IHubSearchOptions
          );
        } catch (err) {
          expect(err.name).toBe("HubError");
          expect(err.message).toBe("Query must have a filters array.");
        }
      });
      it("throws if Query has an empty filters array and no collection prop", async () => {
        try {
          await hubSearch(
            { filters: [] } as unknown as IQuery,
            {} as unknown as IHubSearchOptions
          );
        } catch (err) {
          expect(err.name).toBe("HubError");
          expect(err.message).toBe(
            "Query must contain at least one Filter or a collection."
          );
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
          await hubSearch(qry, {} as unknown as IHubSearchOptions);
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
          await hubSearch(qry, opts);
        } catch (err) {
          expect(err.name).toBe("HubError");
          expect(err.message).toBe(
            `Search via "group" filter against "arcgis-hub" api is not implemented. Please ensure "targetEntity" is defined on the query.`
          );
        }
      });
    });
    describe("delegations:", () => {
      let portalSearchItemsSpy: jasmine.Spy;
      let portalSearchGroupsSpy: jasmine.Spy;
      let hubSearchItemsSpy: jasmine.Spy;
      let hubSearchChannelsSpy: jasmine.Spy;
      beforeEach(() => {
        // we are only interested in verifying that the fn was called with specific args
        // so all the responses are fake
        portalSearchItemsSpy = spyOn(
          require("../../src/search/_internal/portalSearchItems"),
          "portalSearchItems"
        ).and.callFake(() => {
          return Promise.resolve({
            hasNext: false,
            results: [],
            total: 99,
          });
        });
        portalSearchGroupsSpy = spyOn(
          require("../../src/search/_internal/portalSearchGroups"),
          "portalSearchGroups"
        ).and.callFake(() => {
          return Promise.resolve({
            hasNext: false,
            results: [],
            total: 99,
          });
        });
        hubSearchItemsSpy = spyOn(
          require("../../src/search/_internal/hubSearchItems"),
          "hubSearchItems"
        ).and.callFake(() => {
          return Promise.resolve({
            hasNext: false,
            results: [],
            total: 99,
          });
        });
        hubSearchChannelsSpy = spyOn(
          require("../../src/search/_internal/hubSearchChannels"),
          "hubSearchChannels"
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
        const chk = await hubSearch(qry, opts);
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
        // Any cloning of auth can break downstream functions
        expect(options.requestOptions).toBe(opts.requestOptions);
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
        const chk = await hubSearch(qry, opts);
        expect(chk.total).toBe(99);
        expect(portalSearchItemsSpy.calls.count()).toBe(1);
        expect(portalSearchGroupsSpy.calls.count()).toBe(0);
        expect(hubSearchItemsSpy.calls.count()).toBe(0);
        const [query, options] = portalSearchItemsSpy.calls.argsFor(0);
        expect(query).toEqual(qry);
        expect(options.include).toBeDefined();
        // Any cloning of auth can break downstream functions
        expect(options.requestOptions).toBe(opts.requestOptions);
      });
      it("items + arcgis-hub: hubSearchItems", async () => {
        const qry: IQuery = {
          targetEntity: "item",
          collection: "dataset",
          filters: [
            {
              predicates: [{ term: "water" }],
            },
          ],
        };
        const opts: IHubSearchOptions = {
          site: "https://my-site.hub.arcgis.com",
          requestOptions: {
            isPortal: false,
            portal: "https://qaext.arcgis.com/sharing/rest",
            hubApiUrl: "https://hubqa.arcgis.com",
          },
          include: ["server"],
        };
        const chk = await hubSearch(qry, opts);
        expect(chk.total).toBe(99);
        expect(portalSearchItemsSpy.calls.count()).toBe(0);
        expect(portalSearchGroupsSpy.calls.count()).toBe(0);
        expect(hubSearchItemsSpy.calls.count()).toBe(1);
        const [query, options] = hubSearchItemsSpy.calls.argsFor(0);
        expect(query).toEqual(qry);
        expect(options.include).toBeDefined();
        // Any cloning of auth can break downstream functions
        expect(options.requestOptions).toBe(opts.requestOptions);
        expect(options.api).toEqual({
          type: "arcgis-hub",
          url: "https://hubqa.arcgis.com/api/search/v1",
        });
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
        const chk = await hubSearch(qry, opts);
        expect(chk.total).toBe(99);
        expect(portalSearchItemsSpy.calls.count()).toBe(0);
        expect(portalSearchGroupsSpy.calls.count()).toBe(1);
        expect(hubSearchItemsSpy.calls.count()).toBe(0);
        const [query, options] = portalSearchGroupsSpy.calls.argsFor(0);
        expect(query).toEqual(qry);
        expect(options.include).toBeDefined();
        // Any cloning of auth can break downstream functions
        expect(options.requestOptions).toBe(opts.requestOptions);
      });
      it("channels + discussions: hubSearchChannels", async () => {
        const qry: IQuery = {
          targetEntity: "channel",
          filters: [
            {
              predicates: [{ term: "water" }],
            },
          ],
        };
        const opts: IHubSearchOptions = {
          requestOptions: {
            hubApiUrl: "https://hubqa.arcgis.com/api",
          },
          api: {
            type: "arcgis-hub",
            url: null,
          } as any,
        };
        const chk = await hubSearch(qry, opts);
        expect(chk.total).toBe(99);
        expect(hubSearchChannelsSpy.calls.count()).toBe(1);
        const [query, options] = hubSearchChannelsSpy.calls.argsFor(0);
        expect(query).toEqual(qry);
        expect(options).toEqual(opts);
      });
      it("discussionPost + arcgis-hub: hubSearchItems", async () => {
        const qry: IQuery = {
          targetEntity: "discussionPost",
          collection: "discussion-post" as any,
          filters: [
            {
              predicates: [{ term: "water" }],
            },
          ],
        };
        const opts: IHubSearchOptions = {
          site: "https://my-site.hub.arcgis.com",
          requestOptions: {
            isPortal: false,
            portal: "https://qaext.arcgis.com/sharing/rest",
            hubApiUrl: "https://hubqa.arcgis.com",
          },
          include: ["server"],
        };
        const chk = await hubSearch(qry, opts);
        expect(chk.total).toBe(99);
        expect(portalSearchItemsSpy.calls.count()).toBe(0);
        expect(portalSearchGroupsSpy.calls.count()).toBe(0);
        expect(hubSearchItemsSpy.calls.count()).toBe(1);
        const [query, options] = hubSearchItemsSpy.calls.argsFor(0);
        expect(query).toEqual(qry);
        expect(options.include).toBeDefined();
        // Any cloning of auth can break downstream functions
        expect(options.requestOptions).toBe(opts.requestOptions);
        expect(options.api).toEqual({
          type: "arcgis-hub",
          url: "https://hubqa.arcgis.com/api/search/v1",
        });
      });
    });
  });
});
