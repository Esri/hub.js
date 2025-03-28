import { getProp, setProp } from "../../objects";
import { IDraft, IModel } from "../../hub-types";
import { cloneObject } from "../../util";
import { getCatalogFromSiteModel } from "../get-catalog-from-site-model";

/**
 * Adds a new `catalogV2` property to the site model, which is a migrated version of the existing catalog.
 * @private
 * @param {object} model Site Model
 * @returns {object}
 */
export function _migrateToV2Catalog<T extends IModel | IDraft>(model: T): T {
  const newSchemaVersion = 1.9;
  // do nothing if migration already applied
  if (getProp(model, "item.properties.schemaVersion") >= newSchemaVersion) {
    return model;
  }

  // apply migration
  const clone = cloneObject(model);
  const newCatalog = getCatalogFromSiteModel(clone as IModel);
  clone.data.catalogV2 = newCatalog;

  // increment schemaVersion
  setProp("item.properties.schemaVersion", newSchemaVersion, clone);

  return clone;
}
