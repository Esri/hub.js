import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

vi.mock("@esri/arcgis-rest-feature-service", () => ({
  queryFeatures: vi.fn().mockResolvedValue({ features: [] }),
}));

import * as svcModule from "../../../src/utils/internal/resolveServiceQueryValues";
import { ArcGISContextManager } from "../../../src/ArcGISContextManager";
import { MOCK_AUTH } from "../../mocks/mock-auth";
import * as fs from "@esri/arcgis-rest-feature-service";

describe("resolveServiceQueryValues - branches", () => {
  let ctxMgr: any;

  beforeEach(async () => {
    ctxMgr = await ArcGISContextManager.create(MOCK_AUTH);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("returns 0 when query returns no features", async () => {
    (fs as any).queryFeatures.mockResolvedValueOnce({ features: [] });

    const def: any = {
      options: { url: "http://svc", field: "myField", statisticType: "sum" },
      outPath: "out.sum",
    };

    const result = await svcModule.resolveServiceQueryValues(
      def,
      ctxMgr.context
    );

    expect(result).toEqual({ out: { sum: 0 } });
  });

  it("returns 0 when attribute is missing on first feature", async () => {
    (fs as any).queryFeatures.mockResolvedValueOnce({
      features: [{ attributes: {} }],
    });

    const def: any = {
      options: { url: "http://svc", field: "myField", statisticType: "sum" },
      outPath: "out.sum",
    };

    const result = await svcModule.resolveServiceQueryValues(
      def,
      ctxMgr.context
    );

    expect(result).toEqual({ out: { sum: 0 } });
  });

  it("defaults where to 1=1 when not provided and passes it to queryFeatures", async () => {
    (fs as any).queryFeatures.mockResolvedValueOnce({
      features: [{ attributes: { myField: 9 } }],
    });

    const def: any = {
      options: { url: "http://svc", field: "myField", statisticType: "sum" },
      outPath: "out.sum",
    };

    const result = await svcModule.resolveServiceQueryValues(
      def,
      ctxMgr.context
    );

    expect((fs as any).queryFeatures).toHaveBeenCalled();
    const callArgs = (fs as any).queryFeatures.mock.calls[0][0];
    expect(callArgs.where).toBe("1=1");
    expect(result).toEqual({ out: { sum: 9 } });
  });

  it("uses provided where when options.where is truthy", async () => {
    (fs as any).queryFeatures.mockResolvedValueOnce({
      features: [{ attributes: { myField: 11 } }],
    });

    const def: any = {
      options: {
        url: "http://svc",
        field: "myField",
        statisticType: "sum",
        where: "x=1",
      },
      outPath: "out.sum",
    };

    const result = await svcModule.resolveServiceQueryValues(
      def,
      ctxMgr.context
    );

    expect((fs as any).queryFeatures).toHaveBeenCalled();
    const callArgs = (fs as any).queryFeatures.mock.calls[0][0];
    expect(callArgs.where).toBe("x=1");
    expect(result).toEqual({ out: { sum: 11 } });
  });
});
