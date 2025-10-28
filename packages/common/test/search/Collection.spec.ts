import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { createMockContext, MOCK_AUTH } from "../mocks/mock-auth";
import { Collection } from "../../src/search/Collection";
import * as HubSearchModule from "../../src/search/hubSearch";
import { IHubCollection, IQuery } from "../../src/search/types/IHubCatalog";
import { IArcGISContext } from "../../src/types/IArcGISContext";
import { cloneObject } from "../../src/util";
import { IHubSearchResult } from "../../src/search/types/IHubSearchResult";
import { IHubSearchResponse } from "../../src/search/types/IHubSearchResponse";

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
  beforeEach(() => {
    context = createMockContext({ authentication: MOCK_AUTH });
  });

  afterEach(() => vi.restoreAllMocks());

  describe("getters", () => {
    it("passed in props", () => {
      const instance = Collection.fromJson(envCollection, context);
      expect(instance.label).toEqual(envCollection.label);
      expect(instance.key).toEqual(envCollection.key);
      expect(instance.include).toEqual(envCollection.include);
      expect(instance.scope).toEqual(envCollection.scope);
      expect(instance.sortField).toEqual(envCollection.sortField);
      expect(instance.sortDirection).toEqual(envCollection.sortDirection);
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
    let hubSearchSpy: any;
    it("searches with string", async () => {
      hubSearchSpy = vi
        .spyOn(HubSearchModule as any, "hubSearch")
        .mockImplementation(() => {
          return Promise.resolve({ fake: "response" });
        });
      const instance = Collection.fromJson(cloneObject(envCollection), context);
      const res = await instance.search("water");
      // ensure the spy was called
      expect(res).toEqual({
        fake: "response",
      } as unknown as IHubSearchResponse<IHubSearchResult>);
      const [query] = hubSearchSpy.mock.calls[0];
      expect(query.targetEntity).toBe("item");
      expect(query.filters.length).toBe(2);
      expect(query.filters[0].predicates[0].term).toBe("water");
    });
    it("search with query", async () => {
      hubSearchSpy = vi
        .spyOn(HubSearchModule as any, "hubSearch")
        .mockImplementation(() => {
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
      const [query] = hubSearchSpy.mock.calls[0];
      expect(query).not.toBe(qry); // ensure we don't mutate the original
      expect(query.targetEntity).toBe("item");
      expect(query.filters.length).toBe(2);
      expect(query.filters[0].predicates[0].term).toBe("water");
    });
  });
});
