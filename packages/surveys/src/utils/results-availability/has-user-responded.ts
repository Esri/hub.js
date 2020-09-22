import { queryFeatures, IQueryResponse } from "@esri/arcgis-rest-feature-layer";
import { IRequestOptions } from "@esri/arcgis-rest-request";

/**
 * check if provided user has any survey submissions;
 * used in Hub when survey resultsAvailability is set to "after"
 * @param {string} url feature service url
 * @param {string} username the username to check for survey responses
 * @param {IRequestOptions} requestOptions The request options
 * @returns {Promise<boolean>}
 */
export const hasUserResponded = (
  url: string,
  username: string,
  requestOptions: IRequestOptions
): Promise<boolean> => {
  const _url = `${url}/0`;
  const params = {
    where: `Creator = '${username}'`,
    returnCountOnly: true
  };
  return queryFeatures(Object.assign({ url: _url, params }, requestOptions)).then(
    ({ count }: IQueryResponse) => count > 0
  );
};
