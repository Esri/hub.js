/**
 * Extract the domain service from the request options
 * @param {string} hubApiUrl
 * @private
 */
export function _getDomainServiceUrl(hubApiUrl?: string) {
  const base = hubApiUrl || "https://hub.arcgis.com";
  return `${base}/api/v3/domains`;
}
