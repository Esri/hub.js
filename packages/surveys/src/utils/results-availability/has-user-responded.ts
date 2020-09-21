import { queryFeatures, IQueryResponse } from "@esri/arcgis-rest-feature-layer";
import { IRequestOptions } from "@esri/arcgis-rest-request";
import { IStakeholderItem } from "./types";

/**
 * check is provided user has any survey submissions
 * @param {IStakeholderItem.url} _url feature service url
 * @param {string} username the username to check for survey responses
 * @param {IRequestOptions} requestOptions The request options
 * @returns {Promise<boolean>}
 */
export const hasUserResponded = (
  _url: IStakeholderItem["url"],
  username: string,
  requestOptions: IRequestOptions
): Promise<boolean> => {
  const url = `${_url}/0`;
  const params = {
    where: `Creator = '${username}'`,
    returnCountOnly: true
  };
  return queryFeatures(Object.assign({ url, params }, requestOptions)).then(
    ({ count }: IQueryResponse) => count > 0
  );
};
