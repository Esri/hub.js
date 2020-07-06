import {
  IModel,
  maybePush,
  getProp,
  _unprotectAndRemoveGroup
} from "@esri/hub-common";
import { IUserRequestOptions } from "@esri/arcgis-rest-auth";

/**
 * Remove the well-known team groups
 * Underlying calls are failsafe so this will never throw
 * but the groups may not be deleted
 * @param {Object} siteModel Site Model
 * @param {IRequestOptions} requestOptions
 * @private
 */
export function _removeSiteGroups(
  siteModel: IModel,
  requestOptions: IUserRequestOptions
) {
  const teamsToDelete = [
    "collaborationGroupId",
    "contentGroupId",
    "followersGroupId"
  ].reduce((acc, prop) => {
    return maybePush(getProp(siteModel, `item.properties.${prop}`), acc);
  }, []);

  const promises = teamsToDelete.map(id => {
    const opts = Object.assign({ id }, requestOptions);
    return _unprotectAndRemoveGroup(opts);
  });
  return Promise.all(promises);
}
