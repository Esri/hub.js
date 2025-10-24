import { describe, it, expect, beforeEach, vi } from "vitest";
import { hubSearch } from "../../src/search/hubSearch";
import { EntityType, IQuery } from "../../src/search/types/IHubCatalog";
import { IHubSearchOptions } from "../../src/search/types/IHubSearchOptions";
import * as portalSearchItemsModule from "../../src/search/_internal/portalSearchItems";
import * as portalSearchGroupsModule from "../../src/search/_internal/portalSearchGroups";
import * as hubSearchItemsModule from "../../src/search/_internal/hubSearchItems";
import * as hubSearchChannelsModule from "../../src/search/_internal/hubSearchChannels";
import * as hubSearchPostsModule from "../../src/search/_internal/hubSearchPosts";

describe("hubSearch Module:", () => {
  describe("hubSearch:", () => {
    describe("guards:", () => {
      it("throws if Query not passed", async () => {
        try {
          await hubSearch(
            null as unknown as IQuery,
            {} as unknown as IHubSearchOptions
          );
          throw new Error("should not get here");
        } catch (err) {
          const error = err as { name?: string; message?: string };
          expect(error.name).toBe("HubError");
          expect(error.message).toBe("Query is required.");
        }
      });
      it("throws if Query does not have filters", async () => {
        try {
          await hubSearch(
            {} as unknown as IQuery,
            {} as unknown as IHubSearchOptions
          );
          throw new Error("should not get here");
        } catch (err) {
          const error = err as { name?: string; message?: string };
          expect(error.name).toBe("HubError");
          expect(error.message).toBe("Query must have a filters array.");
        }
      });
      it("throws if Query has an empty filters array", async () => {
        try {
          await hubSearch(
            { filters: [] } as unknown as IQuery,
            {} as unknown as IHubSearchOptions
          );
          throw new Error("should not get here");
        } catch (err) {
          const error = err as { name?: string; message?: string };
          expect(error.name).toBe("HubError");
          expect(error.message).toBe("Query must contain at least one Filter.");
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
          throw new Error("should not get here");
        } catch (err) {
          const error = err as { name?: string; message?: string };
          expect(error.name).toBe("HubError");
          expect(error.message).toBe(
            "requestOptions: IHubRequestOptions is required."
          );
        }
      });
      it("throws if function is not available", async () => {
        const qry: IQuery = {
          targetEntity: "non-existent" as unknown as EntityType,
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
        try {
          await hubSearch(qry, opts);
          throw new Error("should not get here");
        } catch (err) {
          const error = err as { name?: string; message?: string };
          expect(error.name).toBe("HubError");
          expect(error.message).toBe(
            `Search via "non-existent" filter against "portal" api is not implemented. Please ensure "targetEntity" is defined on the query.`
          );
        }
      });
    });
    describe("delegations:", () => {
      let portalSearchItemsSpy: ReturnType<typeof vi.spyOn>;
      let portalSearchGroupsSpy: ReturnType<typeof vi.spyOn>;
      let hubSearchItemsSpy: ReturnType<typeof vi.spyOn>;
      let hubSearchChannelsSpy: ReturnType<typeof vi.spyOn>;
      let hubSearchPostsSpy: ReturnType<typeof vi.spyOn>;
      beforeEach(() => {
        // we are only interested in verifying that the fn was called with specific args
        // so all the responses are fake
        portalSearchItemsSpy = vi
          .spyOn(portalSearchItemsModule, "portalSearchItems")
          .mockImplementation(() => {
            return Promise.resolve({
              hasNext: false,
              results: [],
              total: 99,
            });
          });
        portalSearchGroupsSpy = vi
          .spyOn(portalSearchGroupsModule, "portalSearchGroups")
          .mockImplementation(() => {
            return Promise.resolve({
              hasNext: false,
              results: [],
              total: 99,
            });
          });
        hubSearchItemsSpy = vi
          .spyOn(hubSearchItemsModule, "hubSearchItems")
          .mockImplementation(() => {
            return Promise.resolve({
              hasNext: false,
              results: [],
              total: 99,
            });
          });
        hubSearchChannelsSpy = vi
          .spyOn(hubSearchChannelsModule, "hubSearchChannels")
          .mockImplementation(() => {
            return Promise.resolve({
              hasNext: false,
              results: [],
              total: 99,
            });
          });
        hubSearchPostsSpy = vi
          .spyOn(hubSearchPostsModule, "hubSearchPosts")
          .mockImplementation(() => {
            return Promise.resolve({
              hasNext: false,
              results: [],
              total: 77,
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
        expect(portalSearchItemsSpy).toHaveBeenCalledTimes(1);
        expect(portalSearchGroupsSpy).toHaveBeenCalledTimes(0);
        expect(hubSearchItemsSpy).toHaveBeenCalledTimes(0);
        const [query, options] = portalSearchItemsSpy.mock.calls[0];
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
          include: ["server"],
        };
        const chk = await hubSearch(qry, opts);
        expect(chk.total).toBe(99);
        expect(portalSearchItemsSpy).toHaveBeenCalledTimes(1);
        expect(portalSearchGroupsSpy).toHaveBeenCalledTimes(0);
        expect(hubSearchItemsSpy).toHaveBeenCalledTimes(0);
        const [query, options] = portalSearchItemsSpy.mock.calls[0];
        expect(query).toEqual(qry);
        expect(options.include).toBeDefined();
        // Any cloning of auth can break downstream functions
        expect(options.requestOptions).toBe(opts.requestOptions);
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
          api: "hub",
          requestOptions: {
            isPortal: false,
            portal: "https://qaext.arcgis.com/sharing/rest",
            hubApiUrl: "https://hubqa.arcgis.com",
          },
          include: ["server"],
        };
        const chk = await hubSearch(qry, opts);
        expect(chk.total).toBe(99);
        expect(portalSearchItemsSpy).toHaveBeenCalledTimes(0);
        expect(portalSearchGroupsSpy).toHaveBeenCalledTimes(0);
        expect(hubSearchItemsSpy).toHaveBeenCalledTimes(1);
        const [query, options] = hubSearchItemsSpy.mock.calls[0];
        expect(query).toEqual(qry);
        expect(options.include).toBeDefined();
        // Any cloning of auth can break downstream functions
        expect(options.requestOptions).toBe(opts.requestOptions);
        expect(options.api).toEqual("hub");
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
          include: ["server"],
        };
        const chk = await hubSearch(qry, opts);
        expect(chk.total).toBe(99);
        expect(portalSearchItemsSpy).toHaveBeenCalledTimes(0);
        expect(portalSearchGroupsSpy).toHaveBeenCalledTimes(1);
        expect(hubSearchItemsSpy).toHaveBeenCalledTimes(0);
        const [query, options] = portalSearchGroupsSpy.mock.calls[0];
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
        };
        const chk = await hubSearch(qry, opts);
        expect(chk.total).toBe(99);
        expect(hubSearchChannelsSpy).toHaveBeenCalledTimes(1);
        const [query, options] = hubSearchChannelsSpy.mock.calls[0];
        expect(query).toEqual(qry);
        expect(options).toEqual({ ...opts, api: "hub" });
      });
      it("posts + hub: hubSearchPosts", async () => {
        const qry: IQuery = {
          targetEntity: "post",
          filters: [
            {
              predicates: [{ id: ["p1", "p2"] }],
            },
          ],
        };
        const opts: IHubSearchOptions = {
          requestOptions: {
            hubApiUrl: "https://hubqa.arcgis.com/api",
          },
        };
        const chk = await hubSearch(qry, opts);
        expect(chk.total).toBe(77);
        expect(hubSearchPostsSpy).toHaveBeenCalledTimes(1);
        const [query, options] = hubSearchPostsSpy.mock.calls[0];
        expect(query).toEqual(qry);
        expect(options).toEqual({ ...opts, api: "hub" });
      });
      it("discussionPost + arcgis-hub: hubSearchItems", async () => {
        const qry: IQuery = {
          targetEntity: "discussionPost",
          filters: [
            {
              predicates: [{ term: "water" }],
            },
          ],
        };
        const opts: IHubSearchOptions = {
          requestOptions: {
            isPortal: false,
            portal: "https://qaext.arcgis.com/sharing/rest",
            hubApiUrl: "https://hubqa.arcgis.com",
          },
          include: ["server"],
        };
        const chk = await hubSearch(qry, opts);
        expect(chk.total).toBe(99);
        expect(portalSearchItemsSpy).toHaveBeenCalledTimes(0);
        expect(portalSearchGroupsSpy).toHaveBeenCalledTimes(0);
        expect(hubSearchItemsSpy).toHaveBeenCalledTimes(1);
        const [query, options] = hubSearchItemsSpy.mock.calls[0];
        expect(query).toEqual(qry);
        expect(options.include).toBeDefined();
        // Any cloning of auth can break downstream functions
        expect(options.requestOptions).toBe(opts.requestOptions);
        expect(options.api).toEqual("hub");
      });
    });
  });
});
