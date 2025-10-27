import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock the portal search module before importing the module under test so memoize wraps the mock
vi.mock("../../../src/search/_internal/portalSearchItems", () => ({
  portalSearchItemsAsItems: vi.fn().mockResolvedValue({ results: [] }),
}));

import * as resolveModule from "../../../src/utils/internal/resolveDynamicValues";
import { createMockContext, MOCK_AUTH } from "../../mocks/mock-auth";
import { clearMemoizedCache } from "../../../src/utils/memoize";

describe("resolveDynamicValues - empty results", () => {
  let ctxMgr: any;

  beforeEach(async () => {
    // Clear memoize cache so the mock is wrapped fresh for this spec
    clearMemoizedCache("portalSearchItemsAsItems");
    ctxMgr = { context: createMockContext(MOCK_AUTH) } as unknown as any;
  });

  it("returns zero aggregate when no values are found", async () => {
    const valueDef: any = {
      type: "item-query",
      sourcePath: "foo",
      outPath: "out.sum",
      aggregation: "sum",
      query: { targetEntity: "item", filters: [{ empty: true }] },
      scope: { targetEntity: "item", filters: [] },
    };

    const result = await resolveModule.resolveItemQueryValues(
      valueDef,
      ctxMgr.context
    );
    expect(result).toEqual({ out: { sum: 0 } });
  });
});
