import { IModel, cloneObject } from "@esri/hub-common";
import { UNPUBLISHED_CHANGES_KW } from "./unpublished-changes-kw";

/**
 * Returns a copy of the model marked as having unpublished changes
 * @param {*} siteOrPageModel
 * @param {*} hubRequestOptions
 */
export function markPublished(siteOrPageModel: IModel) {
  const model = cloneObject(siteOrPageModel);
  model.item.typeKeywords = model.item.typeKeywords.filter(
    kw => kw !== UNPUBLISHED_CHANGES_KW
  );
  return model;
}
