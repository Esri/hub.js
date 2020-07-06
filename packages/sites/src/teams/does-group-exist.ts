import { IHubRequestOptions } from "@esri/hub-common";
import { searchGroups } from "@esri/arcgis-rest-portal";

/**
 * Does a group with the specified title exist in the users org?
 * @param {String} title Group Title
 * @param {IHubRequestOptions} hubRequestOptions
 */
export function doesGroupExist(
  title: string,
  hubRequestOptions: IHubRequestOptions
) {
  const orgId = hubRequestOptions.portalSelf.id;
  const searchOpts = {
    q: `(title:"${title}" accountid:${orgId})`,
    authentication: hubRequestOptions.authentication
  };
  return searchGroups(searchOpts)
    .then(searchResponse => searchResponse.results.length > 0)
    .catch(err => {
      throw Error(`Error in team-utils::doesGroupExist ${err}`);
    });
}
