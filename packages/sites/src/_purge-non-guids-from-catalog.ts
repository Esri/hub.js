import { IModel, getProp, cloneObject, isGuid } from "@esri/hub-common";

/**
 * Remove any non-guid entries from the data catalog groups array
 * @param {object} model Site Model
 */
export function _purgeNonGuidsFromCatalog(model: IModel) {
  if (getProp(model, "item.properties.schemaVersion") >= 1.3) return model;

  const clone = cloneObject(model);
  const groups = getProp(clone, "data.catalog.groups") || [];
  clone.data.catalog.groups = groups.filter(isGuid);

  clone.item.properties.schemaVersion = 1.3;
  return clone;
}
