import {
  ArcGISContextManager,
  IArcGISContext,
  IItemQueryMetricSource,
  IMetric,
  IQuery,
  IServiceQueryMetricSource,
  clearMemoizedCache,
  cloneObject,
  resolveMetric,
} from "../../src";
import { MOCK_AUTH } from "../mocks/mock-auth";
import * as PortalModule from "@esri/arcgis-rest-portal";
import * as FLModule from "@esri/arcgis-rest-feature-layer";
import * as PSModule from "../../src/search/_internal/portalSearchItems";

describe("resolveMetric:", () => {
  let ctx: IArcGISContext;
  beforeEach(async () => {
    // When we pass in all this information, the context
    // manager will not try to fetch anything, so no need
    // to mock those calls
    const authdCtxMgr = await ArcGISContextManager.create({
      authentication: MOCK_AUTH,
      currentUser: {
        username: "casey",
      } as unknown as PortalModule.IUser,
      portal: {
        name: "DC R&D Center",
        id: "BRXFAKE",
        urlKey: "fake-org",
      } as unknown as PortalModule.IPortal,
      portalUrl: "https://myserver.com",
    });
    ctx = authdCtxMgr.context;
  });

  describe("throws:", () => {
    it("throws when invalid type passed in", async () => {
      const metric: IMetric = {
        id: "initiativeBudget_00c",
        name: "Initiative Budget",
        source: {
          type: "invalid-type",
          value: 100000,
        } as unknown as IItemQueryMetricSource,
      };
      try {
        await resolveMetric(metric, ctx);
      } catch (ex) {
        expect((ex as any).message).toBe("Unknown metric type passed in.");
      }
    });
  });

  describe("static-value: ", () => {
    const metric: IMetric = {
      id: "initiativeBudget_00c",
      name: "Initiative Budget",
      source: {
        type: "static-value",
        value: 100000,
      },
      entityInfo: {
        id: "00c",
        name: "Some Project Name",
        type: "Hub Project",
      },
    };
    it("returns array with single value", async () => {
      const chk = await resolveMetric(metric, ctx);
      expect(chk).toEqual([
        {
          attributes: {
            id: "00c",
            name: "Some Project Name",
            type: "Hub Project",
            initiativeBudget: 100000,
          },
        },
      ]);
    });
  });

  describe("service-query: ", () => {
    const serviceMetric: IMetric = {
      id: "initiativeBudget_00c",
      name: "Initiative Budget",
      source: {
        type: "service-query",
        serviceUrl:
          "https://services.arcgis.com/abc/arcgis/rest/services/a/FeatureServer",
        layerId: 0,
        field: "budget",
        statistic: "sum",
        where: "status = 'complete'",
      } as IServiceQueryMetricSource,
      entityInfo: {
        id: "00c",
        name: "Some Project Name",
        type: "Hub Project",
      },
    };
    it("creates a query and calls queryFeatures ", async () => {
      const querySpy = spyOn(FLModule, "queryFeatures").and.callFake(() => {
        return Promise.resolve({
          features: [{ attributes: { budget: 1230 } }],
        });
      });

      const chk = await resolveMetric(serviceMetric, ctx);
      expect(querySpy).toHaveBeenCalledTimes(1);
      // inspect the options passed to queryFeatures
      const opts = querySpy.calls.mostRecent().args[0];
      expect(opts.url).toEqual(
        "https://services.arcgis.com/abc/arcgis/rest/services/a/FeatureServer/0"
      );
      expect(opts.where).toEqual("status = 'complete'");
      expect(opts.f).toEqual("json");
      const statsDef = {
        onStatisticField: "budget",
        statisticType: "sum",
        outStatisticFieldName: "budget",
      };
      expect(opts.outStatistics).toEqual([statsDef]);
      expect(opts.authentication).toEqual(MOCK_AUTH);
      // inspect the result
      expect(chk.length).toEqual(1);
      expect(chk[0].attributes).toEqual({
        id: "00c",
        name: "Some Project Name",
        type: "Hub Project",
        initiativeBudget: 1230,
      });
    });
    it("uses default where if not passed ", async () => {
      const querySpy = spyOn(FLModule, "queryFeatures").and.callFake(() => {
        return Promise.resolve({
          features: [{ attributes: { budget: 1230 } }],
        });
      });

      const metricWithoutWhere = cloneObject(serviceMetric);
      delete (metricWithoutWhere.source as IServiceQueryMetricSource).where;

      await resolveMetric(metricWithoutWhere, ctx);
      expect(querySpy).toHaveBeenCalledTimes(1);
      // inspect the options passed to queryFeatures
      const opts = querySpy.calls.mostRecent().args[0];

      expect(opts.where).toEqual("1=1");
    });
  });

  describe("item-query: ", () => {
    const itemMetricWithScope: IMetric = {
      id: "initiativeBudget_00f",
      name: "Initiative Budget",
      source: {
        type: "item-query",
        keywords: ["initiative|00f"],
        itemTypes: ["Hub Project"],
        propertyPath: "properties.budget",
        scope: {
          targetEntity: "item",
          filters: [{ operation: "AND", predicates: [{ orgid: "FAKEORG" }] }],
        },
      } as IItemQueryMetricSource,
      entityInfo: {
        id: "00c",
        name: "Some Project Name",
        type: "Hub Project",
      },
    };
    const MockResponse = {
      results: [
        {
          id: "cc0",
          title: "Search Result 1",
          type: "Hub Project",
          properties: {
            budget: 1230,
          },
        },
      ],
    };
    describe("without recursion:", () => {
      let querySpy: jasmine.Spy;
      beforeEach(() => {
        // since spies don't have a `.name` property the
        // memoization cache just have an entry for ``
        clearMemoizedCache();
        querySpy = spyOn(PSModule, "portalSearchItemsAsItems").and.callFake(
          () => {
            return Promise.resolve(MockResponse);
          }
        );
      });
      it("return simple property", async () => {
        const chk = await resolveMetric(itemMetricWithScope, ctx);
        // Since this is using memoization, we can't get reliable
        // call counts out, even though we're clearing the cache
        expect(querySpy).toHaveBeenCalledTimes(1);
        // inspect the options passed to queryFeatures
        const query: IQuery = querySpy.calls.mostRecent().args[0];
        expect(query.targetEntity).toEqual("item");
        expect(query.filters.length).toEqual(2);

        expect(query.filters[0]).toEqual({
          operation: "AND",
          predicates: [
            {
              typekeywords: ["initiative|00f"],
              type: ["Hub Project"],
            },
          ],
        });
        expect(query.filters[1]).toEqual({
          operation: "AND",
          predicates: [
            {
              orgid: "FAKEORG",
            },
          ],
        });
        expect(chk[0].attributes).toEqual({
          id: "cc0",
          name: "Search Result 1",
          type: "Hub Project",
          initiativeBudget: 1230,
        });
      });
      it("skips item if it does not have property", async () => {
        // this is just for code-coverage... not a realistic scenario
        const tempMetric = cloneObject(itemMetricWithScope);
        (tempMetric.source as IItemQueryMetricSource).propertyPath =
          "properties.missing";
        // also remove scope
        delete (tempMetric.source as IItemQueryMetricSource).scope;

        await resolveMetric(tempMetric, ctx);
        expect(querySpy).toHaveBeenCalledTimes(1);
      });
      it("handles scope and empty itemTypes array", async () => {
        const metricWithoutTypes = cloneObject(itemMetricWithScope);
        delete (metricWithoutTypes.source as IItemQueryMetricSource).itemTypes;

        await resolveMetric(metricWithoutTypes, ctx);
        // Since this is using memoization, we can't get reliable
        // call counts out, even though we're clearing the cache
        expect(querySpy).toHaveBeenCalledTimes(1);
        const query: IQuery = querySpy.calls.mostRecent().args[0];
        expect(query.targetEntity).toEqual("item");
        expect(query.filters.length).toEqual(2);

        expect(query.filters[0]).toEqual({
          operation: "AND",
          predicates: [
            {
              typekeywords: ["initiative|00f"],
            },
          ],
        });
      });
    });

    describe("with recursion:", () => {
      const ResponseWithStaticValue = {
        results: [
          {
            id: "cc0",
            title: "Search Result 1",
            type: "Hub Project",
            properties: {
              budget: {
                id: "projectFunding",
                name: "Project Funding",
                source: {
                  type: "static-value",
                  value: 20000,
                },
              },
            },
          },
        ],
      };
      let querySpy: jasmine.Spy;
      beforeEach(() => {
        // since spies don't have a `.name` property the
        // memoization cache just have an entry for ``
        clearMemoizedCache();
        querySpy = spyOn(PSModule, "portalSearchItemsAsItems").and.callFake(
          (opts: any) => {
            return Promise.resolve(ResponseWithStaticValue);
          }
        );
      });
      it("recurses when static value is returned", async () => {
        const changed = cloneObject(itemMetricWithScope);
        // Need to change the source of the item metric just enough
        // that the memoization cache will be different
        (changed.source as IItemQueryMetricSource).itemTypes = [
          "Hub Initiative",
        ];

        await resolveMetric(itemMetricWithScope, ctx);
        // Since this is using memoization, we can't get reliable
        // call counts out, even though we're clearing the cache
        expect(querySpy).toHaveBeenCalledTimes(1);
      });
    });
  });
});
