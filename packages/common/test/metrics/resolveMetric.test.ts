import {
  ArcGISContextManager,
  DynamicValueDefinition,
  IArcGISContext,
  IMetric,
} from "../../src";
import { MOCK_AUTH } from "../mocks/mock-auth";
import { IPortal, IUser } from "@esri/arcgis-rest-portal";
import { resolveMetric } from "../../src/metrics/resolveMetric";
import * as ResolveDynamicValueModule from "../../src/utils/internal/resolveDynamicValue";

describe("resolveMetric:", () => {
  let context: IArcGISContext;
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
  });
  it("delegates to resolveDynamicValue", async () => {
    const spy = spyOn(
      ResolveDynamicValueModule,
      "resolveDynamicValue"
    ).and.callFake((valueDef: DynamicValueDefinition, ctx: IArcGISContext) => {
      return Promise.resolve({ funding: 1 });
    });

    const metric: IMetric = {
      id: "metric-1",
      required: true,
      source: {
        type: "static-value",
        value: 30400,
        outPath: "funding",
      },
      display: {
        type: "stat-card",
        title: "City Funding",
        unit: "$",
        unitPosition: "before",
        order: 3,
      },
      editor: {
        type: "number",
        label: "Funding from City",
        description: "City funding for this project",
      },
    };

    const result = await resolveMetric(metric, context);
    expect(result).toEqual({
      funding: {
        value: 1,
        ...metric.display,
      },
    });
    expect(spy.calls.count()).toBe(1);
  });
});
