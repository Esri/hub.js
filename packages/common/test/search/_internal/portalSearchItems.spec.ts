// Register a module-level mock so we can spy on named exports in ESM
vi.mock("@esri/arcgis-rest-portal", async () => ({
  ...((await vi.importActual("@esri/arcgis-rest-portal")) as any),
}));

import { portalSearchItems } from "../../../src/search/_internal/portalSearchItems";
import * as portalModule from "@esri/arcgis-rest-portal";
import * as portalItemsModule from "../../../src/search/_internal/portalSearchItems";
import { IQuery } from "../../../src/search/types/IHubCatalog";
import { IHubSearchOptions } from "../../../src/search/types/IHubSearchOptions";

describe("portalSearchItems", () => {
  afterEach(() => vi.restoreAllMocks());

  const PAGE = { results: [{ id: "a" }], nextStart: -1, total: 1 } as any;
  const query: IQuery = { query: true, filters: [] } as any;
  const options = {
    options: true,
    requestOptions: { requestOptions: true },
  } as unknown as IHubSearchOptions;

  beforeEach(() => {
    vi.spyOn(portalModule as any, "searchItems").mockResolvedValue(PAGE);
    vi.spyOn(portalItemsModule as any, "itemToSearchResult").mockImplementation(
      (item: any) => Promise.resolve({ id: item.id })
    );
    // stub content enrichment helpers to avoid deep parsing
    vi.mock("../../../src/content/search", async () => ({
      ...((await vi.importActual("../../../src/content/search")) as any),
      enrichContentSearchResult: async () => ({}),
    }));
    vi.mock("../../../src/content/get-family", async () => ({
      ...((await vi.importActual("../../../src/content/get-family")) as any),
      getFamilyTypes: () => ({}),
    }));
  });

  it("should call portal.searchItems and return results", async () => {
    const res = await portalSearchItems(query, options);
    expect(portalModule.searchItems).toHaveBeenCalledTimes(1);
    expect(res.total).toBe(1);
  });

  it("throws when options.requestOptions is missing", async () => {
    const q = { targetEntity: "item", filters: [] } as any;
    await expect(portalSearchItems(q, {} as any)).rejects.toThrow(
      "options.requestOptions is required."
    );
  });

  it("passes portal url through when authentication is missing", async () => {
    const resp = { total: 1, results: [{ id: "p1" }], nextStart: -1 } as any;
    (portalModule.searchItems as any).mockResolvedValue(resp);

    const opts = {
      requestOptions: { portal: "https://portal.example.com" },
    } as any;
    const q = { targetEntity: "item", filters: [] } as any;

    await portalSearchItems(q, opts);
    const callOpts = (portalModule.searchItems as any).mock.calls[0][0];
    expect(callOpts.portal).toBe("https://portal.example.com");
  });

  it("sets countFields and countSize when aggFields provided", async () => {
    const resp = { total: 0, results: [], nextStart: -1 } as any;
    (portalModule.searchItems as any).mockResolvedValue(resp);

    const opts = {
      requestOptions: { portal: "https://portal.example.com" },
      aggFields: ["a", "b"],
      aggLimit: 7,
    } as any;
    const q = { targetEntity: "item", filters: [] } as any;

    await portalSearchItems(q, opts);
    const callOpts = (portalModule.searchItems as any).mock.calls[0][0];
    expect(callOpts.countFields).toBe("a,b");
    expect(callOpts.countSize).toBe(7);
  });

  it("passes authentication through to searchItems when provided (as items)", async () => {
    const PAGE = { total: 1, results: [{ id: "it1" }], nextStart: -1 } as any;
    (portalModule.searchItems as any).mockResolvedValue(PAGE);

    // Provide an object shaped like an ArcGISIdentityManager for serialize()/deserialize paths
    const auth = {
      token: "tok",
      serialize: () => JSON.stringify({ token: "tok" }),
    } as any;
    const opts = { requestOptions: { authentication: auth } } as any;
    const q = { targetEntity: "item", filters: [] } as any;

    // import the as-items function dynamically from the same module
    const mod = await import("../../../src/search/_internal/portalSearchItems");
    const out = await mod.portalSearchItemsAsItems(q, opts);

    expect(portalModule.searchItems as any).toHaveBeenCalled();
    const so = (portalModule.searchItems as any).mock.calls[0][0];
    expect(so.authentication).toBe(auth);
    expect(out.results[0].id).toBe("it1");
  });
});

describe("itemToSearchResult mapping", () => {
  beforeEach(() => vi.resetModules());

  it("delegates to the correct enrichment functions for various types", async () => {
    // Mock enrichment modules before importing the module-under-test
    vi.mock("../../../src/content/search", async () => ({
      ...((await vi.importActual("../../../src/content/search")) as any),
      enrichContentSearchResult: async (item: any) => ({
        ...item,
        enriched: "content",
      }),
      enrichImageSearchResult: async (item: any) => ({
        ...item,
        enriched: "image",
      }),
    }));

    vi.mock("../../../src/pages/HubPages", async () => ({
      ...((await vi.importActual("../../../src/pages/HubPages")) as any),
      enrichPageSearchResult: async (item: any) => ({
        ...item,
        enriched: "page",
      }),
    }));

    vi.mock("../../../src/sites/HubSites", async () => ({
      ...((await vi.importActual("../../../src/sites/HubSites")) as any),
      enrichSiteSearchResult: async (item: any) => ({
        ...item,
        enriched: "site",
      }),
    }));

    vi.mock("../../../src/projects/fetch", async () => ({
      ...((await vi.importActual("../../../src/projects/fetch")) as any),
      enrichProjectSearchResult: async (item: any) => ({
        ...item,
        enriched: "project",
      }),
    }));

    vi.mock("../../../src/initiatives/HubInitiatives", async () => ({
      ...((await vi.importActual(
        "../../../src/initiatives/HubInitiatives"
      )) as any),
      enrichInitiativeSearchResult: async (item: any) => ({
        ...item,
        enriched: "initiative",
      }),
    }));

    vi.mock("../../../src/templates/fetch", async () => ({
      ...((await vi.importActual("../../../src/templates/fetch")) as any),
      enrichTemplateSearchResult: async (item: any) => ({
        ...item,
        enriched: "template",
      }),
    }));

    const mod = await import("../../../src/search/_internal/portalSearchItems");
    const { itemToSearchResult } = mod as any;

    const img = {
      id: "i",
      type: "Image",
      typeKeywords: [],
      title: "img",
    } as any;
    const page = {
      id: "p",
      type: "Hub Page",
      typeKeywords: [],
      title: "page",
    } as any;
    const hubSite = {
      id: "hs",
      type: "Hub Site Application",
      typeKeywords: [],
      title: "hubsite",
    } as any;
    const site = {
      id: "s",
      type: "Site Application",
      typeKeywords: [],
      title: "site",
    } as any;
    const proj = {
      id: "pr",
      type: "Hub Project",
      typeKeywords: [],
      title: "proj",
    } as any;
    const init = {
      id: "in",
      type: "Hub Initiative",
      typeKeywords: [],
      title: "init",
    } as any;
    const tpl = {
      id: "t",
      type: "Solution",
      typeKeywords: [],
      title: "tpl",
    } as any;
    const app = {
      id: "a",
      type: "Web Mapping Application",
      typeKeywords: [],
      title: "app",
    } as any;

    const imgRes = await itemToSearchResult(img, [], {} as any);
    expect(imgRes).toEqual(
      expect.objectContaining({ id: "i", enriched: "image" })
    );

    const pageRes = await itemToSearchResult(page, [], {} as any);
    expect(pageRes).toEqual(
      expect.objectContaining({ id: "p", enriched: "page" })
    );

    const hubSiteRes = await itemToSearchResult(hubSite, [], {} as any);
    expect(hubSiteRes).toEqual(
      expect.objectContaining({ id: "hs", enriched: "site" })
    );

    const siteRes = await itemToSearchResult(site, [], {} as any);
    expect(siteRes).toEqual(
      expect.objectContaining({ id: "s", enriched: "site" })
    );

    const projRes = await itemToSearchResult(proj, [], {} as any);
    expect(projRes).toEqual(
      expect.objectContaining({ id: "pr", enriched: "project" })
    );

    const initRes = await itemToSearchResult(init, [], {} as any);
    expect(initRes).toEqual(
      expect.objectContaining({ id: "in", enriched: "initiative" })
    );

    const tplRes = await itemToSearchResult(tpl, [], {} as any);
    expect(tplRes).toEqual(
      expect.objectContaining({ id: "t", enriched: "template" })
    );

    const appRes = await itemToSearchResult(app, [], {} as any);
    expect(appRes).toEqual(
      expect.objectContaining({ id: "a", enriched: "content" })
    );

    // legacy Web Mapping Application that contains hubSite should map to site
    const wma = {
      id: "w",
      type: "Web Mapping Application",
      typeKeywords: ["hubSite"],
      title: "wmap",
    } as any;
    const wmaRes = await (itemToSearchResult )(wma, [], {} as any);
    expect(wmaRes.id).toBe("w");
    expect(wmaRes.enriched).toBe("site");
  });
});
