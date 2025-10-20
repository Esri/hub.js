import { getQQueryParam } from "../../../../src/search/_internal/hubSearchItemsHelpers/getQQueryParam";

describe("getQQueryParam", () => {
  it("returns undefined when no term predicate", () => {
    const res = getQQueryParam({ filters: [] } as any);
    expect(res).toBeUndefined();
  });

  it("returns term when top-level predicate has term", () => {
    const res = getQQueryParam({
      filters: [{ predicates: [{ term: "hello" }] }],
    } as any);
    expect(res).toBe("hello");
  });
});
