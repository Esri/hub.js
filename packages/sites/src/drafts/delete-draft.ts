import { IModel, IHubRequestOptions } from "@esri/hub-common";
import { removeItemResource } from "@esri/arcgis-rest-portal";
import { _getDraftResourceName } from "./_get-draft-resource-name";

/**
 * Given an item id, removes the current draft resource if exists
 * @param {*} siteOrPageId
 * @param {*} hubRequestOptions
 */
export function deleteDraft(
  siteOrPageModel: IModel,
  hubRequestOptions: IHubRequestOptions
) {
  const {
    item: { id, owner }
  } = siteOrPageModel;
  return _getDraftResourceName(id, hubRequestOptions).then(
    (draftResourceName: string) => {
      if (draftResourceName) {
        return removeItemResource({
          id,
          owner,
          resource: draftResourceName,
          portal: hubRequestOptions.portal,
          authentication: hubRequestOptions.authentication
        });
      }
    }
  );
}
