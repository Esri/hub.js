import { _getAuthHeader } from "./_get-auth-header";
import { IHubRequestOptions } from "@esri/hub-common";

/**
 * Validate a custom domain
 * @param {string} hostname to validate
 * @param {IHubRequestOptions} hubRequestOptions
 */
export function isValidDomain(
  hostname: string,
  hubRequestOptions: IHubRequestOptions
) {
  if (hubRequestOptions.isPortal) {
    throw new Error(`isValidDomain is not available in ArcGIS Enterprise.`);
  }
  const url = `${
    hubRequestOptions.hubApiUrl
  }/api/v3/domains/validate?hostname=${hostname}`;
  const headers = _getAuthHeader(hubRequestOptions);

  return fetch(url, { method: "GET", headers, mode: "cors" })
    .then(response => {
      return response.json();
    })
    .catch(e => {
      return {
        success: false,
        input: hostname,
        error: {
          code: 400,
          detail: e,
          message: "lookupFailed"
        }
      };
    });
}
