import { getProp } from "../../objects";
import { IModel } from "../../types";
import { cloneObject } from "../../util";

/**
 * Enforce lowercase domains
 * @param {Object} model Site Model
 * @private
 */
export function _enforceLowercaseDomains(model: IModel) {
  // exit if this has been applied...
  if (getProp(model, "item.properties.schemaVersion") >= 1.1) return model;

  const clone = cloneObject(model);
  // all the possible domain properties must be lower case
  [
    "subdomain",
    "defaultHostname",
    "internalUrl",
    "customHostname",
    "externalUrl",
  ].forEach((prop) => {
    if (
      clone.data.values[prop] &&
      typeof clone.data.values[prop] === "string"
    ) {
      clone.data.values[prop] = clone.data.values[prop].toLowerCase();
    }
  });
  // bump the schemaVersion
  clone.item.properties.schemaVersion = 1.1;
  return clone;
}
