import { queryFeatures, IQueryResponse } from "@esri/hub-common";
import { IRequestOptions } from "@esri/arcgis-rest-request";

/**
 * check if provided user has any survey submissions;
 * used in Hub when survey resultsAvailability is set to "after"
 * @private
 * @param {string} url feature service url
 * @param {string} username the username to check for survey responses
 * @param {IRequestOptions} requestOptions The request options
 * @returns {Promise<boolean>}
 */
export function hasUserResponded(
  url: string,
  username: string,
  requestOptions: IRequestOptions
): Promise<boolean> {
  const _url = `${url}/0`;
  const params = {
    where: `Creator = '${username}'`,
    returnCountOnly: true,
  };
  return queryFeatures({ url: _url, params, ...requestOptions }).then(
    ({ count }: IQueryResponse) => count > 0
  );
}
