import { describe, it, expect, vi } from "vitest";

// we'll mock getFamilyTypes to control expansion behavior
vi.mock("../../../src/content/get-family", async () => {
  const original = await vi.importActual("../../../src/content/get-family");
  return {
    ...(original as any),
    getFamilyTypes: (family: any) => {
      if (family === "content") return ["A", "B"];
      return (original as any).getFamilyTypes(family);
    },
  };
});

import { applyWellKnownItemPredicates } from "../../../src/search/_internal/applyWellKnownItemPredicates";

describe("applyWellKnownItemPredicates", () => {
  it("replaces well-known type predicate and sets operation to OR", () => {
    const query: any = {
      filters: [
        {
          operation: "AND",
          predicates: [{ type: "$application" as any }, { term: "x" }],
        },
      ],
    };

    const res = applyWellKnownItemPredicates(query);
    expect(res).not.toBe(query); // clone
    expect(res.filters[0].operation).toBe("OR");
    // Since $application expands to multiple predicates, ensure term remained
    expect(res.filters[0].predicates.some((p: any) => p.term === "x")).toBe(
      true
    );
  });

  it("expands family expansion types in predicate.type arrays", () => {
    const query: any = {
      filters: [
        {
          operation: "AND",
          predicates: [
            {
              type: { any: ["$content", "Foo"] },
            },
          ],
        },
      ],
    };

    const res = applyWellKnownItemPredicates(query);
    // the $content should be expanded to A,B per our mock above, preserving Foo
    const types = res.filters[0].predicates[0].type.any;
    expect(types).toContain("A");
    expect(types).toContain("B");
    expect(types).toContain("Foo");
  });

  it("leaves non-well-known predicates untouched", () => {
    const query: any = {
      filters: [
        {
          operation: "AND",
          predicates: [{ type: "SomeType" }],
        },
      ],
    };

    const res = applyWellKnownItemPredicates(query);
    expect(res.filters[0].predicates[0].type).toBe("SomeType");
  });
});
