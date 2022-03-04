import {
  getSiteById,
  IHubRequestOptions,
  IModel,
  isGuid,
  lookupDomain,
  stripProtocol,
} from "..";

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

/**
 * @private // keep out of docs
 */
/* istanbul ignore next */
export function fetchSite(
  identifier: string,
  hubRequestOptions: IHubRequestOptions
): Promise<IModel> {
  // eslint-disable-next-line no-console
  console.warn(
    `@esri/hub-commin::fetchSite is deprecated. Please use @esri/hub-common::fetchSiteModel instead`
  );
  return fetchSiteModel(identifier, hubRequestOptions);
}

export * from "./domains";
export * from "./drafts";
export * from "./_ensure-telemetry";
export * from "./get-site-by-id";
export * from "./site-schema-version";
export * from "./upgrade-site-schema";
export * from "./registerSiteAsApplication";
export * from "./HubSites";
export * from "./HubSiteManager";
export * from "./themes";
