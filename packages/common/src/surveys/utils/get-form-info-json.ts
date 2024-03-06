import { getItemInfo } from "@esri/arcgis-rest-portal";
import { IRequestOptions } from "@esri/arcgis-rest-request";

/**
 * This returns the /info/forminfo.json which simply has the form name and type.
 * We need the name so we can make the getFormInfo call
 * @param {string} id
 * @param {IRequestOptions} requestOptions
 * @returns {Promise}
 */
export const getFormInfoJson = (
  id: string,
  requestOptions: IRequestOptions
) => {
  return getItemInfo(id, {
    fileName: "forminfo.json",
    readAs: "json",
    ...requestOptions,
  });
};
