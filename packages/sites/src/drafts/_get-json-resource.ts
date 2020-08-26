import { IHubRequestOptions } from "@esri/hub-common";
import { getPortalUrl } from "@esri/arcgis-rest-portal";
import { request, IRequestOptions } from "@esri/arcgis-rest-request";

/**
 * Dog-eared for rest-js
 * @param {*} itemId
 * @param {*} resourceName
 * @param {*} requestOptions
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
