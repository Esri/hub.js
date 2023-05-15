import { getProp } from "../../objects/get-prop";
import { IHubCatalog } from "../../search/types/IHubCatalog";
import { IModel } from "../../types";

/**
 * Add the default catalog and collections to the Site model
 * Note: This migration is only applies via `fetchSite(..):IHubSite` and not
 * the older `getSiteById(...):IModel`
 * @param model
 * @returns
 */
export function catalogMigration(model: IModel): IModel {
  if (getProp(model, "item.properties.schemaVersion") >= 1.7) {
    return model;
  } else {
    let siteCatalog = model.data.catalog || {};
    if (!siteCatalog.hasOwnProperty("schemaVersion")) {
      const groups = siteCatalog.groups || [];
      siteCatalog = {
        schemaVersion: 1,
        title: "Default Site Catalog",
        scopes: {
          item: {
            targetEntity: "item",
            filters: [],
          },
        },
        collections: [],
      } as IHubCatalog;

      // groups are used to set the item scope for the whole catalog
      siteCatalog.scopes.item.filters.push({
        predicates: [
          {
            group: [...groups],
          },
        ],
      });
      // in order to not break existing code, we need store the
      // new catalog on `data.catalogv2` and leave old catalog on `data.catalog`
      // The property mapper will expose this as `catalog` on the IHubSite
      // and re-map it back to `data.catalogv2` when saving
      // This is only done if the data.catalog does not have `schemaVersion`
      // property. At some point we will deprecate the old catalog
      // remove the mappings, and save the catalog directly to `data.catalog`
      model.data.catalogv2 = siteCatalog;
    }
    // set the schema version
    model.item.properties.schemaVersion = 1.7;

    return model;
  }
}
