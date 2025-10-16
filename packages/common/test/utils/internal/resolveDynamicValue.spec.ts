import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { IPortal, IUser } from "@esri/arcgis-rest-portal";
// import { resolveDynamicValue } from "../../../src/utils/internal/resolveDynamicValue";
import { MOCK_AUTH } from "../../mocks/mock-auth";
import { IArcGISContext } from "../../../src/types/IArcGISContext";
import { ArcGISContextManager } from "../../../src/ArcGISContextManager";
import { DynamicValueDefinition } from "../../../src/core/types/DynamicValues";
import * as resolveDynamicValuesModule from "../../../src/utils/internal/resolveDynamicValues";
import * as resolvePortalValuesModule from "../../../src/utils/internal/resolvePortalValues";
import * as resolveServiceQueryValuesModule from "../../../src/utils/internal/resolveServiceQueryValues";

describe("resolveDynamicValue:", () => {
  let context: IArcGISContext;
  let itemQrySpy: any;
  let portalSpy: any;
  let serviceSpy: any;
  beforeEach(async () => {
    // When we pass in all this information, the context
    // manager will not try to fetch anything, so no need
    // to mock those calls
    const authdCtxMgr = await ArcGISContextManager.create({
      authentication: MOCK_AUTH,
      currentUser: {
        username: "casey",
        privileges: ["portal:user:createItem"],
      } as unknown as IUser,
      portal: {
        name: "DC R&D Center",
        id: "BRXFAKE",
        urlKey: "fake-org",
        properties: {
          hub: {
            enabled: true,
          },
        },
      } as unknown as IPortal,
      portalUrl: "https://org.maps.arcgis.com",
    });
    context = authdCtxMgr.context;

    itemQrySpy = vi
      .spyOn(
        resolveDynamicValuesModule._INTERNAL_FNS as any,
        "resolveItemQueryValues"
      )
      .mockImplementation(() => Promise.resolve({ item: "spy" }));
    portalSpy = vi
      .spyOn(resolvePortalValuesModule as any, "resolvePortalValues")
      .mockImplementation(() => Promise.resolve({ portal: "spy" }));
    serviceSpy = vi
      .spyOn(
        resolveServiceQueryValuesModule as any,
        "resolveServiceQueryValues"
      )
      .mockImplementation(() => Promise.resolve({ service: "spy" }));
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("handles static-value internally", async () => {
    const def: DynamicValueDefinition = {
      type: "static-value",
      value: 12,
      outPath: "cost",
    };
    const result = await resolveDynamicValuesModule.resolveDynamicValue(
      def,
      context
    );
    expect(result).toEqual({ cost: 12 });
    expect(itemQrySpy).not.toHaveBeenCalled();
    expect(portalSpy).not.toHaveBeenCalled();
    expect(serviceSpy).not.toHaveBeenCalled();
  });
  it("delegates to item query resolver", async () => {
    const def: DynamicValueDefinition = {
      type: "item-query",
      outPath: "cost",
      query: {
        targetEntity: "item",
        filters: [
          {
            operation: "AND",
            predicates: [{ id: "00c" }],
          },
        ],
      },
      sourcePath: "views",
      aggregation: "count",
    };
    const result = await resolveDynamicValuesModule.resolveDynamicValue(
      def,
      context
    );
    expect(result).toEqual({ item: "spy" });
    expect(itemQrySpy).toHaveBeenCalled();
    expect(portalSpy).not.toHaveBeenCalled();
    expect(serviceSpy).not.toHaveBeenCalled();
  });
  it("delegates to service resolver", async () => {
    const def: DynamicValueDefinition = {
      type: "service-query",
      outPath: "cost",
      options: {
        url: "https://services.arcgis.com/abc/arcgis/rest/services/MyService/FeatureServer/0",
        where: "1=1",
        field: "budget",
        statisticType: "sum",
      },
      aggregation: "count",
    };
    const result = await resolveDynamicValuesModule.resolveDynamicValue(
      def,
      context
    );
    expect(result).toEqual({ service: "spy" });
    expect(itemQrySpy).not.toHaveBeenCalled();
    expect(portalSpy).not.toHaveBeenCalled();
    expect(serviceSpy).toHaveBeenCalled();
  });
  it("delegates to portal resolver", async () => {
    const def: DynamicValueDefinition = {
      type: "portal",
      sourcePath: "orgKey",
      outPath: "urlKey",
    };
    const result = await resolveDynamicValuesModule.resolveDynamicValue(
      def,
      context
    );
    expect(result).toEqual({ portal: "spy" });
    expect(itemQrySpy).not.toHaveBeenCalled();
    expect(portalSpy).toHaveBeenCalled();
    expect(serviceSpy).not.toHaveBeenCalled();
  });
  it("throws for unknown type", async () => {
    const def: DynamicValueDefinition = {
      type: "other",
      sourcePath: "orgKey",
      outPath: "urlKey",
    } as unknown as DynamicValueDefinition;
    await expect(
      resolveDynamicValuesModule.resolveDynamicValue(def, context)
    ).rejects.toThrow("Cannot resolve value - unexpected source.");
    expect(itemQrySpy).not.toHaveBeenCalled();
    expect(portalSpy).not.toHaveBeenCalled();
    expect(serviceSpy).not.toHaveBeenCalled();
  });
});
