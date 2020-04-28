import { IHubRequestOptions } from "../types";

/**
 * Add a token to the resource request if the request is to the portal
 * @param {string} url Resource Url
 * @param {IRequestOptions} requestOptions
 */
export function _addTokenToResourceUrl(
  url: string,
  requestOptions: IHubRequestOptions
): string {
  let result = url;
  if (url.indexOf("token") === -1) {
    // no token
    if (url.indexOf(requestOptions.authentication.portal) > -1) {
      // is the portal
      result = `${url}?token=${requestOptions.authentication.token}`;
    }
  }
  return result;
}
