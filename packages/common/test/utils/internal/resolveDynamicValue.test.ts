import { IPortal, IUser } from "@esri/arcgis-rest-portal";
import {
  ArcGISContextManager,
  IArcGISContext,
  DynamicValueDefinition,
} from "../../../src";
import { resolveDynamicValue } from "../../../src/utils/internal/resolveDynamicValue";
import { MOCK_AUTH } from "../../mocks/mock-auth";

describe("resolveDynamicValue:", () => {
  let context: IArcGISContext;
  let itemQrySpy: jasmine.Spy;
  let portalSpy: jasmine.Spy;
  let serviceSpy: jasmine.Spy;
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

    itemQrySpy = spyOn(
      require("../../../src/utils/internal/resolveItemQueryValues"),
      "resolveItemQueryValues"
    ).and.callFake(() =>
      Promise.resolve({ item: { value: "spy", sources: [] } })
    );
    portalSpy = spyOn(
      require("../../../src/utils/internal/resolvePortalValues"),
      "resolvePortalValues"
    ).and.callFake(() =>
      Promise.resolve({ portal: { value: "spy", sources: [] } })
    );
    serviceSpy = spyOn(
      require("../../../src/utils/internal/resolveServiceQueryValues"),
      "resolveServiceQueryValues"
    ).and.callFake(() =>
      Promise.resolve({ service: { value: "spy", sources: [] } })
    );
  });

  it("handles static-value internally", async () => {
    const def: DynamicValueDefinition = {
      type: "static-value",
      value: 12,
      outPath: "cost",
      source: {
        type: "Hub Project",
        id: "ff3",
        label: "Test Item Source",
      },
    };
    const result = await resolveDynamicValue(def, context);
    expect(result).toEqual({
      cost: { value: 12, sources: [{ ...def.source, value: 12 }] },
    });
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
    const result = await resolveDynamicValue(def, context);
    expect(result).toEqual({ item: { value: "spy", sources: [] } });
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
      source: {
        type: "Hub Project",
        id: "ff3",
        label: "Test Item Source",
      },
    };
    const result = await resolveDynamicValue(def, context);
    expect(result).toEqual({ service: { value: "spy", sources: [] } });
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
    const result = await resolveDynamicValue(def, context);
    expect(result).toEqual({ portal: { value: "spy", sources: [] } });
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
    try {
      await resolveDynamicValue(def, context);
    } catch (err) {
      expect(err).toEqual(
        new Error("Cannot resolve value - unexpected source.")
      );
      expect(itemQrySpy).not.toHaveBeenCalled();
      expect(portalSpy).not.toHaveBeenCalled();
      expect(serviceSpy).not.toHaveBeenCalled();
    }
  });
});
