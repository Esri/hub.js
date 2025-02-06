import { getWithDefault } from "../objects/get-with-default";
import {
  getWellknownCollections,
  IHubCatalog,
  IHubCollection,
} from "../search";
import { IModel } from "../types";
import { capitalize, cloneObject } from "../util";
import { applyCatalogStructureMigration } from "./_internal/applyCatalogStructureMigration";
import { applyDefaultCollectionMigration } from "./_internal/applyDefaultCollectionMigration";

/**
 * Get IHubCatalog from site model
 * @param {IModel} model
 */
export function getCatalogFromSiteModel(model: IModel): IHubCatalog {
  // catalogV2 contains site's IHubCatalog
  if (model.data.catalogV2) {
    return model.data.catalogV2;
  }

  // migrate legacy catalog to IHubCatalog
  let migrated = cloneObject(model);
  migrated = applyCatalogStructureMigration(migrated);
  migrated = applyDefaultCollectionMigration(migrated);
  migrated = applyDefaultCollectionValues(migrated);

  return migrated.data.catalog;
}

/**
 * Default collection values like `scope.filter` and `label`
 * is required for Hub OGC Search service. This applies
 * default collection values required for search.
 *
 */
function applyDefaultCollectionValues(model: IModel): IModel {
  const collections: IHubCollection[] = getWithDefault(
    model.data,
    "catalog.collections",
    []
  );
  const wellKnownCollections = getWellknownCollections("", "item");

  collections.forEach((collection: IHubCollection) => {
    const wellKnownCollection = wellKnownCollections.find(
      (c: IHubCollection) => c.key === collection.key
    );
    if (wellKnownCollection) {
      collection.scope.filters = wellKnownCollection.scope.filters;
    }
    collection.label =
      collection.key === "appAndMap"
        ? "App and Map"
        : capitalize(collection.key);
  });
  return model;
}
