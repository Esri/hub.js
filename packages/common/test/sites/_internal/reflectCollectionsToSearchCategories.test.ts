import { IHubCollectionPersistance } from "../../../src/search/types/IHubCatalog";
import { WellKnownCollection } from "../../../src/search/wellKnownCatalog";
import { reflectCollectionsToSearchCategories } from "../../../src/sites/_internal/reflectCollectionsToSearchCategories";
import { SearchCategories } from "../../../src/sites/_internal/types";
import { IModel } from "../../../src/types";
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

describe("reflectCollectionsToSearchCategories", () => {
  let site: IModel;
  beforeEach(() => {
    site = cloneObject(BASE_MODEL);
  });
  it('handles the collection "hidden" configuration', () => {
    site.data.catalog.collections = [
      {
        label: null,
        key: "dataset",
        targetEntity: "item",
        hidden: true,
        scope: {
          targetEntity: "item",
          collection: "dataset",
          filters: [],
        },
      } as IHubCollectionPersistance,
      {
        label: null,
        key: "document",
        targetEntity: "item",
        hidden: false,
        scope: {
          targetEntity: "item",
          collection: "document",
          filters: [],
        },
      } as IHubCollectionPersistance,
    ];

    const result = reflectCollectionsToSearchCategories(site);
    expect(result.data.values.searchCategories).toEqual([
      {
        key: SearchCategories.DATA,
        hidden: true,
        queryParams: {
          collection: "Dataset",
        },
      },
      {
        key: SearchCategories.DOCUMENTS,
        hidden: false,
        queryParams: {
          collection: "Document",
        },
      },
    ]);
  });
  it("handles re-labeled collections", () => {
    site.data.catalog.collections = [
      {
        label: "My Cool Sites!",
        key: "site",
        targetEntity: "item",
        hidden: false,
        scope: {
          targetEntity: "item",
          collection: "site",
          filters: [],
        },
      } as IHubCollectionPersistance,
      {
        label: "Apps & Maps",
        key: "appAndMap",
        targetEntity: "item",
        hidden: false,
        scope: {
          targetEntity: "item",
          collection: "appAndMap",
          filters: [],
        },
      } as IHubCollectionPersistance,
    ];

    const result = reflectCollectionsToSearchCategories(site);
    expect(result.data.values.searchCategories).toEqual([
      {
        overrideText: "My Cool Sites!",
        key: SearchCategories.SITES,
        hidden: false,
        queryParams: {
          collection: "Site",
        },
      },
      {
        overrideText: "Apps & Maps",
        key: SearchCategories.APPS_AND_MAPS,
        hidden: false,
        queryParams: {
          collection: "App,Map",
        },
      },
    ]);
  });
  it("filters out collections that searchCategories does not support", () => {
    site.data.catalog.collections = [
      // Can be converted to search category, will be persisted
      {
        label: null,
        key: "dataset",
        targetEntity: "item",
        hidden: false,
        scope: {
          targetEntity: "item",
          collection: "dataset",
          filters: [],
        },
      } as IHubCollectionPersistance,
      // 'all' _can_ be converted to a search category, but we explicitly do not persist it
      {
        label: null,
        key: "all",
        targetEntity: "item",
        hidden: false,
        scope: {
          targetEntity: "item",
          collection: "all" as WellKnownCollection,
          filters: [],
        },
      } as IHubCollectionPersistance,
      // Customer-defined collection, cannot be converted to search category
      {
        label: "My Custom Collection",
        key: "custom-collection",
        targetEntity: "event",
        hidden: false,
        scope: {
          targetEntity: "event",
          filters: [],
        },
      } as IHubCollectionPersistance,
    ];

    const result = reflectCollectionsToSearchCategories(site);
    expect(result.data.values.searchCategories).toEqual([
      {
        key: SearchCategories.DATA,
        hidden: false,
        queryParams: {
          collection: "Dataset",
        },
      },
    ]);
  });
});
