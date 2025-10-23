import { describe, it, expect } from "vitest";
import { getTopLevelPredicate } from "../../../src/search/_internal/commonHelpers/getTopLevelPredicate";

describe("getTopLevelPredicate", () => {
  it("should return top level predicate when present", () => {
    const filters: any[] = [
      { predicates: [{ bbox: "1,2,3,4" }], operation: "AND" },
    ];
    const p = getTopLevelPredicate("bbox", filters as any);
    expect(p).toEqual({ bbox: "1,2,3,4" });
  });

  it("should return undefined when no predicates", () => {
    const filters: any[] = [];
    const p = getTopLevelPredicate("bbox", filters as any);
    expect(p).toBeNull();
  });

  it("throws when more than one filter contains the predicate", () => {
    const filters: any[] = [
      { predicates: [{ bbox: "1,2,3,4" }], operation: "AND" },
      { predicates: [{ bbox: "5,6,7,8" }], operation: "AND" },
    ];
    expect(() => getTopLevelPredicate("bbox", filters as any)).toThrow(
      "Only 1 IFilter can have a 'bbox' predicate"
    );
  });

  it("throws when a single filter contains multiple matching predicates", () => {
    const filters: any[] = [
      {
        predicates: [{ bbox: "1,2,3,4" }, { bbox: "5,6,7,8" }],
        operation: "AND",
      },
    ];
    expect(() => getTopLevelPredicate("bbox", filters as any)).toThrow(
      "Only 1 'bbox' predicate is allowed"
    );
  });

  it("throws when the matching filter is OR'd to other predicates", () => {
    const filters: any[] = [
      { predicates: [{ bbox: "1,2,3,4" }, { type: "CSV" }], operation: "OR" },
    ];
    expect(() => getTopLevelPredicate("bbox", filters as any)).toThrow(
      "'bbox' predicates cannot be OR'd to other predicates"
    );
  });

  it("throws when the predicate value is not a primitive string/boolean", () => {
    const filters: any[] = [
      { predicates: [{ bbox: [1, 2, 3, 4] }], operation: "AND" },
    ];
    expect(() => getTopLevelPredicate("bbox", filters as any)).toThrow(
      "'bbox' predicate must be a string or boolean primitive. string[] and IMatchOptions are not allowed."
    );
  });
});
