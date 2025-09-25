import { capitalize } from "../util";

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
  const match = MAP_OR_FEATURE_SERVER_URL_REGEX.exec(url);
  const mapOrFeature = match && match[1];
  return mapOrFeature && `${capitalize(mapOrFeature)} Service`;
};
