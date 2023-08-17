import { getProp } from "../../objects";
import { IPredicate, IQuery } from "../../search/types/IHubCatalog";
import { IModel } from "../../types";
import { cloneObject } from "../../util";

// TODO: consider exposing this so it can be used on the front end
function getGroupPredicate(scope: IQuery): IPredicate {
  const isGroupPredicate = (predicate: IPredicate) => !!predicate.group;
  const groupFilter = scope.filters.find((f) =>
    f.predicates.find(isGroupPredicate)
  );
  return groupFilter && groupFilter.predicates.find(isGroupPredicate);
}

export function convertCatalogToLegacyFormat(
  modelToUpdate: IModel,
  currentModel: IModel
): IModel {
  const updatedModel = cloneObject(modelToUpdate);
  const updatedItemScope = getProp(modelToUpdate, "data.catalog.scopes.item");
  const updatedGroupPredicate = getGroupPredicate(updatedItemScope);
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
