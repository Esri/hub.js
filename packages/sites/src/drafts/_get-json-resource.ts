import { getPortalUrl } from "@esri/arcgis-rest-portal";
import { request, IRequestOptions } from "@esri/arcgis-rest-request";

/**
 * Fetches a JSON resource and parses to an object
 * TODO: move to rest-js
 * @param {*} itemId
 * @param {*} resourceName
 * @param {*} requestOptions
 * @private
 */
export function _getJsonResource(
  itemId: string,
  resourceName: string,
  requestOptions: IRequestOptions
) {
  const url = `${getPortalUrl(
    requestOptions
  )}/content/items/${itemId}/resources/${resourceName}`;
  const options = Object.assign({ params: { f: "json" } }, requestOptions);
  return request(url, options);
}
