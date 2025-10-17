import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock the portal search module before importing the module under test so memoize wraps the mock
vi.mock("../../../src/search/_internal/portalSearchItems", () => ({
  portalSearchItemsAsItems: vi
    .fn()
    // First call (outer query) returns one item whose 'foo' is itself an item-query dynamic value
    .mockResolvedValueOnce({
      results: [
        {
          foo: {
            type: "item-query",
            sourcePath: "bar",
            outPath: "inner.out",
            aggregation: "sum",
            query: { targetEntity: "item", filters: [{ source: "inner" }] },
            scope: { targetEntity: "item", filters: [] },
          },
        },
      ],
    })
    // Second call (inner query) returns two items with 'bar' values 4 and 6
    .mockResolvedValueOnce({ results: [{ bar: 4 }, { bar: 6 }] }),
}));

import * as resolveModule from "../../../src/utils/internal/resolveDynamicValues";
import { ArcGISContextManager } from "../../../src/ArcGISContextManager";
import { MOCK_AUTH } from "../../mocks/mock-auth";

describe("resolveDynamicValues - nested item-query", () => {
  let ctxMgr: any;

  beforeEach(async () => {
    ctxMgr = await ArcGISContextManager.create(MOCK_AUTH);
  });

  it("resolves nested item-query dynamic values", async () => {
    const valueDef: any = {
      type: "item-query",
      sourcePath: "foo",
      outPath: "out.sum",
      aggregation: "sum",
      query: { targetEntity: "item", filters: [] },
      scope: { targetEntity: "item", filters: [] },
    };

    const result = await resolveModule.resolveItemQueryValues(
      valueDef,
      ctxMgr.context
    );

    // outer aggregate should resolve inner item-query which sums 4 + 6 = 10
    expect(result).toEqual({ out: { sum: 10 } });
  });
});
