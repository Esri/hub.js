import { IHubRequestOptions } from "@esri/hub-common";
import { _getAuthHeader } from "./_get-auth-header";
import { _getDomainServiceUrl } from "./_get-domain-service-url";
import { _checkStatusAndParseJson } from "./_check-status-and-parse-json";
import { IDomainEntry } from "./types";

/**
 * Create an entry in the domain system
 * @param {IHubDomain} domainEntry Domain hash to be stored
 * @param {IHubRequestOptions} hubRequestOptions
 */
export function addDomain(
  domainEntry: Partial<IDomainEntry>,
  hubRequestOptions: IHubRequestOptions
) {
  if (hubRequestOptions.isPortal) {
    throw new Error(
      `addDomain is not available in ArcGIS Enterprise. Instead, edit the hubdomain typekeyword on the item`
    );
  }
  const headers = _getAuthHeader(hubRequestOptions);
  headers["Content-Type"] = "application/json";
  const url = `${_getDomainServiceUrl(hubRequestOptions.hubApiUrl)}`;
  // handle case of siteTitle being numeric
  const title = domainEntry.siteTitle as unknown;
  if (typeof title === "number") {
    domainEntry.siteTitle = title.toString();
  }
  return fetch(url, {
    method: "POST",
    headers,
    mode: "cors",
    body: JSON.stringify(domainEntry)
  }).then(_checkStatusAndParseJson);
}
