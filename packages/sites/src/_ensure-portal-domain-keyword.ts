import { _getPortalDomainTypeKeyword } from "./_get-portal-domain-type-keyword";
import { includes } from "@esri/hub-common";

/**
 * Ensure that an entry for the specified subdomain exists in the
 * typeKeyword array. Will also remove any other domain entries,
 * @param {String} subdomain Subdomain name
 * @param {Array} typeKeywords Array of typekeywords
 * @private
 */
export function _ensurePortalDomainKeyword(
  subdomain: string,
  typeKeywords: string[] = []
) {
  // if the current entry is in the keywords array, just return it
  const expectedKeyword = _getPortalDomainTypeKeyword(subdomain);
  if (includes(typeKeywords, expectedKeyword)) {
    return typeKeywords;
  } else {
    return typeKeywords.reduce(
      (acc, kw) => {
        if (!/^hubsubdomain/.test(kw)) {
          acc.push(kw);
        }
        return acc;
      },
      [expectedKeyword]
    );
  }
}
