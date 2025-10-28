import { describe, it, expect } from "vitest";
import { ASSOCIATION_REFERENCE_LIMIT } from "../../src/associations/types";

describe("associations/types", () => {
  it("exports ASSOCIATION_REFERENCE_LIMIT and enforces platform limits", () => {
    expect(typeof ASSOCIATION_REFERENCE_LIMIT).toBe("number");
    expect(ASSOCIATION_REFERENCE_LIMIT).toBe(50);
    // Platform limit for typeKeywords is 128; our limit must be comfortably smaller
    expect(ASSOCIATION_REFERENCE_LIMIT).toBeLessThan(128);
  });
});
