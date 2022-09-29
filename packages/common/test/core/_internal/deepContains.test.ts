import { deepContains } from "../../../src/core/_internal/deepContains";
import { ArcGISContextManager } from "../../../src/ArcGISContextManager";
import { MOCK_AUTH } from "../../mocks/mock-auth";
import { getProp, IArcGISContext, IHubCatalog } from "../../../src";
import { IPortal, IUser } from "@esri/arcgis-rest-portal";
import * as FetchCatalogModule from "../../../src/search/fetchCatalog";
import * as HubSearchModule from "../../../src/search/hubSearch";
// Test GUID
const AppItemId: string = "63c765456d23439e8faf0e4172fc9b23";

describe("deepContains:", () => {
  let context: IArcGISContext;
  beforeEach(async () => {
    const authdCtxMgr = await ArcGISContextManager.create({
      authentication: MOCK_AUTH,
      currentUser: {
        username: "casey",
      } as unknown as IUser,
      portal: {
        name: "DC R&D Center",
        id: "BRXFAKE",
        urlKey: "fake-org",
      } as unknown as IPortal,
      portalUrl: "https://myserver.com",
    });
    context = authdCtxMgr.context;
  });
  it("returns false if no hiearchy passed", async () => {
    const response = await deepContains("3ef", null, context);
    expect(response.identifier).toBe("3ef");
    expect(response.isContained).toBe(false);
  });
  it("returns false if hiearchy is empty", async () => {
    const response = await deepContains("3ef", [], context);
    expect(response.identifier).toBe("3ef");
    expect(response.isContained).toBe(false);
  });
  it("fetches and returns catalog if only id is passed", async () => {
    const fetchCatalogSpy = spyOn(
      FetchCatalogModule,
      "fetchCatalog"
    ).and.callFake(() => {
      return Promise.resolve(createCatalog("ff1"));
    });
    const hubSearchSpy = spyOn(HubSearchModule, "hubSearch").and.callFake(
      () => {
        return Promise.resolve({ results: [] });
      }
    );

    const response = await deepContains(
      AppItemId,
      [{ id: "00c", entityType: "item" }],
      context
    );
    expect(response.identifier).toBe(AppItemId);
    expect(response.isContained).toBe(false);
    const cachedCatalog = getProp(response, `catalogInfo.00c.catalog`);
    expect(cachedCatalog).toEqual(createCatalog("ff1"));

    expect(fetchCatalogSpy).toHaveBeenCalledTimes(1);
    expect(fetchCatalogSpy.calls.argsFor(0)[0]).toEqual(
      "00c",
      "should fetch catalog based on Id in hiearchy"
    );
    expect(hubSearchSpy).toHaveBeenCalledTimes(1);
  });
  it("fetches multiple catalogs if only ids are passed", async () => {
    const fetchCatalogSpy = spyOn(
      FetchCatalogModule,
      "fetchCatalog"
    ).and.callFake(() => {
      return Promise.resolve(createCatalog("ff1"));
    });
    const hubSearchSpy = spyOn(HubSearchModule, "hubSearch").and.callFake(
      () => {
        return Promise.resolve({ results: [] });
      }
    );

    const response = await deepContains(
      AppItemId,
      [
        { id: "00c", entityType: "item" },
        { id: "00d", entityType: "item" },
      ],
      context
    );
    expect(response.identifier).toBe(AppItemId);
    expect(response.isContained).toBe(false);
    expect(fetchCatalogSpy).toHaveBeenCalledTimes(2);
    expect(fetchCatalogSpy.calls.argsFor(0)[0]).toEqual(
      "00c",
      "should fetch catalog based on Id in hiearchy"
    );
    expect(fetchCatalogSpy.calls.argsFor(1)[0]).toEqual(
      "00d",
      "should fetch catalog based on Id in hiearchy"
    );
    expect(hubSearchSpy).toHaveBeenCalledTimes(2);
  });
  it("uses catalog if passed", async () => {
    const fetchCatalogSpy = spyOn(
      FetchCatalogModule,
      "fetchCatalog"
    ).and.callFake(() => {
      return Promise.resolve(createCatalog("ff1"));
    });
    const hubSearchSpy = spyOn(HubSearchModule, "hubSearch").and.callFake(
      () => {
        return Promise.resolve({ results: [] });
      }
    );

    const response = await deepContains(
      AppItemId,
      [{ id: "00c", entityType: "item", catalog: createCatalog("ff1") }],
      context
    );
    expect(response.identifier).toBe(AppItemId);
    expect(response.isContained).toBe(false);
    expect(fetchCatalogSpy).toHaveBeenCalledTimes(0);
    expect(hubSearchSpy).toHaveBeenCalledTimes(1);
  });
});

function createCatalog(groupId: string): IHubCatalog {
  return {
    schemaVersion: 1,
    title: "Default Catalog",
    scopes: {
      item: {
        targetEntity: "item",
        filters: [
          {
            predicates: [
              {
                group: [groupId],
              },
            ],
          },
        ],
      },
    },
    collections: [],
  };
}
