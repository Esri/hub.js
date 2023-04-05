import { IPortal, IUser } from "@esri/arcgis-rest-portal";
import {
  ArcGISContextManager,
  IArcGISContext,
  IDynamicItemQueryDefinition,
} from "../../../src";
import { resolveItemQueryValues } from "../../../src/utils/internal/resolveItemQueryValues";
import * as ResolveDynamicValueModule from "../../../src/utils/internal/resolveDynamicValue";

import { MOCK_AUTH } from "../../mocks/mock-auth";
import * as portal from "@esri/arcgis-rest-portal";

import { clearMemoizedCache } from "../../../src/utils/memoize";

describe("resolveItemQueryValues:", () => {
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
  it("runs memoized portal query", async () => {
    const fnSpy = spyOn(portal, "searchItems").and.callFake(() =>
      Promise.resolve({
        results: [
          { id: "001", views: 10, title: "One" },
          { id: "002", views: 20, title: "Two" },
          {
            id: "003",
            title: "Three",
            views: {
              type: "static-value",
              value: 23,
            },
          },
          { id: "004", title: "Four" },
        ],
      })
    );
    const def: IDynamicItemQueryDefinition = {
      type: "item-query",
      outPath: "views",
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
      aggregation: "sum",
    };
    const result = await resolveItemQueryValues(def, context);
    expect(result.views.value).toEqual(53);
    expect(result.views.sources.length).toEqual(3);
    clearMemoizedCache("portalSearchItemsAsItems");
  });
  it("handles no query", async () => {
    const fnSpy = spyOn(portal, "searchItems").and.callFake(() =>
      Promise.resolve({
        results: [
          { id: "001", views: 10, title: "One" },
          { id: "002", views: 20, title: "Two" },
          {
            id: "003",
            title: "Three",
            views: {
              type: "static-value",
              value: 23,
            },
          },
          { id: "004", title: "Four" },
        ],
      })
    );
    const def: IDynamicItemQueryDefinition = {
      type: "item-query",
      outPath: "views",
      // query: {
      //   targetEntity: "item",
      //   filters: [
      //     {
      //       operation: "AND",
      //       predicates: [{ id: "00c" }],
      //     },
      //   ],
      // },
      sourcePath: "views",
      aggregation: "sum",
    };
    const result = await resolveItemQueryValues(def, context);
    expect(result.views.value).toEqual(53);
    expect(result.views.sources.length).toEqual(3);
    clearMemoizedCache("portalSearchItemsAsItems");
  });
  it("handles recursive definitions", async () => {
    const fnSpy = spyOn(portal, "searchItems").and.callFake(() =>
      Promise.resolve({
        results: [
          { id: "001", views: 10, title: "One" },
          { id: "002", views: 20, title: "Two" },
          {
            id: "003",
            title: "Three",
            views: {
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
            },
          },
          { id: "004", title: "Four" },
        ],
      })
    );

    const recurseSpy = spyOn(
      ResolveDynamicValueModule,
      "resolveDynamicValue"
    ).and.callFake(() =>
      Promise.resolve({
        views: {
          value: 19,
          sources: [
            { id: "003", label: "Three", type: "Hub Project", value: 19 },
          ],
        },
      })
    );

    const def: IDynamicItemQueryDefinition = {
      type: "item-query",
      outPath: "views",
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
      aggregation: "sum",
    };
    const result = await resolveItemQueryValues(def, context);
    expect(result.views.value).toEqual(49);
    expect(result.views.sources.length).toEqual(3);
    expect(recurseSpy).toHaveBeenCalled();
    expect(fnSpy).toHaveBeenCalled();
    clearMemoizedCache("portalSearchItemsAsItems");
  });
});
