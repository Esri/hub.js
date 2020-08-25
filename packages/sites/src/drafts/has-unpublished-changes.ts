import { IModel, includes } from "@esri/hub-common";
import { UNPUBLISHED_CHANGES_KW } from "./unpublished-changes-kw";

/**
 * Returns true if site or page model has unpublished changes
 * @param siteOrPageModel
 */
export function hasUnpublishedChanges(siteOrPageModel: IModel) {
  return includes(siteOrPageModel.item.typeKeywords, UNPUBLISHED_CHANGES_KW);
}
