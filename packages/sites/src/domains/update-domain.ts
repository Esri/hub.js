import { IDomainEntry } from "./types";
import { IHubRequestOptions } from "@esri/hub-common";
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
  const url = `${_getDomainServiceUrl(hubRequestOptions)}/${domainEntry.id}`;
  return fetch(url, {
    method: "PUT",
    headers,
    mode: "cors",
    body: JSON.stringify(domainEntry)
  }).then(_checkStatusAndParseJson);
}
