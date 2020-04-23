import { IHubRequestOptions } from "../types";
import { getProp } from "../objects";

/**
 * Return the culture from the Hub Request Options
 * In priority order: user.culture, portal.culture, en-us
 * @param {IHubRequestOptions} hubRequestOptions
 */
export function getCulture(hubRequestOptions: IHubRequestOptions) {
  return (
    getProp(hubRequestOptions, "portalSelf.user.culture") ||
    getProp(hubRequestOptions, "portalSelf.culture") ||
    "en-us"
  );
}
