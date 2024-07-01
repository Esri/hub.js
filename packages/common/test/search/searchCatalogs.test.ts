import { IArcGISContext, IHubCatalog, searchCatalogs } from "../../src";

describe("searchCatalogs:", () => {
  it("calls searchCollections on all catalogs", async () => {
    const spy = spyOn(
      require("../../src/search/Catalog").Catalog.prototype,
      "searchCollections"
    ).and.callFake(() => {
      return Promise.resolve({
        col1: {
          hasNext: false,
          results: [],
          total: 10,
        },
        col2: {
          hasNext: false,
          results: [],
          total: 20,
        },
      });
    });
    const catalogs: IHubCatalog[] = [
      { title: "catalog1", schemaVersion: 1 } as unknown as IHubCatalog,
      { title: "catalog2", schemaVersion: 1 } as unknown as IHubCatalog,
    ];
    const query = "water";
    const options = {};
    const ctx = {} as unknown as IArcGISContext;
    const result = await searchCatalogs(catalogs, query, options, ctx);
    expect(spy.calls.count()).toBe(2);
    expect(result.length).toBe(2);
    expect(result[0].catalogTitle).toBe("catalog1");
    expect(result[1].catalogTitle).toBe("catalog2");
  });
});
