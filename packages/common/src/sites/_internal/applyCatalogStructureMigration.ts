import { getWithDefault } from "../../objects/get-with-default";
import { upgradeCatalogSchema } from "../../search/upgradeCatalogSchema";
import { IModel } from "../../hub-types";
import { cloneObject } from "../../util";
import { getProp } from "../../objects/get-prop";

/**
 * Add the default catalog structure to the Site model
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

    // The umbrella site needs a special predicate added to the catalog to ensure
    // that its item scope only includes results shared to open data groups.
    // We also don't want to include the groups from the site model
    if (getProp(clonedModel, "data.values.isUmbrella")) {
      clonedModel.data.catalog.scopes.item.filters = [
        {
          predicates: [{ openData: true }],
        },
      ];
      // The umbrella site doesn't have an event scope
      clonedModel.data.catalog.scopes.event.filters = [];
    }

    // applyCatalogSchema sets the catalog to `Default Catalog` but this fn previously
    // set it to `Default Site Catalog`. Overriding title to `Default Site Catalog` here
    // to prevent any potential regressions
    clonedModel.data.catalog.title = "Default Site Catalog";
    return clonedModel;
  }
  return model;
}
