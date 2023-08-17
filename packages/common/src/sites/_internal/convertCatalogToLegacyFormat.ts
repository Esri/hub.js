import { getProp } from "../../objects";
import { getScopeGroupPredicate } from "../../search/utils";
import { IModel } from "../../types";
import { cloneObject } from "../../util";

export function convertCatalogToLegacyFormat(
  modelToUpdate: IModel,
  currentModel: IModel
): IModel {
  const updatedModel = cloneObject(modelToUpdate);
  const updatedItemScope = getProp(modelToUpdate, "data.catalog.scopes.item");
  const updatedGroupPredicate = getScopeGroupPredicate(updatedItemScope);
  if (updatedGroupPredicate) {
    const updatedLegacyCatalog = cloneObject(currentModel.data.catalog);
    // TODO: Do we need to worry about whether predicate.group is an array or not? This applies here and in opendata-ui
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
