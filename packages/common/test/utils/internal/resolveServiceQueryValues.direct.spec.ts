import { describe, it, expect, vi, beforeEach } from "vitest";

// Install a mock that will return two different responses for two calls
vi.mock("@esri/arcgis-rest-feature-service", () => ({
  queryFeatures: vi
    .fn()
    .mockResolvedValueOnce({})
    .mockResolvedValueOnce({ features: [{ attributes: { myField: 2 } }] }),
}));

import * as svcModule from "../../../src/utils/internal/resolveServiceQueryValues";
import { createMockContext, MOCK_AUTH } from "../../mocks/mock-auth";

describe("resolveServiceQueryValues - direct branch coverage", () => {
  let ctxMgr: any;

  beforeEach(async () => {
    ctxMgr = { context: createMockContext(MOCK_AUTH) } as unknown as any;
  });

  it("covers both branches for features presence", async () => {
    const def: any = {
      options: { url: "http://svc", field: "myField", statisticType: "sum" },
      outPath: "out.sum",
    };

    // first call: queryFeatures returns {} -> features falsy -> should return 0
    const r1 = await svcModule.resolveServiceQueryValues(def, ctxMgr.context);
    expect(r1).toEqual({ out: { sum: 0 } });

    // second call: queryFeatures returns features with attribute 2 -> should return 2
    const r2 = await svcModule.resolveServiceQueryValues(def, ctxMgr.context);
    expect(r2).toEqual({ out: { sum: 2 } });
  });
});
