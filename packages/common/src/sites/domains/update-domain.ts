import { IDomainEntry } from "../../types";
import { IHubRequestOptions } from "../../types";
import { _getAuthHeader } from "./_get-auth-header";
import { _getDomainServiceUrl } from "./_get-domain-service-url";
import { _checkStatusAndParseJson } from "./_check-status-and-parse-json";

/**
 * Update an entry in the domain system
 * @param {IHubDomain} domainEntry  Doman object to be updated
 * @param {IHubRequestOptions} hubRequestOptions
 */
export function updateDomain(
  domainEntry: IDomainEntry,
  hubRequestOptions: IHubRequestOptions
): Promise<any> {
  if (hubRequestOptions.isPortal) {
    throw new Error(
      `updateDomain is not available in ArcGIS Enterprise. Instead, edit the hubdomain typekeyword on the item`
    );
  }
  const headers = _getAuthHeader(hubRequestOptions);
  headers["Content-Type"] = "application/json";
  const url = `${_getDomainServiceUrl(hubRequestOptions.hubApiUrl)}/${
    domainEntry.id
  }`;
  // handle case of siteTitle being numeric
  const title = domainEntry.siteTitle as unknown;
  if (typeof title === "number") {
    domainEntry.siteTitle = title.toString();
  }

  // update client key to empty string if we have one, as it won't pass schema validation
  if (domainEntry.clientKey) {
    domainEntry.clientKey = "";
  }

  return fetch(url, {
    method: "PUT",
    headers,
    mode: "cors",
    body: JSON.stringify(domainEntry),
  }).then(_checkStatusAndParseJson);
}
