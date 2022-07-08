import { IPortal } from "@esri/arcgis-rest-portal";
import { IUser } from "@esri/arcgis-rest-types";
import {
  ArcGISContextManager,
  cloneObject,
  Collection,
  IArcGISContext,
  IHubCollection,
  IHubSearchResponse,
  IHubSearchResult,
  IQuery,
} from "../../src";
import * as HubSearchModule from "../../src/search/hubSearch";
import { MOCK_AUTH } from "../mocks/mock-auth";

const envCollection: IHubCollection = {
  key: "environment",
  label: "Environment",
  targetEntity: "item",
  sortDirection: "desc",
  sortField: "created",
  include: ["org"],
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
};
const minimalCollection: IHubCollection = {
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
};

describe("Collection Class:", () => {
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
  describe("getters", () => {
    it("passed in props", () => {
      const instance = Collection.fromJson(envCollection, context);
      expect(instance.label).toEqual(envCollection.label);
      expect(instance.key).toEqual(envCollection.key);
      expect(instance.include).toEqual(envCollection.include as string[]);
      expect(instance.scope).toEqual(envCollection.scope);
      expect(instance.sortField).toEqual(envCollection.sortField as string);
      expect(instance.sortDirection).toEqual(
        envCollection.sortDirection as "asc" | "desc"
      );
      expect(instance.targetEntity).toEqual(envCollection.targetEntity);
      expect(instance.toJson()).toEqual(envCollection);
    });
    it("getters with defaults", () => {
      const instance = Collection.fromJson(minimalCollection, context);
      expect(instance.include).toEqual([]);

      expect(instance.sortField).toEqual("title");
      expect(instance.sortDirection).toEqual("asc");
    });
  });
  describe("search", () => {
    let hubSearchSpy: jasmine.Spy;
    it("searches with string", async () => {
      hubSearchSpy = spyOn(HubSearchModule, "hubSearch").and.callFake(() => {
        return Promise.resolve({ fake: "response" });
      });
      const instance = Collection.fromJson(cloneObject(envCollection), context);
      const res = await instance.search("water");
      // ensure the spy was called
      expect(res).toEqual({
        fake: "response",
      } as unknown as IHubSearchResponse<IHubSearchResult>);
      const [query, opts] = hubSearchSpy.calls.argsFor(0);
      expect(query.targetEntity).toBe("item");
      expect(query.filters.length).toBe(2);
      expect(query.filters[0].predicates[0].term).toBe("water");
    });
    it("search with query", async () => {
      hubSearchSpy = spyOn(HubSearchModule, "hubSearch").and.callFake(() => {
        return Promise.resolve({ fake: "response" });
      });
      const instance = Collection.fromJson(cloneObject(envCollection), context);
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
      const res = await instance.search(qry, {
        sortField: "modified",
        sortOrder: "desc",
        include: ["owner"],
      });
      // ensure the spy was called
      expect(res).toEqual({
        fake: "response",
      } as unknown as IHubSearchResponse<IHubSearchResult>);
      const [query, opts] = hubSearchSpy.calls.argsFor(0);
      expect(query.targetEntity).toBe("item");
      expect(query.filters.length).toBe(2);
      expect(query.filters[0].predicates[0].term).toBe("water");
    });
  });
});
