import { IPortal, IUser } from "@esri/arcgis-rest-portal";
import {
  ArcGISContextManager,
  IArcGISContext,
  DynamicValueDefinition,
} from "../../../src";
import { resolveServiceQueryValues } from "../../../src/utils/internal/resolveServiceQueryValues";
import { MOCK_AUTH } from "../../mocks/mock-auth";
import * as featureLayer from "@esri/arcgis-rest-feature-layer";

describe("resolveServiceQueryValues:", () => {
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
  it("makes service query call", async () => {
    const serviceSpy = spyOn(featureLayer, "queryFeatures").and.callFake(() => {
      return Promise.resolve({
        features: [{ attributes: { views: 19 } }],
      });
    });

    const def: DynamicValueDefinition = {
      // NOTE: this must be a service query, not an item-query
      // otherwise it will loop infinitely because of the spy
      type: "service-query",
      outPath: "views",
      options: {
        url: "https://services.arcgis.com/abc/arcgis/rest/services/MyService/FeatureServer/0",
        where: "1=1",
        field: "views",
        statisticType: "sum",
      },
      aggregation: "count",
    };
    const result = await resolveServiceQueryValues(def, context);
    expect(result.views).toEqual(19);
    expect(serviceSpy.calls.count()).toEqual(1);
    const opts = serviceSpy.calls.argsFor(0)[0];
    expect(opts.url).toEqual(def.options.url);
    expect(opts.where).toEqual(def.options.where);
    const statsDef = opts.outStatistics[0];
    expect(statsDef.statisticType).toEqual(def.options.statisticType);
    expect(statsDef.outStatisticFieldName).toEqual(def.options.field);
    expect(statsDef.onStatisticField).toEqual(def.options.field);
  });
  it("works if no where is passed", async () => {
    const serviceSpy = spyOn(featureLayer, "queryFeatures").and.callFake(() => {
      return Promise.resolve({
        features: [{ attributes: { views: 19 } }],
      });
    });

    const def: DynamicValueDefinition = {
      // NOTE: this must be a service query, not an item-query
      // otherwise it will loop infinitely because of the spy
      type: "service-query",
      outPath: "views",
      options: {
        url: "https://services.arcgis.com/abc/arcgis/rest/services/MyService/FeatureServer/0",
        field: "views",
        statisticType: "sum",
      },
      aggregation: "count",
    };
    const result = await resolveServiceQueryValues(def, context);
    expect(result.views).toEqual(19);
    expect(serviceSpy.calls.count()).toEqual(1);
    const opts = serviceSpy.calls.argsFor(0)[0];
    expect(opts.url).toEqual(def.options.url);
    expect(opts.where).toEqual(def.options.where);
    const statsDef = opts.outStatistics[0];
    expect(statsDef.statisticType).toEqual(def.options.statisticType);
    expect(statsDef.outStatisticFieldName).toEqual(def.options.field);
    expect(statsDef.onStatisticField).toEqual(def.options.field);
  });
  it("returns 0 no stats returned", async () => {
    const serviceSpy = spyOn(featureLayer, "queryFeatures").and.callFake(() => {
      return Promise.resolve({});
    });

    const def: DynamicValueDefinition = {
      // NOTE: this must be a service query, not an item-query
      // otherwise it will loop infinitely because of the spy
      type: "service-query",
      outPath: "views",
      options: {
        url: "https://services.arcgis.com/abc/arcgis/rest/services/MyService/FeatureServer/0",
        field: "views",
        statisticType: "sum",
      },
      aggregation: "count",
    };
    const result = await resolveServiceQueryValues(def, context);
    expect(result.views).toEqual(0);
    expect(serviceSpy.calls.count()).toEqual(1);
    const opts = serviceSpy.calls.argsFor(0)[0];
    expect(opts.url).toEqual(def.options.url);
    expect(opts.where).toEqual(def.options.where);
    const statsDef = opts.outStatistics[0];
    expect(statsDef.statisticType).toEqual(def.options.statisticType);
    expect(statsDef.outStatisticFieldName).toEqual(def.options.field);
    expect(statsDef.onStatisticField).toEqual(def.options.field);
  });
});
