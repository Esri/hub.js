import { IPortal, IUser } from "@esri/arcgis-rest-portal";
import { cloneObject, getProp, IArcGISContext } from "../../src";
import { ArcGISContextManager } from "../../src/ArcGISContextManager";
import {
  EntityType,
  ICatalogScope,
  IFilter,
  IHubCatalog,
  IHubCollection,
  IHubSearchResponse,
  IHubSearchResult,
  IPredicate,
  IQuery,
} from "../../src/search";
import { Catalog } from "../../src/search";
import * as FetchCatalogModule from "../../src/search/fetchCatalog";
import * as HubSearchModule from "../../src/search/hubSearch";
import { MOCK_AUTH } from "../mocks/mock-auth";

const catalogJson: IHubCatalog = {
  title: "Demo Catalog",
  schemaVersion: 1,
  scopes: {
    item: {
      targetEntity: "item",
      filters: [
        {
          predicates: [
            {
              group: ["3ef", "bc5"],
            },
          ],
        },
      ],
    },
    group: {
      targetEntity: "group",
      filters: [
        {
          predicates: [
            {
              orgid: "abc123",
            },
          ],
        },
      ],
    },
    user: {
      targetEntity: "user",
      filters: [
        {
          predicates: [
            {
              orgid: "abc123",
            },
          ],
        },
      ],
    },
  },
  collections: [
    {
      key: "teams",
      label: "Project Teams",
      targetEntity: "group",
      scope: {
        targetEntity: "group",
        filters: [
          {
            predicates: [
              {
                tag: "Project Team",
              },
            ],
          },
        ],
      },
    },
    {
      key: "environment",
      label: "Environment",
      targetEntity: "item",
      scope: {
        targetEntity: "item",
        filters: [
          {
            predicates: [
              {
                type: "Feature Service",
                tag: "authoritative",
              },
            ],
          },
        ],
      },
    },
  ],
};

describe("Catalog Class:", () => {
  let context: IArcGISContext;
  beforeEach(async () => {
    const authdCtxMgr = await ArcGISContextManager.create({
      authentication: MOCK_AUTH,
      currentUser: {
        username: "casey",
      } as unknown as IUser,
      portal: {
        name: "DC R&D Center",
        id: "BRXFAKE",
        urlKey: "fake-org",
      } as unknown as IPortal,
      portalUrl: "https://myserver.com",
    });
    context = authdCtxMgr.context;
  });
  describe("fromJson", () => {
    it("verify properties", () => {
      const instance = Catalog.fromJson(cloneObject(catalogJson), context);
      expect(instance.toJson()).toEqual(catalogJson);
      expect(instance.schemaVersion).toEqual(catalogJson.schemaVersion);
      expect(instance.title).toEqual(catalogJson.title as string);
      expect(instance.scopes).toEqual(catalogJson.scopes as ICatalogScope);
      expect(instance.getScope("item")).toEqual(
        catalogJson.scopes?.item as IQuery
      );
      expect(instance.collections).toEqual(
        catalogJson.collections as IHubCollection[]
      );
      expect(instance.collectionNames).toEqual(["teams", "environment"]);
      instance.title = "Changed Title";
      expect(instance.title).toBe("Changed Title");
      expect(instance.availableScopes).toEqual(["item", "group", "user"]);
    });
    it("allows null collections", () => {
      const noCollectionsCatalog = cloneObject(catalogJson);
      delete noCollectionsCatalog.collections;
      const instance = Catalog.fromJson(noCollectionsCatalog, context);
      expect(instance.collections.length).toBe(0);
    });
  });

  describe("initialize", () => {
    let fetchCatalogSpy: jasmine.Spy;
    it("defaults to AGO anonymous", async () => {
      fetchCatalogSpy = spyOn(FetchCatalogModule, "fetchCatalog").and.callFake(
        () => {
          return Promise.resolve(cloneObject(catalogJson));
        }
      );
      const instance = await Catalog.init("https://somesite.com");
      expect(instance.toJson()).toEqual(catalogJson);
      const userQuery: IQuery = { targetEntity: "user", filters: [] };
      instance.setScope("user", userQuery);
      expect(instance.getScope("user")).toEqual(userQuery);
      const [id, hubReqOpts] = fetchCatalogSpy.calls.argsFor(0);
      expect(id).toEqual("https://somesite.com");
      expect(hubReqOpts.portal).toEqual("https://www.arcgis.com/sharing/rest");
      expect(hubReqOpts.isPortal).toEqual(false);
    });
    it("fetches the catalog", async () => {
      fetchCatalogSpy = spyOn(FetchCatalogModule, "fetchCatalog").and.callFake(
        () => {
          return Promise.resolve(cloneObject(catalogJson));
        }
      );
      const instance = await Catalog.init("https://somesite.com", context);
      expect(instance.toJson()).toEqual(catalogJson);
      const userQuery: IQuery = { targetEntity: "user", filters: [] };
      instance.setScope("user", userQuery);
      expect(instance.getScope("user")).toEqual(userQuery);
      const id = fetchCatalogSpy.calls.argsFor(0)[0];
      expect(id).toEqual("https://somesite.com");
    });
  });

  describe("getCollection", () => {
    it("throws if collection not found", () => {
      const instance = Catalog.fromJson(cloneObject(catalogJson), context);
      try {
        instance.getCollection("invalid");
      } catch (err) {
        expect(getProp(err, "name")).toBe("HubError");
        expect(getProp(err, "message")).toContain(
          'Collection "invalid" is not present in the Catalog'
        );
      }
    });
    it("get collection merges catalog scope", () => {
      const instance = Catalog.fromJson(cloneObject(catalogJson), context);
      const envCollection = instance.getCollection("environment");
      expect(envCollection.scope.filters.length).toBe(2);
    });
    it("get collection works without catalog scope", () => {
      const cat = cloneObject(catalogJson);
      delete cat.scopes?.group;
      const instance = Catalog.fromJson(cat, context);
      const teamsCollection = instance.getCollection("teams");
      expect(teamsCollection.scope.filters.length).toBe(1);
    });
  });
  describe("getCustomCollection:", () => {
    it("returns base scope if no filters passed", () => {
      const instance = Catalog.fromJson(cloneObject(catalogJson), context);
      const collection = instance.getCustomCollection("item", []);
      expect(collection).toBeDefined();
      expect(collection?.key).toBe("item-custom");
      const json = collection?.toJson();
      expect(json?.scope).toEqual(catalogJson.scopes?.item as IQuery);
    });

    it("adds passed filters to base scope", () => {
      const instance = Catalog.fromJson(cloneObject(catalogJson), context);
      const f: IFilter[] = [{ predicates: [{ type: "Web Map" }] }];
      const collection = instance.getCustomCollection("item", f);
      expect(collection).toBeDefined();
      expect(collection?.key).toBe("item-custom");
      const json = collection?.toJson();
      expect(json?.scope.filters.length).toEqual(2);
    });

    it("if no base scope just uses passed filters", () => {
      const jsonCat = cloneObject(catalogJson);
      delete jsonCat.scopes?.item;
      const instance = Catalog.fromJson(jsonCat, context);
      const f: IFilter[] = [{ predicates: [{ type: "Web Map" }] }];
      const collection = instance.getCustomCollection("item", f);
      expect(collection).toBeDefined();
      expect(collection?.key).toBe("item-custom");
      const json = collection?.toJson();
      expect(json?.scope.filters.length).toEqual(1);
    });
  });

  describe("search:", () => {
    let hubSearchSpy: jasmine.Spy;
    it("searchItems with string", async () => {
      hubSearchSpy = spyOn(HubSearchModule, "hubSearch").and.callFake(() => {
        return Promise.resolve({ fake: "response" });
      });
      const instance = Catalog.fromJson(cloneObject(catalogJson), context);
      const res = await instance.searchItems("water");
      // ensure the spy was called
      expect(res).toEqual({
        fake: "response",
      } as unknown as IHubSearchResponse<IHubSearchResult>);
      // check the args
      const [query, opts] = hubSearchSpy.calls.argsFor(0);
      expect(query.targetEntity).toBe("item");
      expect(query.filters[0].predicates[0].term).toBe("water");
      expect(query.filters[1]).toEqual(catalogJson.scopes?.item?.filters[0]);
    });
    it("searchItems with string and options", async () => {
      hubSearchSpy = spyOn(HubSearchModule, "hubSearch").and.callFake(() => {
        return Promise.resolve({ fake: "response" });
      });
      const instance = Catalog.fromJson(cloneObject(catalogJson), context);
      const res = await instance.searchItems("water", { num: 50 });
      // ensure the spy was called
      expect(res).toEqual({
        fake: "response",
      } as unknown as IHubSearchResponse<IHubSearchResult>);
      // check the args
      const [query, opts] = hubSearchSpy.calls.argsFor(0);
      expect(query.targetEntity).toBe("item");
      expect(query.filters[0].predicates[0].term).toBe("water");
      expect(query.filters[1]).toEqual(catalogJson.scopes?.item?.filters[0]);
    });

    it("searcheItems with query", async () => {
      hubSearchSpy = spyOn(HubSearchModule, "hubSearch").and.callFake(() => {
        return Promise.resolve({ fake: "response" });
      });
      const instance = Catalog.fromJson(cloneObject(catalogJson), context);
      const qry: IQuery = {
        targetEntity: "item",
        filters: [
          {
            predicates: [
              {
                term: "Pine St",
              },
            ],
          },
        ],
      };
      const res = await instance.searchItems(qry);
      // ensure the spy was called
      expect(res).toEqual({
        fake: "response",
      } as unknown as IHubSearchResponse<IHubSearchResult>);
      const [query, opts] = hubSearchSpy.calls.argsFor(0);
      expect(query.targetEntity).toBe("item");
      expect(query.filters[0].predicates[0].term).toBe("Pine St");
      expect(opts.requestOptions).toEqual(context.hubRequestOptions);
    });

    it("searchGroup by term", async () => {
      hubSearchSpy = spyOn(HubSearchModule, "hubSearch").and.callFake(() => {
        return Promise.resolve({ fake: "response" });
      });
      const instance = Catalog.fromJson(cloneObject(catalogJson), context);
      const res = await instance.searchGroups("water");
      // ensure the spy was called
      expect(res).toEqual({
        fake: "response",
      } as unknown as IHubSearchResponse<IHubSearchResult>);
      // check the args
      const [query, opts] = hubSearchSpy.calls.argsFor(0);
      expect(query.targetEntity).toBe("group");
      expect(query.filters[0].predicates[0].term).toBe("water");
      expect(query.filters[1]).toEqual(catalogJson.scopes?.group?.filters[0]);
    });
    it("searchGroup by term and options", async () => {
      hubSearchSpy = spyOn(HubSearchModule, "hubSearch").and.callFake(() => {
        return Promise.resolve({ fake: "response" });
      });
      const instance = Catalog.fromJson(cloneObject(catalogJson), context);
      const res = await instance.searchGroups("water", { num: 50 });
      // ensure the spy was called
      expect(res).toEqual({
        fake: "response",
      } as unknown as IHubSearchResponse<IHubSearchResult>);
      // check the args
      const [query, opts] = hubSearchSpy.calls.argsFor(0);
      expect(query.targetEntity).toBe("group");
      expect(query.filters[0].predicates[0].term).toBe("water");
      expect(query.filters[1]).toEqual(catalogJson.scopes?.group?.filters[0]);
    });

    it("searchUsers by term", async () => {
      hubSearchSpy = spyOn(HubSearchModule, "hubSearch").and.callFake(() => {
        return Promise.resolve({ fake: "response" });
      });
      const instance = Catalog.fromJson(cloneObject(catalogJson), context);
      const res = await instance.searchUsers("water");
      // ensure the spy was called
      expect(res).toEqual({
        fake: "response",
      } as unknown as IHubSearchResponse<IHubSearchResult>);
      // check the args
      const [query, opts] = hubSearchSpy.calls.argsFor(0);
      expect(query.targetEntity).toBe("user");
      expect(query.filters[0].predicates[0].term).toBe("water");
      expect(query.filters[1]).toEqual(catalogJson.scopes?.user?.filters[0]);
    });

    it("searchCollections by term", async () => {
      hubSearchSpy = spyOn(HubSearchModule, "hubSearch").and.callFake(() => {
        return Promise.resolve({ fake: "response" });
      });
      const instance = Catalog.fromJson(cloneObject(catalogJson), context);
      const res = await instance.searchCollections("water");
      // ensure the spy was called
      expect(hubSearchSpy.calls.count()).toBe(2);
      expect(res.teams).toBeDefined();
      expect(res.teams).toEqual({
        fake: "response",
      } as unknown as IHubSearchResponse<IHubSearchResult>);
      expect(res.environment).toBeDefined();
      expect(res.environment).toEqual({
        fake: "response",
      } as unknown as IHubSearchResponse<IHubSearchResult>);
    });

    it("searchScopes by term", async () => {
      hubSearchSpy = spyOn(HubSearchModule, "hubSearch").and.callFake(() => {
        return Promise.resolve({ fake: "response" });
      });
      const instance = Catalog.fromJson(cloneObject(catalogJson), context);
      const res = await instance.searchScopes("water");
      // ensure the spy was called
      expect(hubSearchSpy.calls.count()).toBe(3);
      expect(res.user).toBeDefined();
      expect(res.user).toEqual({
        fake: "response",
      } as unknown as IHubSearchResponse<IHubSearchResult>);
      expect(res.item).toBeDefined();
      expect(res.item).toEqual({
        fake: "response",
      } as unknown as IHubSearchResponse<IHubSearchResult>);
      expect(res.group).toBeDefined();
      expect(res.group).toEqual({
        fake: "response",
      } as unknown as IHubSearchResponse<IHubSearchResult>);
    });

    it("returns empty results if item scope does not exist", async () => {
      const cat = cloneObject(catalogJson);
      delete cat.scopes?.item;
      const instance = Catalog.fromJson(cat, context);

      const res = await instance.searchItems("water");
      expect(res.results.length).toBe(0);
      expect(res.messages?.length).toBe(1);
      expect(res.messages?.[0].code).toBe("missingScope");
      expect(res.messages?.[0].data?.scope).toBe("item");
    });
    it("returns empty results if group scope does not exist", async () => {
      const cat = cloneObject(catalogJson);
      delete cat.scopes?.group;
      const instance = Catalog.fromJson(cat, context);

      const res = await instance.searchGroups("water");
      expect(res.results.length).toBe(0);
      expect(res.messages?.length).toBe(1);
      expect(res.messages?.[0].code).toBe("missingScope");
      expect(res.messages?.[0].data?.scope).toBe("group");
    });
    it("returns empty results if user scope does not exist", async () => {
      const cat = cloneObject(catalogJson);
      delete cat.scopes?.user;
      const instance = Catalog.fromJson(cat, context);

      const res = await instance.searchUsers("water");
      expect(res.results.length).toBe(0);
      expect(res.messages?.length).toBe(1);
      expect(res.messages?.[0].code).toBe("missingScope");
      expect(res.messages?.[0].data?.scope).toBe("user");
    });
  });

  describe("contains:", () => {
    let hubSearchSpy: jasmine.Spy;

    it("returns false if scope does not exist for entityType ", async () => {
      hubSearchSpy = spyOn(HubSearchModule, "hubSearch").and.callFake(() => {
        return Promise.resolve({ fake: "response" });
      });
      const instance = Catalog.fromJson(cloneObject(catalogJson), context);
      const res = await instance.contains("1950189b18a64ab78fc478d97ea502e0", {
        entityType: "event",
      });
      expect(res.isContained).toBe(false);
      expect(hubSearchSpy).toHaveBeenCalledTimes(0);
    });
    it("executes one search if entity type specified", async () => {
      hubSearchSpy = spyOn(HubSearchModule, "hubSearch").and.callFake(() => {
        return Promise.resolve({
          results: ["results just needs to have an entry"],
        });
      });
      const instance = Catalog.fromJson(cloneObject(catalogJson), context);
      const res = await instance.contains("1950189b18a64ab78fc478d97ea502e0", {
        entityType: "item",
      });
      expect(res.isContained).toBe(true);
      expect(hubSearchSpy).toHaveBeenCalledTimes(1);
      const chkQry = hubSearchSpy.calls.argsFor(0)[0];
      const predicates: IPredicate = chkQry.filters.reduce(
        (acc: IPredicate[], f: IFilter) => {
          return acc.concat(f.predicates);
        },
        []
      );
      // one predicate must have the id
      expect(
        predicates.some(
          (p: IPredicate) => p.id === "1950189b18a64ab78fc478d97ea502e0"
        )
      ).toBe(true);
    });
    it("subsequent calls use a cache", async () => {
      hubSearchSpy = spyOn(HubSearchModule, "hubSearch").and.callFake(() => {
        return Promise.resolve({
          results: ["results just needs to have an entry"],
        });
      });
      const instance = Catalog.fromJson(cloneObject(catalogJson), context);
      const res = await instance.contains("1950189b18a64ab78fc478d97ea502e0", {
        entityType: "item",
      });
      expect(res.isContained).toBe(true);
      const res2 = await instance.contains("1950189b18a64ab78fc478d97ea502e0", {
        entityType: "item",
      });
      expect(res2.isContained).toBe(true);
      expect(hubSearchSpy).toHaveBeenCalledTimes(1);
    });
    it("assumes slug if not guid", async () => {
      hubSearchSpy = spyOn(HubSearchModule, "hubSearch").and.callFake(() => {
        return Promise.resolve({
          results: [
            {
              typeKeywords: ["slug|org|my-name-is-vader-1"],
            },
            {
              typeKeywords: ["slug|org|my-name-is-vader"],
            },
          ],
        });
      });
      const instance = Catalog.fromJson(cloneObject(catalogJson), context);
      const res = await instance.contains("org|my-name-is-vader", {
        entityType: "item",
      });

      expect(res.isContained).toBe(true);
      expect(hubSearchSpy).toHaveBeenCalledTimes(1);
      const chkQry = hubSearchSpy.calls.argsFor(0)[0];
      const predicates: IPredicate = chkQry.filters.reduce(
        (acc: IPredicate[], f: IFilter) => {
          return acc.concat(f.predicates);
        },
        []
      );
      // one predicate must have the slug
      expect(
        predicates.some((p: IPredicate) =>
          p.typekeywords?.includes("slug|org|my-name-is-vader")
        )
      ).toBe(true);
    });
    it("executes one search per-scope if entity type not specified", async () => {
      let called = false;
      hubSearchSpy = spyOn(HubSearchModule, "hubSearch").and.callFake(() => {
        let response: any = { results: [] };
        if (!called) {
          response = { results: ["results just needs to have an entry"] };
          called = true;
        }
        return Promise.resolve(response);
      });
      const instance = Catalog.fromJson(cloneObject(catalogJson), context);
      const res = await instance.contains(
        "1950189b18a64ab78fc478d97ea502e0",
        {}
      );
      expect(res.isContained).toBe(true);
      expect(hubSearchSpy).toHaveBeenCalledTimes(3);
    });
  });
});
