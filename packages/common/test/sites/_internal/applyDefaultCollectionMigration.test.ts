import { IHubCollection } from "../../../src/search/types/IHubCatalog";
import { applyDefaultCollectionMigration } from "../../../src/sites/_internal/applyDefaultCollectionMigration";
import { SearchCategories } from "../../../src/sites/_internal/types";
import { IModel } from "../../../src/hub-types";
import { cloneObject } from "../../../src/util";

const BASE_MODEL = {
  data: {
    catalog: {
      schemaVersion: 1,
      title: "Default Site Catalog",
      scopes: {
        item: {
          targetEntity: "item",
          filters: [],
        },
      },
      collections: [],
    },
    values: {},
  },
} as unknown as IModel;

describe("applyDefaultCollectionMigration", () => {
  let site: IModel;

  beforeEach(() => {
    site = cloneObject(BASE_MODEL);
  });

  it("Adds untouched default collections when no search categories are configured", () => {
    const result = applyDefaultCollectionMigration(site);
    const collectionKeys = result.data.catalog.collections.map(
      (c: IHubCollection) => c.key
    );
    expect(collectionKeys).toEqual([
      "site",
      "dataset",
      "document",
      "appAndMap",
    ]);
    const collectionLabels = result.data.catalog.collections.map(
      (c: IHubCollection) => c.label
    );
    expect(collectionLabels).toEqual([null, null, null, null]);
    const hiddenStatuses = result.data.catalog.collections.map(
      (c: IHubCollection) => c.displayConfig?.hidden
    );
    expect(hiddenStatuses).toEqual([true, false, false, false]);
  });

  it("Reorders, re-labels, and hides default collections when search categories are configured", () => {
    site.data.values.searchCategories = [
      {
        key: SearchCategories.APPS_AND_MAPS,
      },
      {
        key: SearchCategories.DOCUMENTS,
        hidden: true,
      },
      {
        overrideText: "My Sites",
        key: SearchCategories.SITES,
        hidden: false,
      },
      {
        overrideText: "My Data",
        key: SearchCategories.DATA,
        hidden: false,
      },
    ];
    const result = applyDefaultCollectionMigration(site);
    const collectionKeys = result.data.catalog.collections.map(
      (c: IHubCollection) => c.key
    );

    expect(collectionKeys).toEqual([
      "appAndMap",
      "document",
      "site",
      "dataset",
    ]);

    const collectionLabels = result.data.catalog.collections.map(
      (c: IHubCollection) => c.label
    );
    expect(collectionLabels).toEqual([null, null, "My Sites", "My Data"]);

    const hiddenStatuses = result.data.catalog.collections.map(
      (c: IHubCollection) => c.displayConfig.hidden
    );
    expect(hiddenStatuses).toEqual([false, true, false, false]);
  });

  it("Handles when a site has the 'initiatives' search category saved", () => {
    site.data.values.searchCategories = [
      {
        overrideText: "My Initiatives",
        key: SearchCategories.INITIATIVES,
        hidden: true,
      },
    ];
    const result = applyDefaultCollectionMigration(site);
    const collectionKeys = result.data.catalog.collections.map(
      (c: IHubCollection) => c.key
    );
    expect(collectionKeys).toEqual(["site"]);

    const collectionLabels = result.data.catalog.collections.map(
      (c: IHubCollection) => c.label
    );
    expect(collectionLabels).toEqual(["My Initiatives"]);

    const hiddenStatuses = result.data.catalog.collections.map(
      (c: IHubCollection) => c.displayConfig.hidden
    );
    expect(hiddenStatuses).toEqual([true]);
  });

  it("Omits unsupported search categories, like an explicit 'all' or events", () => {
    site.data.values.searchCategories = [
      {
        key: SearchCategories.EVENTS,
      },
      {
        overrideText: "Bad Title",
        key: "components.search.category_tabs.all",
        hidden: true,
      },
    ];
    const result = applyDefaultCollectionMigration(site);
    const collectionKeys = result.data.catalog.collections.map(
      (c: IHubCollection) => c.key
    );

    expect(collectionKeys).toEqual([]);

    const collectionLabels = result.data.catalog.collections.map(
      (c: IHubCollection) => c.label
    );
    expect(collectionLabels).toEqual([]);

    const hiddenStatuses = result.data.catalog.collections.map(
      (c: IHubCollection) => c.displayConfig.hidden
    );
    expect(hiddenStatuses).toEqual([]);
  });
  it("adds additional predicates for the appAndMap collection", () => {
    site.data.values.searchCategories = [
      {
        key: SearchCategories.APPS_AND_MAPS,
      },
    ];
    const result = applyDefaultCollectionMigration(site);
    const collectionKeys = result.data.catalog.collections.map(
      (c: IHubCollection) => c.key
    );
    expect(collectionKeys).toEqual(["appAndMap"]);

    const collectionPredicates =
      result.data.catalog.collections[0].scope.filters[0].predicates;
    expect(collectionPredicates).toEqual([
      {
        type: {
          any: ["$app", "$map"],
        },
      },
    ]);
  });
});
