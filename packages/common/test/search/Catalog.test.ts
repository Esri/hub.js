import { IPortal, IUser } from "@esri/arcgis-rest-portal";
import { cloneObject, getProp, IArcGISContext } from "../../src";
import { ArcGISContextManager } from "../../src/ArcGISContextManager";
import {
  ICatalogScope,
  IHubCatalog,
  IHubCollection,
  IHubSearchResponse,
  IHubSearchResult,
  IQuery,
} from "../../src/search";
import { Catalog } from "../../src/search/Catalog";
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
});
