import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
vi.mock("@esri/arcgis-rest-portal", () => ({
  getSelf: vi.fn().mockResolvedValue({ custom: { key: "value" } }),
}));

import * as portalModule from "../../../src/utils/internal/resolvePortalValues";
import { createMockContext, MOCK_AUTH } from "../../mocks/mock-auth";
import * as arcgisPortal from "@esri/arcgis-rest-portal";

describe("resolvePortalValues", () => {
  let ctxMgr: any;

  beforeEach(async () => {
    ctxMgr = { context: createMockContext(MOCK_AUTH) } as unknown as any;
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("extracts a value from portal self and maps to outPath", async () => {
    const def = { sourcePath: "custom.key", outPath: "out.key" } as any;
    const result = await portalModule.resolvePortalValues(def, ctxMgr.context);

    expect((arcgisPortal as any).getSelf).toHaveBeenCalled();
    expect(result).toEqual({ out: { key: "value" } });
  });
});
