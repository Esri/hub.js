import { capitalize } from "../util";
export * from "./build-url";
export * from "./get-hub-locale-asset-url";
export * from "./get-portal-api-url";
export * from "./get-portal-url";
export * from "./hub-cdn-urlmap";
export * from "./upgrade-protocol";
export * from "./strip-protocol";
export * from "./_get-http-and-https-uris";
export * from "./_get-location";
export * from "./get-hub-api-url-from-portal";
export * from "./get-hub-url-from-portal";
export * from "./get-item-home-url";
export * from "./get-item-api-url";
export * from "./get-item-data-url";
export * from "./convert-urls-to-anchor-tags";
export * from "./getHubApiFromPortalUrl";
export * from "./getPortalBaseFromOrgUrl";
export * from "./getGroupHomeUrl";
export * from "./getUserHomeUrl";
export * from "./get-campaign-url";
export * from "./is-safe-redirect-url";
// For some reason, if this is exported here, random tests
// start failing. Resolved by moving to the root index
// export * from "./getCardModelUrl";

const MAP_OR_FEATURE_SERVER_URL_REGEX = /\/(map|feature)server/i;

/**
 *
 * @param url
 * @returns true if the url is of a map or feature service
 */
export const isMapOrFeatureServerUrl = (url: string) => {
  return MAP_OR_FEATURE_SERVER_URL_REGEX.test(url);
};

/**
 * parses map or feature service type from URL
 * @param url map or feature service URL
 * @returns item type, either "Map Service" or "Feature Service"
 * or undefined for other types of URLs
 */
export const getServiceTypeFromUrl = (url: string) => {
  const match = url.match(MAP_OR_FEATURE_SERVER_URL_REGEX);
  const mapOrFeature = match && match[1];
  return mapOrFeature && `${capitalize(mapOrFeature)} Service`;
};
