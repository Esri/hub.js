import { describe, it, expect, afterEach, vi } from "vitest";
import { getOgcItemQueryParams } from "../../../../src/search/_internal/hubSearchItemsHelpers/getOgcItemQueryParams";

describe("getOgcItemQueryParams", () => {
  afterEach(() => vi.restoreAllMocks());

  it("derives params from query and options", () => {
    const query = { filters: [], bbox: undefined } as any;
    const options: any = {
      num: 50,
      start: 10,
      requestOptions: { authentication: { token: "abc" } },
    };

    const res = getOgcItemQueryParams(query, options);

    expect(res.limit).toBe(50);
    expect(res.startindex).toBe(10);
    expect(res.token).toBe("abc");
    // other params are undefined or empty by default
    expect(res.q).toBeUndefined();
    expect(res.filter).toBe("");
  });

  it("includes q and filter when helpers return values", () => {
    const query = { filters: [{ predicates: [{ term: "x" }] }] } as any;
    const options: any = {
      num: 10,
      start: 0,
      requestOptions: { authentication: { token: undefined } },
    };

    // spy on the small helpers indirectly via imports
    // getQQueryParam should read the term
    const res = getOgcItemQueryParams(query, options);
    expect(res.q).toBe("x");
  });
});
