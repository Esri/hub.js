import { getProp } from "../../objects";
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
  const updatedItemScope = getProp(modelToUpdate, "data.catalog.scopes.item");
  const updatedGroupPredicate = getScopeGroupPredicate(updatedItemScope);
  if (updatedGroupPredicate) {
    const updatedLegacyCatalog = cloneObject(currentModel.data.catalog);
    // TODO: Do we need to worry about whether predicate.group is an IMatchOption?
    const updatedGroupIds = Array.isArray(updatedGroupPredicate.group)
      ? updatedGroupPredicate.group
      : [updatedGroupPredicate.group];
    updatedLegacyCatalog.groups = updatedGroupIds;
    updatedModel.data.catalog = updatedLegacyCatalog;
  } else {
    // This shouldn't happen, but in case something is malformed we protect the data integrity
    // by reverting to the catalog of the most recently fetched model
    updatedModel.data.catalog = cloneObject(currentModel.data.catalog);
  }
  return updatedModel;
}
