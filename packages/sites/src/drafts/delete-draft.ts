import { IModel, IHubRequestOptions } from "@esri/hub-common";
import { removeItemResource } from "@esri/arcgis-rest-portal";
import { _getDraftResourceNames } from "./_get-draft-resource-names";

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
  return _getDraftResourceNames(id, hubRequestOptions).then(
    draftResourceNames =>
      Promise.all(
        draftResourceNames.map(resourceName =>
          removeItemResource({
            id,
            owner,
            resource: resourceName,
            portal: hubRequestOptions.portal,
            authentication: hubRequestOptions.authentication
          })
        )
      )
  );
}
