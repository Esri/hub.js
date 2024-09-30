import { getWithDefault } from "../../objects/get-with-default";
import { upgradeCatalogSchema } from "../../search/upgradeCatalogSchema";
import { IModel } from "../../types";
import { cloneObject } from "../../util";

/**
 * Add the default catalog structure to the Site model
 * Note: This in-memory migration is only applies via `fetchSite(..):IHubSite` and not
 * the older `getSiteById(...):IModel`. Changes made in this migration will not be
 * persisted to AGO until all other parts of the application stop relying on the legacy
 * catalog implementation
 * @param model
 * @returns
 */
export function applyCatalogStructureMigration(model: IModel): IModel {
  const siteCatalog = getWithDefault(model.data, "catalog", {});
  // This _shouldn't_ happen, but some of our testing sites might have this
  // migration already persisted in AGO. In that case, we ignore and move on
  if (!siteCatalog.schemaVersion) {
    const clonedModel = cloneObject(model);
    clonedModel.data.catalog = upgradeCatalogSchema(siteCatalog);
    return clonedModel;
  }
  return model;
}
