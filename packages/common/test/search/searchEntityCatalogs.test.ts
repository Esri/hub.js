import { HubEntity, IArcGISContext, searchEntityCatalogs } from "../../src";

describe("searchEntityCatalogs:", () => {
  it("delegates to searchCatalogs", async () => {
    const spy = spyOn(
      require("../../src/search/searchCatalogs"),
      "searchCatalogs"
    ).and.callFake(() => {
      return Promise.resolve([
        {
          catalogTitle: "test",
          collectionResults: {
            test: {
              hasNext: false,
              results: [],
              total: 99,
            },
          },
        },
      ]);
    });
    const entity = { catalogs: [] } as unknown as HubEntity;
    const ctx = {} as unknown as IArcGISContext;
    const result = await searchEntityCatalogs(entity, "water", {}, ctx);
    expect(spy.calls.count()).toBe(1);
    // ensure we got the fake result - meaning it's a direct delegate
    expect(result.length).toBe(1);
    expect(result[0].catalogTitle).toBe("test");
  });
});
