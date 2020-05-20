import { IHubRequestOptions } from "@esri/hub-common";
import { getItemData } from "@esri/arcgis-rest-portal";

/**
 * Fetch the data for a site item by Id.
 * No schema upgrades are applied.
 * @param {String} id Item Id of the site
 * @param {IHubRequestOptions} hubRequestOptions
 */
export function _getSiteDataById(
  id: string,
  hubRequestOptions: IHubRequestOptions
) {
  // Note: this was migrated to ensure consistentcy but it should not be used
  return getItemData(id, hubRequestOptions).then(data => {
    if (data.values.groupId && !data.values.collaborationGroupId) {
      // some 2.0 sites were created with a groupId instead of a collaborationGroupId and then were migrated
      data.values.collaborationGroupId = data.values.groupId;
      delete data.values.groupId;
    }
    return data;
  });
}
