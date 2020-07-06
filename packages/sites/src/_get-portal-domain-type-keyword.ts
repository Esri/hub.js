/**
 * Return the Portal subdomain typekeyword
 * @param {string} subdomain Portal Subdomain
 * @private
 */
export function _getPortalDomainTypeKeyword(subdomain: string) {
  return `hubsubdomain|${subdomain}`.toLowerCase();
}
