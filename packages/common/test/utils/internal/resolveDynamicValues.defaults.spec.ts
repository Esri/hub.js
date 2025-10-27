import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock portal search to return two items
vi.mock("../../../src/search/_internal/portalSearchItems", () => ({
  portalSearchItemsAsItems: vi
    .fn()
    .mockResolvedValue({ results: [{ foo: 1 }, { foo: 2 }] }),
}));

import * as resolveModule from "../../../src/utils/internal/resolveDynamicValues";
import { createMockContext, MOCK_AUTH } from "../../mocks/mock-auth";
import { clearMemoizedCache } from "../../../src/utils/memoize";

describe("resolveDynamicValues - defaults for query and scope", () => {
  let ctxMgr: any;

  beforeEach(async () => {
    clearMemoizedCache("portalSearchItemsAsItems");
    ctxMgr = { context: createMockContext(MOCK_AUTH) } as unknown as any;
  });

  it("uses defaults when query and scope are not provided", async () => {
    const valueDef: any = {
      type: "item-query",
      sourcePath: "foo",
      outPath: "out.sum",
      aggregation: "sum",
      // no query or scope provided
    };

    const result = await resolveModule.resolveItemQueryValues(
      valueDef,
      ctxMgr.context
    );
    expect(result).toEqual({ out: { sum: 3 } });
  });
});
