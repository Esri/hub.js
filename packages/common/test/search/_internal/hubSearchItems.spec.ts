import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";

// Mock dependencies before importing the module under test
vi.mock(
  "../../../src/search/_internal/hubSearchItemsHelpers/searchOgcAggregations",
  async () => ({
    searchOgcAggregations: vi.fn().mockResolvedValue({ agg: true }),
  })
);

vi.mock(
  "../../../src/search/_internal/hubSearchItemsHelpers/searchOgcItems",
  async () => ({
    searchOgcItems: vi.fn().mockResolvedValue({ items: true }),
  })
);

vi.mock(
  "../../../src/search/_internal/hubSearchItemsHelpers/getOgcCollectionUrl",
  async () => ({
    getOgcCollectionUrl: (_q: any, _opts: any) =>
      "https://api.example.com/collections/all",
  })
);

vi.mock("../../../src/search/_internal/expandPortalQuery", async () => ({
  expandPortalQuery: (q: any) => ({ ...q, expanded: true }),
}));

describe("hubSearchItems", () => {
  it("delegates to searchOgcAggregations when aggFields present", async () => {
    vi.resetModules();
    // re-register mocks
    vi.mock(
      "../../../src/search/_internal/hubSearchItemsHelpers/searchOgcAggregations",
      async () => ({
        searchOgcAggregations: vi.fn().mockResolvedValue({ agg: true }),
      })
    );
    vi.mock(
      "../../../src/search/_internal/hubSearchItemsHelpers/searchOgcItems",
      async () => ({
        searchOgcItems: vi.fn().mockResolvedValue({ items: true }),
      })
    );
    vi.mock(
      "../../../src/search/_internal/hubSearchItemsHelpers/getOgcCollectionUrl",
      async () => ({
        getOgcCollectionUrl: (_q: any, _opts: any) =>
          "https://api.example.com/collections/all",
      })
    );
    vi.mock("../../../src/search/_internal/expandPortalQuery", async () => ({
      expandPortalQuery: (q: any) => ({ ...q, expanded: true }),
    }));

    const { hubSearchItems } = await import(
      "../../../src/search/_internal/hubSearchItems"
    );
    const ogcAgg = await import(
      "../../../src/search/_internal/hubSearchItemsHelpers/searchOgcAggregations"
    );

    const res = await hubSearchItems(
      { filters: [] } as any,
      { aggFields: ["a"], requestOptions: {} } as any
    );
    expect(res).toEqual({ agg: true });
    expect((ogcAgg as any).searchOgcAggregations).toHaveBeenCalled();
  });

  it("constructs url and calls searchOgcItems when no aggFields", async () => {
    vi.resetModules();
    vi.mock(
      "../../../src/search/_internal/hubSearchItemsHelpers/searchOgcAggregations",
      async () => ({
        searchOgcAggregations: vi.fn().mockResolvedValue({ agg: true }),
      })
    );
    vi.mock(
      "../../../src/search/_internal/hubSearchItemsHelpers/searchOgcItems",
      async () => ({
        searchOgcItems: vi.fn().mockResolvedValue({ items: true }),
      })
    );
    vi.mock(
      "../../../src/search/_internal/hubSearchItemsHelpers/getOgcCollectionUrl",
      async () => ({
        getOgcCollectionUrl: (_q: any, _opts: any) =>
          "https://api.example.com/collections/all",
      })
    );
    vi.mock("../../../src/search/_internal/expandPortalQuery", async () => ({
      expandPortalQuery: (q: any) => ({ ...q, expanded: true }),
    }));

    const { hubSearchItems } = await import(
      "../../../src/search/_internal/hubSearchItems"
    );
    const ogcItems = await import(
      "../../../src/search/_internal/hubSearchItemsHelpers/searchOgcItems"
    );

    const res = await hubSearchItems(
      { filters: [] } as any,
      { requestOptions: {} } as any
    );
    expect(res).toEqual({ items: true });
    expect((ogcItems as any).searchOgcItems).toHaveBeenCalled();
  });
});
import { hubSearchItems } from "../../../src/search/_internal/hubSearchItems";
import * as searchOgcItemsModule from "../../../src/search/_internal/hubSearchItemsHelpers/searchOgcItems";
import { IQuery } from "../../../src/search/types/IHubCatalog";
import { IHubSearchOptions } from "../../../src/search/types/IHubSearchOptions";

describe("hubSearchItems", () => {
  afterEach(() => vi.restoreAllMocks());

  const PAGE = {
    total: 2,
    results: [{ id: "1" }, { id: "2" }],
    hasNext: false,
    next: async () => {
      return {
        total: 2,
        results: [],
        hasNext: false,
        next: async () => null,
      } as any;
    },
  } as any;
  const query: IQuery = { query: true, filters: [] } as any;
  const options = {
    options: true,
    requestOptions: {
      requestOptions: true,
      hubApiUrl: "https://my-hub.com/api/v3",
    },
  } as unknown as IHubSearchOptions;

  beforeEach(() => {
    vi.spyOn(searchOgcItemsModule as any, "searchOgcItems").mockResolvedValue(
      PAGE
    );
  });

  it("should call portal searchItems and return results", async () => {
    const res = await hubSearchItems(query, options);
    expect((searchOgcItemsModule as any).searchOgcItems).toHaveBeenCalledTimes(
      1
    );
    expect(res.total).toBe(2);
    expect(res.hasNext).toBe(false);
  });
});
