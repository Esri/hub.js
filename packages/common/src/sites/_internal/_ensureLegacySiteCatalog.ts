import { getProp } from "../../objects/get-prop";
import { IModel } from "../../types";
import { catalogToLegacy } from "./convertCatalogToLegacyFormat";

/**
 * On the off chance that sites get stored with a IHubCatalog in their
 * data.json, we will convert them back to the legacy format on load.
 * @param model
 * @returns
 */
export function _ensureLegacySiteCatalog(model: IModel): IModel {
  // Only apply to 1.8 or below.
  if (getProp(model, "item.properties.schemaVersion") > 1.8) return model;
  const catalog = model.data.catalog || {};
  if (!catalog.groups) {
    const legacy = catalogToLegacy(catalog);
    if (legacy.groups.length) {
      model.data.catalog = legacy;
    } else {
      model.data.catalog = { groups: [] };
    }
  }
  return model;
}
