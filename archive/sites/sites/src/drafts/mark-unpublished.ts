import { IModel, cloneObject, includes } from "@esri/hub-common";
import { UNPUBLISHED_CHANGES_KW } from "./unpublished-changes-kw";

/**
 * Returns a copy of the model marked as having unpublished changes
 * @param {*} siteOrPageModel
 * @param {*} hubRequestOptions
 */
export function markUnpublished(siteOrPageModel: IModel) {
  const model = cloneObject(siteOrPageModel);
  if (!includes(model.item.typeKeywords, UNPUBLISHED_CHANGES_KW)) {
    model.item.typeKeywords.push(UNPUBLISHED_CHANGES_KW);
  }
  return model;
}
