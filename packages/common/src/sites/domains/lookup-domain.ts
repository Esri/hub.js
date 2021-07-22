import { IHubRequestOptions, IDomainEntry } from "../../types";
import { _lookupPortal } from "./_lookup-portal";
import { _getDomainServiceUrl } from "./_get-domain-service-url";
import { _getAuthHeader } from "./_get-auth-header";
import { _checkStatusAndParseJson } from "./_check-status-and-parse-json";

/**
 * Fetch a the information about a domain.
 * Different implementation for Portal vs AGO
 * @param {string} hostname of domain record to locate
 * @param {IHubRequestOptions} hubRequestOptions
 */
export function lookupDomain(
  hostname: string,
  hubRequestOptions: IHubRequestOptions
): Promise<IDomainEntry | { hostname: string; siteId: string }> {
  if (hubRequestOptions.isPortal) {
    return _lookupPortal(hostname, hubRequestOptions);
  } else {
    const url = `${_getDomainServiceUrl(
      hubRequestOptions.hubApiUrl
    )}/${hostname}`;
    const headers = _getAuthHeader(hubRequestOptions);
    return fetch(url, { method: "GET", headers, mode: "cors" }).then(
      _checkStatusAndParseJson
    );
  }
}
