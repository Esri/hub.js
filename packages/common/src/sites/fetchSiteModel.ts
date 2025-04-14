import { IHubRequestOptions } from "../hub-types";
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
  hubRequestOptions: IHubRequestOptions,
  logger: any | undefined = null,
  reqID = ""
) {
  let prms;

  if (isGuid(identifier)) {
    prms = getSiteById(identifier, hubRequestOptions);
  } else {
    let hostnameOrSlug = identifier;

    // get down the the hostname
    hostnameOrSlug = stripProtocol(hostnameOrSlug);
    hostnameOrSlug = hostnameOrSlug.split("/")[0];
    if (logger) {
      logger.log(`looking-up-domain-${reqID}-${hostnameOrSlug}`);
    }

    prms = lookupDomain(hostnameOrSlug, hubRequestOptions).then(
      ({ siteId }) => {
        if (logger) {
          logger.log(`success-lookup-domain-${reqID}`);
          logger.log(`fetching-siteid-${reqID}-${siteId}`);
        }
        return getSiteById(siteId, hubRequestOptions).then((res) => {
          if (logger) {
            logger.log(`success-site-id-${reqID}-${siteId}`);
          }
          return res;
        });
      }
    );
  }

  return prms;
}
