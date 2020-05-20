import { IModel, getProp, cloneObject } from "@esri/hub-common";

/**
 * Apply the first schema version to the item
 * @param {Object} model Site Model
 */
export function _applySiteSchema(model: IModel) {
  // if this has already been thru this step... skip it...
  if (getProp(model, "item.properties.schemaVersion") >= 1) return model;

  const clone = cloneObject(model);
  // proactively purge old properties
  ["groupId", "title"].forEach(prop => {
    delete clone.data.values[prop];
  });
  // ensure item.properties
  if (!clone.item.properties) {
    clone.item.properties = {};
  }
  clone.item.properties.schemaVersion = 1;

  // Groups!
  if (clone.data.values.groups && Array.isArray(clone.data.values.groups)) {
    // we have some groups arrays in prod where the contents are a mix of strings and objects.
    // we need to ensure this is just an array of groupIds...
    const groupIds = clone.data.values.groups
      .map((entry: any) => {
        if (typeof entry === "object") {
          return entry.id;
        } else {
          return entry;
        }
      })
      .filter((entry: string) => !!entry);
    // now assign this back to the groups
    clone.data.values.groups = groupIds;
  }
  return clone;
}
