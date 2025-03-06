import { IPortal, IUser } from "@esri/arcgis-rest-portal";
import { cloneObject, getProp, IArcGISContext } from "../../src";
import { ArcGISContextManager } from "../../src/ArcGISContextManager";
import {
  ICatalogScope,
  IFilter,
  IGalleryDisplayConfig,
  IHubCatalog,
  IHubCollection,
  IHubSearchResponse,
  IHubSearchResult,
  IQuery,
} from "../../src/search";
import { Catalog } from "../../src";
import * as FetchEntityCatalogModule from "../../src/search/fetchEntityCatalog";
import * as HubSearchModule from "../../src/search/hubSearch";
import * as CatalogContainsModule from "../../src/core/catalogContains";
import { MOCK_AUTH } from "../mocks/mock-auth";
import { CORNERS, DROP_SHADOWS } from "../../src/core/schemas/shared/enums";

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
  displayConfig: {
    item: {
      hidden: false,
      showThumbnail: "show",
      showLinkButton: true,
      linkButtonStyle: "outline",
      linkButtonText: "Explore",
      corners: CORNERS.square,
      shadow: DROP_SHADOWS.none,
      layout: "list",
    },
  },
};

const noScopeCatalog: IHubCatalog = {
  title: "No Scope Catalog",
  schemaVersion: 1,

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
      expect(instance.getScope("channel")).toBeUndefined();
      expect(instance.collections).toEqual(
        catalogJson.collections as IHubCollection[]
      );
      expect(instance.collectionNames).toEqual(["teams", "environment"]);
      instance.title = "Changed Title";
      expect(instance.title).toBe("Changed Title");
      expect(instance.availableScopes).toEqual(["item", "group", "user"]);
      expect(instance.displayConfig).toEqual(catalogJson.displayConfig);
    });
    it("allows null scopes", () => {
      const instance = Catalog.fromJson(cloneObject(noScopeCatalog), context);
      expect(instance.scopes).toEqual({});
      expect(instance.getScope("item")).toBeUndefined();
      expect(instance.collectionNames).toEqual(["teams"]);
      expect(instance.availableScopes).toEqual([]);
    });
    it("allows null collections", () => {
      const noCollectionsCatalog = cloneObject(catalogJson);
      delete noCollectionsCatalog.collections;
      const instance = Catalog.fromJson(noCollectionsCatalog, context);
      expect(instance.collections.length).toBe(0);
    });
  });

  describe("init:", () => {
    let fetchCatalogSpy: jasmine.Spy;

    it("creates default context if not passed", async () => {
      fetchCatalogSpy = spyOn(
        FetchEntityCatalogModule,
        "fetchEntityCatalog"
      ).and.callFake(() => {
        return Promise.resolve(cloneObject(catalogJson));
      });
      const instance = await Catalog.init("https://somesite.com");
      expect(instance.toJson()).toEqual(catalogJson);
      const userQuery: IQuery = { targetEntity: "user", filters: [] };
      instance.setScope("user", userQuery);
      expect(instance.getScope("user")).toEqual(userQuery);

      const [id, ctx] = fetchCatalogSpy.calls.argsFor(0);
      expect(id).toEqual("https://somesite.com");
      expect(ctx.portalUrl).toEqual("https://www.arcgis.com");
      expect(ctx.isPortal).toEqual(false);
      expect(instance.availableScopes).toEqual(["item", "group", "user"]);
    });
    it("throws if no catalog found", async () => {
      fetchCatalogSpy = spyOn(
        FetchEntityCatalogModule,
        "fetchEntityCatalog"
      ).and.callFake(() => {
        return Promise.resolve(null);
      });
      try {
        await Catalog.init("https://somesite.com", context);
      } catch (err) {
        expect(getProp(err, "name")).toBe("HubError");
        expect(getProp(err, "message")).toContain("No catalog found");
        // verify the context was used
        expect(fetchCatalogSpy.calls.argsFor(0)[1]).toBe(context);
      }
    });
    it("uses context and options if passed", async () => {
      fetchCatalogSpy = spyOn(
        FetchEntityCatalogModule,
        "fetchEntityCatalog"
      ).and.callFake(() => {
        return Promise.resolve(cloneObject(catalogJson));
      });
      const instance = await Catalog.init("https://somesite.com", context, {
        hubEntityType: "project",
        prop: "catalog",
      });
      // verify the context was used
      expect(fetchCatalogSpy.calls.argsFor(0)[1]).toBe(context);
      // verify the options were used
      expect(fetchCatalogSpy.calls.argsFor(0)[2]).toEqual({
        hubEntityType: "project",
        prop: "catalog",
      });
      expect(instance.toJson()).toEqual(catalogJson);
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
    it("get collection works without collection scope filters", () => {
      const instance = Catalog.fromJson(cloneObject(catalogJson), context);
      instance.addCollection({
        key: "documents",
        label: "Documents",
        targetEntity: "item",
        scope: {
          targetEntity: "item",
          collection: "document",
        } as IQuery,
      });
      const docCollection = instance.getCollection("documents");
      expect(docCollection.scope.filters.length).toBe(1);
    });
  });
  describe("addCollection", () => {
    const newCollection = {
      key: "new-collection",
      label: "New Collection",
      targetEntity: "item",
      scope: {
        targetEntity: "item",
        filters: [{ predicates: [] }],
      },
    } as IHubCollection;

    it("adds a new collection to an empty array of collections", () => {
      const catalogJsonWithNoCollections = cloneObject(catalogJson);
      delete catalogJsonWithNoCollections.collections;

      const instance = Catalog.fromJson(catalogJsonWithNoCollections, context);

      instance.addCollection(newCollection);
      expect(instance.collections.length).toBe(1);
      expect(instance.collections[0].key).toBe("new-collection");
    });
    it("adds a new collection to existing collections", () => {
      const instance = Catalog.fromJson(cloneObject(catalogJson), context);
      expect(instance.collections.length).toBe(2);

      instance.addCollection(newCollection);
      expect(instance.collections.length).toBe(3);
      expect(instance.collections[2].key).toBe("new-collection");
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

    it("searchItems with query", async () => {
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

  describe("searchScopes", () => {
    let hubSearchSpy: jasmine.Spy;
    it("search by term", async () => {
      hubSearchSpy = spyOn(HubSearchModule, "hubSearch").and.callFake(() => {
        return Promise.resolve({ fake: "response" });
      });
      const instance = Catalog.fromJson(cloneObject(catalogJson), context);
      const res = await instance.searchScopes("water");
      // ensure the spy was called
      expect(hubSearchSpy.calls.count()).toBe(3);
      expect(res.item).toBeDefined();
      expect(res.item).toEqual({
        fake: "response",
      } as unknown as IHubSearchResponse<IHubSearchResult>);
      expect(res.group).toBeDefined();
      expect(res.group).toEqual({
        fake: "response",
      } as unknown as IHubSearchResponse<IHubSearchResult>);
      expect(res.user).toBeDefined();
      expect(res.user).toEqual({
        fake: "response",
      } as unknown as IHubSearchResponse<IHubSearchResult>);
    });
    it("search by IQuery", async () => {
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
                term: "water",
              },
            ],
          },
        ],
      };
      const res = await instance.searchScopes(qry, { num: 50 }, [
        "item",
        "group",
      ]);
      expect(hubSearchSpy.calls.count()).toBe(2);
      expect(res.item).toBeDefined();
      expect(res.item).toEqual({
        fake: "response",
      } as unknown as IHubSearchResponse<IHubSearchResult>);
      expect(res.group).toBeDefined();
      expect(res.group).toEqual({
        fake: "response",
      } as unknown as IHubSearchResponse<IHubSearchResult>);
    });
    it("availableScopes works if no scopes defined", () => {
      const scopelessCatalog = cloneObject(catalogJson);
      delete scopelessCatalog.scopes;
      const instance = Catalog.fromJson(scopelessCatalog, context);
      expect(instance.availableScopes).toEqual([]);
    });
  });

  describe("searchCollections", () => {
    let hubSearchSpy: jasmine.Spy;
    it("search by term", async () => {
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
    it("search by IQuery", async () => {
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
                term: "water",
              },
            ],
          },
        ],
      };
      const res = await instance.searchCollections(qry, { num: 50 });
      expect(hubSearchSpy.calls.count()).toBe(1);
      const chkQry = hubSearchSpy.calls.argsFor(0)[0];
      expect(chkQry.targetEntity).toBe("item");
      expect(chkQry.filters[0].predicates[0].term).toBe("water");
      const chkOpts = hubSearchSpy.calls.argsFor(0)[1];
      expect(chkOpts.num).toBe(50);
      expect(res.environment).toBeDefined();
      expect(res.environment).toEqual({
        fake: "response",
      } as unknown as IHubSearchResponse<IHubSearchResult>);
    });
  });

  describe("contains:", () => {
    let containsSpy: jasmine.Spy;
    it("delegates to catalogContains:", async () => {
      containsSpy = spyOn(
        CatalogContainsModule,
        "catalogContains"
      ).and.callFake(() => {
        return Promise.resolve({
          identifier: "1950189b18a64ab78fc478d97ea502e0",
          isContained: true,
        });
      });

      const instance = Catalog.fromJson(cloneObject(catalogJson), context);
      const res = await instance.contains(
        "1950189b18a64ab78fc478d97ea502e0",
        {}
      );
      expect(res.identifier).toEqual("1950189b18a64ab78fc478d97ea502e0");
      expect(res.isContained).toBeTruthy();

      expect(containsSpy).toHaveBeenCalled();
    });

    it("subsequent calls use a cache", async () => {
      containsSpy = spyOn(
        CatalogContainsModule,
        "catalogContains"
      ).and.callFake(() => {
        return Promise.resolve({
          identifier: "1950189b18a64ab78fc478d97ea502e0",
          isContained: true,
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
      expect(containsSpy).toHaveBeenCalledTimes(1);
    });
  });
});
