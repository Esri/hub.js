import { describe, it, expect } from "vitest";
import { getFlattenQueryParam } from "../../../../src/search/_internal/hubSearchItemsHelpers/getFlattenQueryParam";

describe("getFlattenQueryParam", () => {
  it("returns undefined when no flatten predicate", () => {
    const res = getFlattenQueryParam({ filters: [] } as any);
    expect(res).toBeUndefined();
  });

  it("returns boolean flatten value when present", () => {
    const res = getFlattenQueryParam({
      filters: [{ predicates: [{ flatten: true }] }],
    } as any);
    expect(res).toBe(true);
  });
});
