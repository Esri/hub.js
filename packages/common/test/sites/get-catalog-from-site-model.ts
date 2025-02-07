import { IHubCatalog } from "../../src";
import { getCatalogFromSiteModel } from "../../src/sites/get-catalog-from-site-model";
import { IModel } from "../../src/types";

describe("getCatalogFromSiteModel", () => {
  it("gets updated catalog from legacy catalog", async () => {
    const model = {
      data: {
        catalog: { groups: ["00c", "00d"] },
        values: {},
      },
    } as unknown as IModel;

    const chk = getCatalogFromSiteModel(model);

    expect(chk.title).toBe("Default Site Catalog");
    expect(chk.scopes).toBeDefined();
    expect(chk.scopes?.item?.filters.length).toBe(1);
    expect(chk.scopes?.item?.filters[0].predicates[0].group).toEqual([
      "00c",
      "00d",
    ]);
    expect(chk.scopes?.event?.filters.length).toBe(1);
    expect(chk.scopes?.event?.filters[0].predicates[0].group).toEqual([
      "00c",
      "00d",
    ]);

    // check for collection
    expect(chk.collections?.map((c) => c.key)).toEqual([
      "all",
      "site",
      "dataset",
      "document",
      "appAndMap",
    ]);
  });

  it("gets IHubCatalog from legacy catalog", async () => {
    const catalogV2 = {
      schemaVersion: 1,
      title: "Default Site Catalog",
      scopes: {
        item: {
          targetEntity: "item",
          filters: [],
        },
      },
      collections: [],
    } as unknown as IHubCatalog;

    const model = {
      data: {
        catalogV2,
        values: {},
      },
    } as unknown as IModel;

    const chk = getCatalogFromSiteModel(model);

    // check for collection
    expect(chk).toEqual(catalogV2);
  });
});
