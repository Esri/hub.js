import { describe, it, expect } from "vitest";
import { getQueryString } from "../../../../src/search/_internal/hubSearchItemsHelpers/getQueryString";

describe("getQueryString", () => {
  it("returns undefined-like empty for empty params", () => {
    const res = getQueryString({});
    expect(res).toBeFalsy();
  });

  it("encodes and builds a query string", () => {
    const res = getQueryString({ a: "1", q: "a b" });
    // order isn't guaranteed but implementation uses Object.entries which is deterministic for plain objects
    expect(res).toBe("?a=1&q=a%20b");
  });

  it("filters out nil/empty values", () => {
    const res = getQueryString({ a: null, b: undefined, c: "ok" });
    expect(res).toBe("?c=ok");
  });
});
