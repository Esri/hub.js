import { IHubRequestOptions } from "../types";
import { stripProtocol } from "../urls";
import { isGuid } from "../utils";
import { lookupDomain } from "./domains";
import { getSiteById } from "./get-site-by-id";

/**
 * Returns site model given various kinds of identifier
 *
 * @param identifier - a site item ID, site hostname, enterprise site slug, or full site URL
 * @param hubRequestOptions
 */
export function fetchSiteModel(
  identifier: string,
  hubRequestOptions: IHubRequestOptions
) {
  let prms;

  if (isGuid(identifier)) {
    prms = getSiteById(identifier, hubRequestOptions);
  } else {
    let hostnameOrSlug = identifier;

    // get down the the hostname
    hostnameOrSlug = stripProtocol(hostnameOrSlug);
    hostnameOrSlug = hostnameOrSlug.split("/")[0];

    prms = lookupDomain(hostnameOrSlug, hubRequestOptions).then(({ siteId }) =>
      getSiteById(siteId, hubRequestOptions)
    );
  }

  return prms;
}
