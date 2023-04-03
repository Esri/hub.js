import { IPortal, IUser } from "@esri/arcgis-rest-portal";
import {
  ArcGISContextManager,
  IArcGISContext,
  IMetric,
  IResolvedMetric,
  resolveMetrics,
} from "../../src";
import { MOCK_AUTH } from "../mocks/mock-auth";

describe("resolveMetrics:", () => {
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
  it("resolveMetrics delegates to resolveMetric", async () => {
    const result: IResolvedMetric = {
      "metric-1": {
        value: 1,
        title: "Metric 1",
        order: 1,
      },
    };
    const metrics = {
      "metric-1": {
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
      } as IMetric,
      "metric-2": {
        id: "metric-2",
        required: true,
        source: {
          type: "static-value",
          value: 30400,
          outPath: "ctyFunding",
        },
        display: {
          type: "stat-card",
          title: "County Funding",
          unit: "$",
          unitPosition: "before",
          order: 3,
        },
        editor: {
          type: "number",
          label: "Funding from County",
          description: "County funding for this project",
        },
      } as IMetric,
    };
    const spy = spyOn(
      require("../../src/metrics/resolveMetric"),
      "resolveMetric"
    ).and.callFake((metric: IMetric, ctx: IArcGISContext) => {
      // construct a result that matches the expected shape based on the inputs
      const r: IResolvedMetric = {
        [metric.source.outPath]: {
          value: 1000,
          ...metric.display,
        },
      };
      return Promise.resolve(r);
    });

    const resolved = await resolveMetrics(metrics, context);

    expect(resolved).toEqual({
      funding: {
        value: 1000,
        type: "stat-card",
        title: "City Funding",
        unit: "$",
        unitPosition: "before",
        order: 3,
      },
      ctyFunding: {
        value: 1000,
        type: "stat-card",
        title: "County Funding",
        unit: "$",
        unitPosition: "before",
        order: 3,
      },
    });

    expect(spy.calls.count()).toBe(2);
  });
});
