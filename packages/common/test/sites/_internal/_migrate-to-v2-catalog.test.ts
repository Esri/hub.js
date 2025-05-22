import * as getCatalogFromSiteModelModule from "../../../src/sites/get-catalog-from-site-model";
import { IModel } from "../../../src";
import { _migrateToV2Catalog } from "../../../src/sites/_internal/_migrate-to-v2-catalog";

describe("_migrateToV2Catalog", () => {
  let getCatalogFromSiteModelSpy: jasmine.Spy;
  const mockedCatalog: any = {
    mocked: "catalog",
  };

  beforeEach(() => {
    getCatalogFromSiteModelSpy = spyOn(
      getCatalogFromSiteModelModule,
      "getCatalogFromSiteModel"
    ).and.returnValue(mockedCatalog);
  });

  afterEach(() => {
    getCatalogFromSiteModelSpy.calls.reset();
  });

  it("Bumps schema and adds catalogV2", () => {
    const siteModel = {
      item: { properties: { schemaVersion: 1.8 } },
      data: { values: {} },
    } as unknown as IModel;

    const result = _migrateToV2Catalog(siteModel);

    expect(getCatalogFromSiteModelSpy.calls.count()).toBe(1);
    expect(result.item.properties.schemaVersion).toEqual(
      1.9,
      "site.item.properties.schemaVersion should be 1.9"
    );
    expect(result.data.catalogV2).toBeTruthy(
      "site.data.catalogV2 should be present"
    );
  });

  it("Does not run the migration if schemaVersion is >= 1.9", () => {
    const siteModel = {
      item: {
        properties: {
          schemaVersion: 1.9,
        },
      },
      data: {
        catalogV2: { different: "catalog" },
        values: {},
      },
    } as unknown as IModel;

    const result = _migrateToV2Catalog(siteModel);
    expect(getCatalogFromSiteModelSpy.calls.count()).toBe(0);
    expect(result.data.catalogV2).toEqual(
      { different: "catalog" },
      "The catalogV2 object should be unchanged."
    );
  });
});
