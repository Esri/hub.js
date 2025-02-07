import { IHubCatalog } from "../search";
import { IModel } from "../types";
import { cloneObject } from "../util";
import { applyCatalogStructureMigration } from "./_internal/applyCatalogStructureMigration";
import { applyDefaultCollectionMigration } from "./_internal/applyDefaultCollectionMigration";

/**
 * Gets new catalog from site model
 *
 * Catalog migration is performed from legacy catalog in `data.catalog`
 * if new catalog in `data.catalogV2` is not present in site's model.
 * Otherwise, new catalog in `data.catalogV2` is returned as is.
 *
 * @param {IModel} model
 */
export function getCatalogFromSiteModel(model: IModel): IHubCatalog {
  // data.catalogV2 contains site's updated catalog
  if (model.data.catalogV2) {
    return model.data.catalogV2;
  }

  let migrated = cloneObject(model);

  // Ensure we have the new Catalog structure
  migrated = applyCatalogStructureMigration(migrated);

  // Add default collections while preserving configuration from `data.values.searchCategories`
  migrated = applyDefaultCollectionMigration(migrated);

  return migrated.data.catalog;
}
