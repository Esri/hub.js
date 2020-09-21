import { IRequestOptions } from "@esri/arcgis-rest-request";
import { getProp } from "@esri/hub-common";
import { hasUserResponded } from "./has-user-responded";
import { IFormItem, IStakeholderItem } from "./types";

/**
 * check if Hub should link to results view of survey
 * @param {IFormItem} formItem survey form item json
 * @param {IStakeholderItem | null} stakeholderItem survey stakeholder view item json
 * @param {string} username the username to check for survey responses
 * @param {IRequestOptions} requestOptions The request options
 * @returns {Promise<boolean>}
 */
export const shouldDisplayResults = (
  formItem: IFormItem,
  stakeholderItem: IStakeholderItem | null,
  username: string,
  requestOptions: IRequestOptions
): Promise<boolean> => {
  let res = Promise.resolve(false);
  if (stakeholderItem) {
    if (
      getProp(formItem, "properties.settings.resultsAvailability") === "after"
    ) {
      res = hasUserResponded(stakeholderItem.url, username, requestOptions);
    } else {
      res = Promise.resolve(true);
    }
  }
  return res;
};
