import { IModel, mergeObjects, cloneObject } from "@esri/hub-common";
import { _includeListFromItemType } from "./_include-list-from-item-type";
import { IDraft } from "@esri/hub-common";

/**
 * Applies a draft resource to an item model
 * @param {*} siteOrPageModel
 * @param {*} draft
 */
export function applyDraft(siteOrPageModel: IModel, draft: IDraft) {
  if (!draft) return siteOrPageModel;
  const includeList = _includeListFromItemType(siteOrPageModel.item);
  return mergeObjects(draft, cloneObject(siteOrPageModel), includeList);
}
