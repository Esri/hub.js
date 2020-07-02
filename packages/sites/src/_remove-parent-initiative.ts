import { IModel, getProp, _unprotectAndRemoveItem } from "@esri/hub-common";
import { IUserRequestOptions } from "@esri/arcgis-rest-auth";

/**
 * Remove the parent initiative item, if it exists
 * Failsafe
 * @param {Object} siteModel Site Model
 * @param {IRequestOptions} requestOptions
 * @private
 */
export function _removeParentInitiative(
  siteModel: IModel,
  requestOptions: IUserRequestOptions
) {
  const parentInitiativeId = getProp(
    siteModel,
    "item.properties.parentInitiativeId"
  );
  if (parentInitiativeId) {
    const opts = Object.assign(
      { id: parentInitiativeId, owner: siteModel.item.owner },
      requestOptions
    );
    return _unprotectAndRemoveItem(opts);
  } else {
    return Promise.resolve();
  }
}
