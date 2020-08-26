import { IModel, mergeObjects, cloneObject, getProp } from "@esri/hub-common";
import { _includeListFromItemType } from "./_include-list-from-item-type";
import { IDraft } from "./types";

/**
 * Applies a draft resource to an item model
 * @param {*} siteOrPageModel
 * @param {*} draft
 */
export function applyDraft(
  siteOrPageModel: IModel,
  draft: IDraft,
  isPortal: boolean
) {
  if (!draft) return siteOrPageModel;
  const includeList = _includeListFromItemType(
    getProp(siteOrPageModel, "item.type"),
    isPortal
  );
  return mergeObjects(draft, cloneObject(siteOrPageModel), includeList);
}
