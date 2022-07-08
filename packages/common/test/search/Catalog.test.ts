import { IPortal, IUser } from "@esri/arcgis-rest-portal";
import {
  ArcGISContextManager,
  cloneObject,
  getProp,
  IArcGISContext,
} from "../../src";
import {
  Catalog,
  ICatalogScope,
  IHubCatalog,
  IHubCollection,
  IHubSearchResponse,
  IHubSearchResult,
  IQuery,
} from "../../src/search";
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
      const instance = Catalog.fromJson(cloneObject(catalogJson), context);
      const teamsCollection = instance.getCollection("teams");
      expect(teamsCollection.scope.filters.length).toBe(1);
    });
  });

  describe("search:", () => {
    let hubSearchSpy: jasmine.Spy;
    it("searches with string; defaults to item", async () => {
      hubSearchSpy = spyOn(HubSearchModule, "hubSearch").and.callFake(() => {
        return Promise.resolve({ fake: "response" });
      });
      const instance = Catalog.fromJson(cloneObject(catalogJson), context);
      const res = await instance.search("water");
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

    it("searches with string and entity", async () => {
      hubSearchSpy = spyOn(HubSearchModule, "hubSearch").and.callFake(() => {
        return Promise.resolve({ fake: "response" });
      });
      const instance = Catalog.fromJson(cloneObject(catalogJson), context);
      const res = await instance.search("water", { targetEntity: "item" });
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

    it("searches with query", async () => {
      hubSearchSpy = spyOn(HubSearchModule, "hubSearch").and.callFake(() => {
        return Promise.resolve({ fake: "response" });
      });
      const instance = Catalog.fromJson(cloneObject(catalogJson), context);
      const qry: IQuery = {
        targetEntity: "group",
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
      const res = await instance.search(qry, { targetEntity: "group" });
      // ensure the spy was called
      expect(res).toEqual({
        fake: "response",
      } as unknown as IHubSearchResponse<IHubSearchResult>);
      const [query, opts] = hubSearchSpy.calls.argsFor(0);
      expect(query.targetEntity).toBe("group");
      expect(query.filters[0].predicates[0].term).toBe("Pine St");
      expect(opts.requestOptions).toEqual(context.hubRequestOptions);
    });
  });
});
