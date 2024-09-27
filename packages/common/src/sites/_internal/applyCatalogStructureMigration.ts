import { IHubCatalog } from "../../search/types/IHubCatalog";
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
  // let siteCatalog = model.data.catalog || {};
  // // This _shouldn't_ happen, but some of our testing sites might have this
  // // migration already persisted in AGO. In that case, we ignore and move on
  // if (!siteCatalog.schemaVersion) {
  //   const groups = siteCatalog.groups || [];
  //   siteCatalog = {
  //     schemaVersion: 1,
  //     title: "Default Site Catalog",
  //     scopes: {
  //       item: {
  //         targetEntity: "item",
  //         filters: [],
  //       },
  //     },
  //     collections: [],
  //   } as IHubCatalog;

  //   // groups are used to set the item scope for the whole catalog
  //   siteCatalog.scopes.item.filters.push({
  //     predicates: [
  //       {
  //         group: [...groups],
  //       },
  //     ],
  //   });

  //   model.data.catalog = siteCatalog;
  // }

  // return model;
  const result = cloneObject(model);
  result.data.catalog = upgradeCatalogSchema(model.data.catalog || {});
  return result;
}
