import { getWithDefault } from "../../objects";
import { IModel } from "../../hub-types";
import { searchCategoriesToCollections } from "../searchCategoriesToCollections";

/**
 * In-Memory migration that adds default collections to site models that have the
 * new catalog structure. These default collections will have the same names and
 * display order found in `site.data.values.searchCategories`
 *
 * This migration simplifies display logic, as consuming components no longer
 * have to merge `catalog.collections` with the default collection definitions.
 *
 * This migration also lays the foundation for customization, since editors will
 * be able to modify these persisted default objects. For example, editors can
 * change the default labels, display order, or mark a default as "hidden" so the
 * public can't see it.
 *
 * NOTE: The changes made in this migration will not be persisted to AGO at this time
 *
 * @param model site model to migrate
 * @returns a migrated model with default `IHubCollection` objects added
 * to the catalog
 */
export function applyDefaultCollectionMigration(model: IModel): IModel {
  const searchCategories = getWithDefault(
    model.data,
    "values.searchCategories",
    undefined
  );
  model.data.catalog.collections =
    searchCategoriesToCollections(searchCategories);

  return model;
}
