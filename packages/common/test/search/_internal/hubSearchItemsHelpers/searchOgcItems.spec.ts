import { describe, it, expect, afterEach, vi } from "vitest";

describe("searchOgcItems formatting", () => {
  it("formats discussionPost targetEntity and returns next callback when next link present", async () => {
    // ensure fresh module load so mocks take effect
    vi.resetModules();
    vi.mock(
      "../../../../src/search/_internal/hubSearchItemsHelpers/ogcItemToDiscussionPostResult",
      () => ({
        ogcItemToDiscussionPostResult: (f: any) => ({ id: f.id, foo: true }),
      })
    );

    const { formatOgcItemsResponse } = await import(
      "../../../../src/search/_internal/hubSearchItemsHelpers/searchOgcItems"
    );

    const fakeFeature = { id: "f1" } as any;
    const response: any = {
      features: [fakeFeature],
      numberMatched: 1,
      links: [{ rel: "next", href: "https://api.example.com?startindex=20" }],
    };

    const res = await formatOgcItemsResponse(
      response,
      "https://api.example.com",
      { targetEntity: "discussionPost" } as any,
      { requestOptions: {} } as any
    );

    expect(res.total).toBe(1);
    expect(res.results[0].id).toBe("f1");
    expect(res.hasNext).toBe(true);
    expect(typeof res.next).toBe("function");
  });

  it("formats item targetEntity and maps using ogcItemToSearchResult", async () => {
    vi.resetModules();
    vi.mock(
      "../../../../src/search/_internal/hubSearchItemsHelpers/ogcItemToSearchResult",
      () => ({
        ogcItemToSearchResult: (f: any) => ({ id: f.id, mapped: true }),
      })
    );

    const { formatOgcItemsResponse } = await import(
      "../../../../src/search/_internal/hubSearchItemsHelpers/searchOgcItems"
    );

    const fakeFeature = { id: "i1" } as any;
    const response: any = {
      features: [fakeFeature],
      numberMatched: 1,
      links: [],
    };

    const res = await formatOgcItemsResponse(
      response,
      "https://api.example.com",
      { targetEntity: "item" } as any,
      { requestOptions: {} } as any
    );

    expect(res.total).toBe(1);
    // ensure the mapped/converted result exists and has the expected id
    expect(res.results[0].id).toBe("i1");
    expect(res.hasNext).toBe(false);
    expect(res.next()).toBeNull();
  });
  it("formats item targetEntity w/ next link and maps using ogcItemToSearchResult", async () => {
    vi.resetModules();
    vi.mock(
      "../../../../src/search/_internal/hubSearchItemsHelpers/ogcItemToSearchResult",
      () => ({
        ogcItemToSearchResult: (f: any) => ({ id: f.id, mapped: true }),
      })
    );

    const { formatOgcItemsResponse } = await import(
      "../../../../src/search/_internal/hubSearchItemsHelpers/searchOgcItems"
    );

    const fakeFeature = { id: "i1" } as any;
    const response: any = {
      features: [fakeFeature],
      numberMatched: 1,
      links: [{ rel: "next", href: "https://api.example.com?startindex=20" }],
    };

    const res = await formatOgcItemsResponse(
      response,
      "https://api.example.com",
      { targetEntity: "item" } as any,
      { requestOptions: {} } as any
    );

    expect(res.total).toBe(1);
    // ensure the mapped/converted result exists and has the expected id
    expect(res.results[0].id).toBe("i1");
    expect(res.hasNext).toBe(true);
  });
});

// Module-level mocks to make ESM named exports spyable
vi.mock(
  "../../../../src/search/_internal/hubSearchItemsHelpers/ogcApiRequest",
  async () => {
    const original = await vi.importActual(
      "../../../../src/search/_internal/hubSearchItemsHelpers/ogcApiRequest"
    );
    return {
      ...(original as any),
      ogcApiRequest: vi.fn(),
    };
  }
);

vi.mock(
  "../../../../src/search/_internal/hubSearchItemsHelpers/ogcItemToSearchResult",
  async () => {
    const original = await vi.importActual(
      "../../../../src/search/_internal/hubSearchItemsHelpers/ogcItemToSearchResult"
    );
    return {
      ...(original as any),
      ogcItemToSearchResult: vi
        .fn()
        .mockImplementation((f: any) => ({ id: f.id })),
    };
  }
);

vi.mock(
  "../../../../src/search/_internal/hubSearchItemsHelpers/ogcItemToDiscussionPostResult",
  async () => {
    const original = await vi.importActual(
      "../../../../src/search/_internal/hubSearchItemsHelpers/ogcItemToDiscussionPostResult"
    );
    return {
      ...(original as any),
      ogcItemToDiscussionPostResult: vi
        .fn()
        .mockImplementation((f: any) => ({ id: f.id })),
    };
  }
);

import {
  searchOgcItems,
  _INTERNAL_FNS,
} from "../../../../src/search/_internal/hubSearchItemsHelpers/searchOgcItems";
import * as ogcApiModule from "../../../../src/search/_internal/hubSearchItemsHelpers/ogcApiRequest";

describe("searchOgcItems", () => {
  afterEach(() => vi.restoreAllMocks());

  const baseUrl = "https://ogc.example.com";
  const baseQuery = { query: true, filters: [] } as any;
  const baseOptions = { requestOptions: { fetch: () => null } } as any;

  it("maps features to search results for item targetEntity", async () => {
    const resp = {
      numberMatched: 2,
      features: [{ id: "a" }, { id: "b" }],
      links: [],
    } as any;

    (ogcApiModule as any).ogcApiRequest.mockResolvedValue(resp);

    const res = await searchOgcItems(baseUrl, baseQuery, baseOptions);

    expect((ogcApiModule as any).ogcApiRequest).toHaveBeenCalledTimes(1);
    expect(res.total).toBe(2);
    expect(res.results.map((r: any) => r.id)).toEqual(["a", "b"]);
  });

  it("handles discussionPost targetEntity and next callback", async () => {
    const resp = {
      numberMatched: 1,
      features: [{ id: "x" }],
      links: [
        { rel: "next", href: "https://ogc.example.com?page=2&startindex=10" },
      ],
    } as any;

    (ogcApiModule as any).ogcApiRequest.mockResolvedValue(resp);

    // spy on internal searchOgcItems to ensure next calls through
    const spy = vi.spyOn(_INTERNAL_FNS as any, "searchOgcItems");

    const res = await searchOgcItems(
      baseUrl,
      { targetEntity: "discussionPost", filters: [] } as any,
      baseOptions
    );

    expect(res.total).toBe(1);
    expect(res.hasNext).toBe(true);

    // call next() to exercise callback
    await res.next();
    expect(spy).toHaveBeenCalled();
  });
});
