import { IModel } from "../../hub-types";
import { getProp } from "../../objects/get-prop";
import { getWithDefault } from "../../objects/get-with-default";
import { setProp } from "../../objects/set-prop";
import { IHubCollection } from "../../search/types/IHubCatalog";
import { searchCategoriesToCollections } from "../searchCategoriesToCollections";
import { SearchCategories } from "./enums/searchCategories";

/**
 * In-Memory migration that adds default collections to site models that have the
 * new catalog structure. These default collections will have the same names and
 * display order as found in `site.data.values.searchCategories`
 *
 * This migration simplifies display logic, as consuming components no longer
 * have to merge `catalog.collections` with the default collection definitions.
 *
 * This migration also lays the foundation for customization, since editors will
 * be able to modify these persisted default objects. For example, editors can
 * change the default labels, display order, or mark a default as "hidden" so the
 * public can't see it.
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
  ) as SearchCategories[];

  const collections: IHubCollection[] =
    searchCategoriesToCollections(searchCategories);

  // The umbrella site needs to have every collection visible by default,
  // unlike other sites that have the "site" collection hidden by default.
  if (getProp(model, "data.values.isUmbrella")) {
    collections.forEach((c) => {
      c.displayConfig.hidden = false;
    });
  }

  setProp("data.catalog.collections", collections, model);

  return model;
}
