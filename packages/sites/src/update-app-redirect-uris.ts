import { IHubRequestOptions } from "@esri/hub-common";
import { request } from "@esri/arcgis-rest-request";
import { getPortalApiUrl } from "@esri/hub-common";

/**
 * Update the redirect uri's that are valid for an existing app that's registered
 * for oAuth.
 * @param {string} clientId Client Id of the existing app to be updated
 * @param {Array} redirectUris Array of valid redirect uris for the app
 * @param {IRequestOptions} requestOptions
 */
export function updateAppRedirectUris(
  clientId: string,
  redirectUris: string[],
  requestOptions: IHubRequestOptions
) {
  const url = `${getPortalApiUrl(
    requestOptions
  )}/oauth2/apps/${clientId}/update`;
  const options = {
    method: "POST",
    authentication: requestOptions.authentication,
    params: {
      client_id: clientId,
      redirect_uris: JSON.stringify(redirectUris)
    }
  };

  return request(url, options);
}
