import { HubEntity } from "../../src/core/types/HubEntity";
import { searchEntityCatalogs } from "../../src/search/searchEntityCatalogs";
import { IArcGISContext } from "../../src/types/IArcGISContext";
import * as searchCatalogsModule from "../../src/search/searchCatalogs";

describe("searchEntityCatalogs:", () => {
  it("delegates to searchCatalogs", async () => {
    const spy = spyOn(searchCatalogsModule, "searchCatalogs").and.callFake(
      () => {
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
      }
    );
    const entity = { catalogs: [] } as unknown as HubEntity;
    const ctx = {} as unknown as IArcGISContext;
    const result = await searchEntityCatalogs(entity, "water", {}, ctx);
    expect(spy.calls.count()).toBe(1);
    // ensure we got the fake result - meaning it's a direct delegate
    expect(result.length).toBe(1);
    expect(result[0].catalogTitle).toBe("test");
  });
});
