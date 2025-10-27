import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
vi.mock("@esri/arcgis-rest-feature-service", () => ({
  queryFeatures: vi.fn().mockResolvedValue({
    features: [{ attributes: { myField: 5 } }, { attributes: { myField: 3 } }],
  }),
}));

import * as svcModule from "../../../src/utils/internal/resolveServiceQueryValues";
import { createMockContext, MOCK_AUTH } from "../../mocks/mock-auth";
import * as fs from "@esri/arcgis-rest-feature-service";

describe("resolveServiceQueryValues", () => {
  let ctxMgr: any;

  beforeEach(async () => {
    ctxMgr = { context: createMockContext(MOCK_AUTH) } as unknown as any;
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("queries the service and returns aggregated value on outPath", async () => {
    const def: any = {
      options: { url: "http://svc", field: "myField", statisticType: "sum" },
      outPath: "out.sum",
    };

    const result = await svcModule.resolveServiceQueryValues(
      def,
      ctxMgr.context
    );

    expect((fs as any).queryFeatures).toHaveBeenCalled();
    // resolveServiceQueryValues implementation pulls the first feature's attribute or 0
    expect(result).toEqual({ out: { sum: 5 } });
  });
});
