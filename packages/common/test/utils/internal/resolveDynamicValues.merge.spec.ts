import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock the portal search module before importing the module under test so memoize wraps the mock
vi.mock("../../../src/search/_internal/portalSearchItems", () => ({
  portalSearchItemsAsItems: vi
    .fn()
    .mockResolvedValue({ results: [{ foo: 2 }, { foo: 3 }] }),
}));

import * as resolveModule from "../../../src/utils/internal/resolveDynamicValues";
import { createMockContext, MOCK_AUTH } from "../../mocks/mock-auth";
import { clearMemoizedCache } from "../../../src/utils/memoize";

describe("resolveDynamicValues - merge and mapping", () => {
  let ctxMgr: any;

  beforeEach(async () => {
    clearMemoizedCache("portalSearchItemsAsItems");
    ctxMgr = { context: createMockContext(MOCK_AUTH) } as unknown as any;
  });

  it("merges multiple dynamic value defs into a single result", async () => {
    const defs: any[] = [
      { type: "static-value", value: 7, outPath: "a" },
      {
        type: "item-query",
        sourcePath: "foo",
        outPath: "b.sum",
        aggregation: "sum",
        query: { targetEntity: "item", filters: [] },
        scope: { targetEntity: "item", filters: [] },
      },
    ];

    const result = await resolveModule.resolveDynamicValues(
      defs,
      ctxMgr.context
    );

    expect(result).toEqual({ a: 7, b: { sum: 5 } });
  });
});
