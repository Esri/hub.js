import { IHubRequestOptions } from "../../hub-types";
import { IHubSite } from "../../core/types/IHubSite";
import { ENTERPRISE_SITES_PATH } from "../../ArcGISContext";

const TYPEKEYWORD_SUBDOMAIN_PREFIX = "hubsubdomain";

/**
 * Get the subdomain type keyword
 * @param subdomain The subdomain to get the keyword for
 * @returns The subdomain type keyword
 */
export function getSubdomainKeyword(subdomain: string): string {
  return `${TYPEKEYWORD_SUBDOMAIN_PREFIX}|${subdomain.toLowerCase()}`;
}

/**
 * Adds/Updates the subdomain typekeyword
 * Returns a new array of keywords
 *
 * @param typeKeywords A collection of typekeywords
 * @param subdomain The subdomain to add/update
 * @returns An updated collection of typekeywords
 */
export function setSubdomainKeyword(
  typeKeywords: string[],
  subdomain: string
): string[] {
  // remove subdomain entry from array
  const updatedTypekeywords = typeKeywords.filter(
    (entry: string) => !entry.startsWith(`${TYPEKEYWORD_SUBDOMAIN_PREFIX}|`)
  );

  // now add it
  updatedTypekeywords.push(
    [TYPEKEYWORD_SUBDOMAIN_PREFIX, subdomain.toLowerCase()].join("|")
  );
  return updatedTypekeywords;
}

/**
 * Update the site properties related to subdomain
 * after the subdomain has been changed.
 * @param site The site to update
 * @param requestOptions
 */
export const handleSubdomainChange = (
  site: Partial<IHubSite>,
  requestOptions: IHubRequestOptions
): void => {
  // update the type keyword
  site.typeKeywords = setSubdomainKeyword(site.typeKeywords, site.subdomain);
  // update the URL
  site.url = `${requestOptions.authentication.portal.replace(
    `/sharing/rest`,
    ENTERPRISE_SITES_PATH
  )}/#/${site.subdomain}`;
};
