import { IModel, getProp, cloneObject } from "@esri/hub-common";

/**
 * Move the data.values.groups array into the
 * data.catalog object
 * @param {Object} model Site Model
 */
export function _ensureCatalog(model: IModel) {
  // early exit
  if (getProp(model, "item.properties.schemaVersion") >= 1.2) return model;

  const clone = cloneObject(model);
  const catalog = getProp(clone, "data.catalog") || {};
  if (getProp(clone, "data.values.groups")) {
    catalog.groups = cloneObject(clone.data.values.groups);
    delete clone.data.values.groups;
  }
  clone.data.catalog = catalog;
  // bump the schemaVersion
  clone.item.properties.schemaVersion = 1.2;
  return clone;
}
