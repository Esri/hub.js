import { getCatalogFromSiteModel } from "../../src/sites/get-catalog-from-site-model";
import {
  describe,
  it,
  expect,
} from "vitest";
import { IModel } from "../../src/hub-types";
import { IHubCatalog } from "../../src/search/types/IHubCatalog";

describe("getCatalogFromSiteModel", () => {
  it("gets new catalog from legacy catalog", async () => {
    const model = {
      data: {
        catalog: { groups: ["00c", "00d"] },
        values: {},
      },
    } as unknown as IModel;

    const chk = getCatalogFromSiteModel(model);

    expect(chk.title).toBe("Default Site Catalog");
    expect(chk.scopes).toBeDefined();
    expect(chk.scopes.item.filters.length).toBe(1);
    expect(chk.scopes.item.filters[0].predicates[0].group).toEqual([
      "00c",
      "00d",
    ]);
    expect(chk.scopes.event.filters.length).toBe(1);
    expect(chk.scopes.event.filters[0].predicates[0].group).toEqual([
      "00c",
      "00d",
    ]);

    // check for collections
    expect(chk.collections.map((c) => c.key)).toEqual([
      "site",
      "dataset",
      "document",
      "appAndMap",
    ]);
  });

  it("gets new catalog if new catalog is available", async () => {
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

    expect(chk).toEqual(catalogV2);
  });
});
