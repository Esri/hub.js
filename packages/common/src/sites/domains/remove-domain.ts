import { IHubRequestOptions } from "../../types";
import { _getAuthHeader } from "./_get-auth-header";
import { _getDomainServiceUrl } from "./_get-domain-service-url";
import { _checkStatusAndParseJson } from "./_check-status-and-parse-json";

/**
 * Remove a domain entry.
 * User must be a member of the org that owns the domain entry.
 * @param {int} domainId Id of the domain entry to remove
 * @param {IHubRequestOptions} hubRequestOptions`dom
 */
export function removeDomain(
  domainId: string,
  hubRequestOptions: IHubRequestOptions
) {
  if (hubRequestOptions.isPortal) {
    throw new Error(
      `removeDomain is not available in ArcGIS Enterprise. Instead, edit the hubdomain typekeyword on the item`
    );
  }
  const headers = _getAuthHeader(hubRequestOptions);
  headers["Content-Type"] = "application/json";
  const url = `${_getDomainServiceUrl(
    hubRequestOptions.hubApiUrl
  )}/${domainId}`;
  return fetch(url, { method: "DELETE", headers, mode: "cors" }).then(
    _checkStatusAndParseJson
  );
}
