import { IHubRequestOptions } from "../../types";
import { _getAuthHeader } from "./_get-auth-header";
import { _getDomainServiceUrl } from "./_get-domain-service-url";
import { _checkStatusAndParseJson } from "./_check-status-and-parse-json";

/**
 * Remove all domain entries by site id.
 * User must be a member of the org that owns the domain entry.
 * @param {int} domainSiteId of the domain entries to remove
 * @param {IHubRequestOptions} hubRequestOptions`dom
 */
export function removeDomainsBySiteId(
  domainSiteId: string,
  hubRequestOptions: IHubRequestOptions
) {
  // TODO: Can remove this if no longer required
  if (hubRequestOptions.isPortal) {
    throw new Error(
      `removeDomainsBySiteId is not available in ArcGIS Enterprise. Instead, edit the hubdomain typekeyword on the item`
    );
  }

  const headers = _getAuthHeader(hubRequestOptions);
  headers["Content-Type"] = "application/json";

  const url = `${_getDomainServiceUrl(
    hubRequestOptions.hubApiUrl
  )}/?siteId=${domainSiteId}`;

  return fetch(url, { method: "DELETE", headers, mode: "cors" }).then(
    _checkStatusAndParseJson
  );
}
