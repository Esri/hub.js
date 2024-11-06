import { getProp } from "../../objects";
import { IHubCatalog } from "../../search/types/IHubCatalog";
import { getScopeGroupPredicate } from "../../search/utils";
import { IModel } from "../../types";
import { cloneObject } from "../../util";

/**
 * Converts the migrated catalog of a site model back into a legacy catalog format.
 * As the new catalog format is much more flexible than the legacy format, only supported
 * fields configurations (i.e., group ids) are transferred.
 *
 * @param modelToUpdate modified site model with a migrated catalog
 * @param currentModel currently persisted site model with a legacy catalog
 * @returns site model with any catalog group changes reflected in a legacy format
 */
export function convertCatalogToLegacyFormat(
  modelToUpdate: IModel,
  currentModel: IModel
): IModel {
  const updatedModel = cloneObject(modelToUpdate);
  const legacyCatalog = catalogToLegacy(updatedModel.data.catalog);
  // If the catalog has groups, we update the model with the legacy catalog
  if (legacyCatalog.groups.length) {
    updatedModel.data.catalog = legacyCatalog;
  } else {
    // This shouldn't happen, but in case something is malformed we protect the data integrity
    // by reverting to the catalog of the most recently fetched model
    updatedModel.data.catalog = cloneObject(currentModel.data.catalog);
    return updatedModel;
  }
  return updatedModel;
}

/**
 * Focused function converting an IHubCatalog to a legacy catalog format.
 * @param catalog
 * @returns
 */
export function catalogToLegacy(catalog: IHubCatalog): Record<string, any> {
  const legacyCatalog: Record<string, any> = {
    groups: [],
  };

  if (catalog.scopes?.item) {
    const groupPredicate = getScopeGroupPredicate(catalog.scopes.item);
    if (groupPredicate) {
      const groupIds = Array.isArray(groupPredicate.group)
        ? groupPredicate.group
        : [groupPredicate.group];
      legacyCatalog.groups = groupIds;
    }
  }

  return legacyCatalog;
}
