import {
  IModel,
  IHubRequestOptions,
  objectToJsonBlob,
  getProp
} from "@esri/hub-common";
import { _includeListFromItemType } from "./_include-list-from-item-type";
import { buildDraft } from "./build-draft";
import { deleteDraft } from "./delete-draft";
import { addItemResource } from "@esri/arcgis-rest-portal";

/**
 * Given a site or page model, saves a draft
 *
 * NOTE - replaces current draft if exists
 * @param {*} siteOrPageModel
 * @param {*} hubRequestOptions
 */
export function saveDraft(
  siteOrPageModel: IModel,
  hubRequestOptions: IHubRequestOptions
) {
  const includeList = _includeListFromItemType(siteOrPageModel.item);
  const draft = buildDraft(siteOrPageModel, includeList);
  const draftBlob = objectToJsonBlob(draft);
  const draftName = `draft-${Date.now()}.json`;
  const itemId = getProp(siteOrPageModel, "item.id");

  return deleteDraft(siteOrPageModel, hubRequestOptions)
    .then(_ =>
      addItemResource({
        id: itemId,
        owner: getProp(siteOrPageModel, "item.owner"),
        resource: draftBlob,
        name: draftName,
        private: false,
        portal: hubRequestOptions.portal,
        authentication: hubRequestOptions.authentication
      })
    )
    .then((_: any) => draft);
}
