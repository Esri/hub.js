import {
  deepContains,
  parsePath,
  pathToCatalogInfo,
} from "../../../src/core/_internal/deepContains";
import { ArcGISContextManager } from "../../../src/ArcGISContextManager";
import { MOCK_AUTH } from "../../mocks/mock-auth";
import {
  getProp,
  IArcGISContext,
  IDeepCatalogInfo,
  IHubCatalog,
} from "../../../src";
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
    const response = await deepContains(
      "3ef",
      "item",
      null as unknown as IDeepCatalogInfo[],
      context
    );
    expect(response.identifier).toBe("3ef");
    expect(response.isContained).toBe(false);
  });
  it("returns false if hiearchy is empty", async () => {
    const response = await deepContains("3ef", "item", [], context);
    expect(response.identifier).toBe("3ef");
    expect(response.isContained).toBe(false);
  });
  it("fetches and returns catalog if only id is passed", async () => {
    const fetchCatalogSpy = spyOn(
      FetchCatalogModule,
      "fetchCatalog"
    ).and.callFake(() => {
      return Promise.resolve(createMockCatalog("ff1"));
    });
    const hubSearchSpy = spyOn(HubSearchModule, "hubSearch").and.callFake(
      () => {
        return Promise.resolve({ results: [] });
      }
    );

    const response = await deepContains(
      AppItemId,
      "item",
      [{ id: "00c", entityType: "item" }],
      context
    );
    expect(response.identifier).toBe(AppItemId);
    expect(response.isContained).toBe(false);
    const cachedCatalog = getProp(response, `catalogInfo.00c.catalog`);
    expect(cachedCatalog).toEqual(createMockCatalog("ff1"));

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
      return Promise.resolve(createMockCatalog("ff1"));
    });
    const hubSearchSpy = spyOn(HubSearchModule, "hubSearch").and.callFake(
      () => {
        return Promise.resolve({ results: [] });
      }
    );

    const response = await deepContains(
      AppItemId,
      "item",
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
  it("uses catalog if passed and returns contained", async () => {
    const fetchCatalogSpy = spyOn(
      FetchCatalogModule,
      "fetchCatalog"
    ).and.callFake(() => {
      return Promise.resolve(createMockCatalog("ff1"));
    });
    const hubSearchSpy = spyOn(HubSearchModule, "hubSearch").and.callFake(
      () => {
        return Promise.resolve({ results: [{ id: AppItemId }] });
      }
    );

    const response = await deepContains(
      AppItemId,
      "item",
      [{ id: "00c", entityType: "item", catalog: createMockCatalog("ff1") }],
      context
    );
    expect(response.identifier).toBe(AppItemId);
    expect(response.isContained).toBe(true);
    expect(fetchCatalogSpy).toHaveBeenCalledTimes(0);
    expect(hubSearchSpy).toHaveBeenCalledTimes(1);
  });
  it("uses catalog if passed", async () => {
    const fetchCatalogSpy = spyOn(
      FetchCatalogModule,
      "fetchCatalog"
    ).and.callFake(() => {
      return Promise.resolve(createMockCatalog("ff1"));
    });
    const hubSearchSpy = spyOn(HubSearchModule, "hubSearch").and.callFake(
      () => {
        return Promise.resolve({ results: [] });
      }
    );

    const response = await deepContains(
      AppItemId,
      "item",
      [{ id: "00c", entityType: "item", catalog: createMockCatalog("ff1") }],
      context
    );
    expect(response.identifier).toBe(AppItemId);
    expect(response.isContained).toBe(false);
    expect(response.reason).toContain("not contained in catalog");
    expect(fetchCatalogSpy).toHaveBeenCalledTimes(0);
    expect(hubSearchSpy).toHaveBeenCalledTimes(1);
  });
});

describe("parsePath:", () => {
  // add tests for the parsePath function

  it("path needs even number of parts", () => {
    const path = "/sites/00b/initiatives";

    const result = parsePath(path);
    expect(result.valid).toBeFalsy();
    expect(result.reason).toBe(
      "Path does not contain an even number of parts."
    );
  });

  it("path needs less than 10 parts", () => {
    const path =
      "sites/00a/initiatives/00b/projects/00c/content/00d/content/00c/content/00e";

    const result = parsePath(path);
    expect(result.valid).toBeFalsy();
    expect(result.reason).toBe("Path is > 5 entities deep.");
  });

  it("path needs valid paths", () => {
    const path = "sites/00a/initiatives/00b/projects/00c/wallaby/00d";

    const result = parsePath(path);
    expect(result.valid).toBeFalsy();
    expect(result.reason).toBe("Path contains invalid segment: wallaby.");
  });

  it("good path parses clean", () => {
    const path = "sites/00a/initiatives/00b/projects/00c";
    const result = parsePath(path);
    expect(result.valid).toBeTruthy();
    expect(result.reason).toBe("");
    expect(result.parts).toEqual(path.split("/"));
  });
});

describe("pathToCatalogInfo:", () => {
  it("converts a path string into an array of IDeepCatalogInfo objects", () => {
    const path = "sites/a00a/initiatives/b00b/projects/c00c";
    const result = pathToCatalogInfo(path);
    expect(result).toEqual([
      { entityType: "item", id: "c00c" },
      { entityType: "item", id: "b00b" },
      { entityType: "item", id: "a00a" },
    ]);
  });

  it("throws an error if there are odd number of parts", () => {
    const path = "sites/00a/initiatives/00b/projects";
    expect(() => pathToCatalogInfo(path)).toThrowError(
      "Path does not contain an even number of parts."
    );
  });

  it("throws an error if the path is too deep", () => {
    const path =
      "sites/00a/initiatives/00b/projects/00c/content/00d/content/00c/content/00e";
    expect(() => pathToCatalogInfo(path)).toThrowError(
      "Path is > 5 entities deep."
    );
  });

  it("throws an error if the path contains invalid segments", () => {
    const path = "sites/00a/initiatives/00b/projects/00c/wallaby/00d";
    expect(() => pathToCatalogInfo(path)).toThrowError(
      "Path contains invalid segment: wallaby."
    );
  });
});

function createMockCatalog(groupId: string): IHubCatalog {
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
