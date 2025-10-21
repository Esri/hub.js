import { getBboxQueryParam } from "../../../../src/search/_internal/hubSearchItemsHelpers/getBboxQueryParam";

describe("getBboxQueryParam", () => {
  it("returns undefined when no bbox predicate", () => {
    const res = getBboxQueryParam({ filters: [] } as any);
    expect(res).toBeUndefined();
  });

  it("returns bbox when top-level predicate has bbox", () => {
    const res = getBboxQueryParam({
      filters: [{ predicates: [{ bbox: "1,2,3,4" }] }],
    } as any);
    expect(res).toBe("1,2,3,4");
  });
});
