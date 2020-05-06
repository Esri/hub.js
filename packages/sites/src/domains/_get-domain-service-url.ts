import { IHubRequestOptions } from "@esri/hub-common";

/**
 * Extract the domain service from the request options
 * @param {IHubRequestOptions} hubRequestOptions
 */
export function _getDomainServiceUrl(hubRequestOptions: IHubRequestOptions) {
  const base = hubRequestOptions.hubApiUrl || "https://hub.arcgis.com";
  return `${base}/utilities/domains`;
}
