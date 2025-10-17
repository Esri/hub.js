import { describe, it, expect, beforeEach } from "vitest";

import * as resolveModule from "../../../src/utils/internal/resolveDynamicValues";
import { ArcGISContextManager } from "../../../src/ArcGISContextManager";
import { MOCK_AUTH } from "../../mocks/mock-auth";

describe("resolveDynamicValues - extra cases", () => {
  let ctxMgr: any;

  beforeEach(async () => {
    ctxMgr = await ArcGISContextManager.create(MOCK_AUTH);
  });

  it("returns empty object when given no dynamic values", async () => {
    const result = await resolveModule.resolveDynamicValues([], ctxMgr.context);
    expect(result).toEqual({});
  });

  it("throws when given an unknown dynamic value type", async () => {
    const badDef: any = { type: "unknown-type", outPath: "x" };
    await expect(
      resolveModule.resolveDynamicValue(badDef, ctxMgr.context)
    ).rejects.toThrow("Cannot resolve value - unexpected source.");
  });
});
