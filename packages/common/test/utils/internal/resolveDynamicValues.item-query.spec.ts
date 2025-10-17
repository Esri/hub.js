import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock the portal search module before importing the module under test so memoize wraps the mock
vi.mock("../../../src/search/_internal/portalSearchItems", () => ({
  portalSearchItemsAsItems: vi.fn().mockResolvedValue({
    results: [
      { foo: 2 },
      { foo: { type: "static-value", value: 3, outPath: "x" } },
      { foo: { type: "static-value", value: 5, outPath: "x" } },
    ],
  }),
}));

import * as resolveModule from "../../../src/utils/internal/resolveDynamicValues";
import { ArcGISContextManager } from "../../../src/ArcGISContextManager";
import { MOCK_AUTH } from "../../mocks/mock-auth";

describe("resolveDynamicValues - item-query", () => {
  let ctxMgr: any;

  beforeEach(async () => {
    ctxMgr = await ArcGISContextManager.create(MOCK_AUTH);
  });

  it("resolves item-query values (primitive + static-value) and aggregates", async () => {
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

    expect(result).toEqual({ out: { sum: 10 } });
  });
});
