import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock the portal search module before importing the module under test so memoize wraps the mock
vi.mock("../../../src/search/_internal/portalSearchItems", () => ({
  portalSearchItemsAsItems: vi.fn().mockResolvedValue({ results: [{}, {}] }),
}));

import * as resolveModule from "../../../src/utils/internal/resolveDynamicValues";
import { ArcGISContextManager } from "../../../src/ArcGISContextManager";
import { MOCK_AUTH } from "../../mocks/mock-auth";
import { clearMemoizedCache } from "../../../src/utils/memoize";

describe("resolveDynamicValues - missing value in items", () => {
  let ctxMgr: any;

  beforeEach(async () => {
    clearMemoizedCache("portalSearchItemsAsItems");
    ctxMgr = await ArcGISContextManager.create(MOCK_AUTH);
  });

  it("returns zero when items exist but sourcePath missing", async () => {
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
    expect(result).toEqual({ out: { sum: 0 } });
  });
});
