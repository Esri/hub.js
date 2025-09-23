import { getProp } from "../../objects/get-prop";
import { IModel, IDraft } from "../../hub-types";
import { cloneObject } from "../../util";

/**
 * Remove underlinedLinks capability from site model
 * @private
 * @param {object} model Site Model
 * @returns {object}
 */
export function _migrateLinkUnderlinesCapability<T extends IModel | IDraft>(
  model: T
): T {
  // apply migration
  const clone = cloneObject(model);
  const capabilities = getProp(model, "data.values.capabilities");

  if (capabilities) {
    // migrate capabilities - remove underlinedLinks
    clone.data.values.capabilities = capabilities.filter(
      (capability: string) => capability !== "underlinedLinks"
    );
  }

  return clone;
}
