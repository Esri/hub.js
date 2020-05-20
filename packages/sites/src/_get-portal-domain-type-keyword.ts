/**
 * Return the Portal subdomain typekeyword
 * @param {string} subdomain Portal Subdomain
 */
export function _getPortalDomainTypeKeyword(subdomain: string) {
  return `hubsubdomain|${subdomain}`.toLowerCase();
}
